-- ============================================
-- SECURITY FIX MIGRATION
-- Run in Supabase SQL Editor
-- Fixes all 14 linter errors + creates missing tables
-- ============================================
-- Safe to re-run (all operations are idempotent)
-- Your API uses service_role key which BYPASSES RLS,
-- so none of your serverless functions will break.
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 0) CREATE MISSING TABLES
-- ============================================

-- devices
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_active_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_fingerprint ON devices(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_devices_active ON devices(user_id, is_active);

-- usage_events
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_usage_events_user_id ON usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_item ON usage_events(item_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON usage_events(event_type);

-- analytics_events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  page_path TEXT,
  referrer TEXT,
  props JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);

-- email_subscribers
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  page TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active'
);
CREATE INDEX IF NOT EXISTS idx_email_subs_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_subs_email ON email_subscribers(email);

-- ============================================
-- 1) ENABLE RLS ON ALL PUBLIC TABLES
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2) POLICIES FOR USER-FACING TABLES
--    (users can read/update their own rows)
-- ============================================

-- users
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- sessions
DROP POLICY IF EXISTS sessions_select_own ON public.sessions;
CREATE POLICY sessions_select_own ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS sessions_delete_own ON public.sessions;
CREATE POLICY sessions_delete_own ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);

-- entitlements
DROP POLICY IF EXISTS entitlements_select_own ON public.entitlements;
CREATE POLICY entitlements_select_own ON public.entitlements
  FOR SELECT USING (auth.uid() = user_id);

-- subscriptions
DROP POLICY IF EXISTS subscriptions_select_own ON public.subscriptions;
CREATE POLICY subscriptions_select_own ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- purchases
DROP POLICY IF EXISTS purchases_select_own ON public.purchases;
CREATE POLICY purchases_select_own ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

-- devices
DROP POLICY IF EXISTS devices_select_own ON public.devices;
CREATE POLICY devices_select_own ON public.devices
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS devices_update_own ON public.devices;
CREATE POLICY devices_update_own ON public.devices
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 3) SERVER-ONLY TABLES (no public access)
--    RLS enabled + no policies = anon key blocked
--    service_role key bypasses RLS = API still works
-- ============================================

-- webhook_events: no public policies (server-only)
DROP POLICY IF EXISTS webhook_events_deny_all ON public.webhook_events;

-- promo_codes: read-only for authenticated users (to validate codes)
DROP POLICY IF EXISTS promo_codes_select_active ON public.promo_codes;
CREATE POLICY promo_codes_select_active ON public.promo_codes
  FOR SELECT USING (is_active = true);

-- promo_code_usage: no public policies (server-only)
DROP POLICY IF EXISTS promo_code_usage_deny_all ON public.promo_code_usage;

-- usage_events: no public policies (server-only)
DROP POLICY IF EXISTS usage_events_deny_all ON public.usage_events;

-- analytics_events: insert-only for anon (frontend can write, can't read)
DROP POLICY IF EXISTS analytics_events_insert ON public.analytics_events;
CREATE POLICY analytics_events_insert ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- email_subscribers: insert-only for anon (frontend can write, can't read)
DROP POLICY IF EXISTS email_subscribers_insert ON public.email_subscribers;
CREATE POLICY email_subscribers_insert ON public.email_subscribers
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 4) FIX SECURITY DEFINER VIEWS
--    Recreate with security_invoker = true
-- ============================================

DROP VIEW IF EXISTS public.active_users;
CREATE VIEW public.active_users
  WITH (security_invoker = true)
AS
SELECT
  COUNT(DISTINCT id) AS total_users,
  COUNT(DISTINCT CASE WHEN last_login_at > NOW() - INTERVAL '30 days' THEN id END) AS active_30d,
  COUNT(DISTINCT CASE WHEN last_login_at > NOW() - INTERVAL '7 days' THEN id END) AS active_7d
FROM public.users;

DROP VIEW IF EXISTS public.revenue_by_month;
CREATE VIEW public.revenue_by_month
  WITH (security_invoker = true)
AS
SELECT
  DATE_TRUNC('month', paid_at) AS month,
  COUNT(*) AS purchase_count,
  SUM(amount_usd) AS total_revenue,
  AVG(amount_usd) AS avg_order_value
FROM public.purchases
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', paid_at)
ORDER BY month DESC;

DROP VIEW IF EXISTS public.content_access_stats;
CREATE VIEW public.content_access_stats
  WITH (security_invoker = true)
AS
SELECT
  entitlement_type,
  item_id,
  COUNT(*) AS access_count
FROM public.entitlements
WHERE is_active = TRUE
GROUP BY entitlement_type, item_id
ORDER BY access_count DESC;

-- ============================================
-- DONE! All 14 linter errors should be resolved:
--  - 7x rls_disabled_in_public      → RLS enabled
--  - 2x policy_exists_rls_disabled  → RLS enabled
--  - 3x security_definer_view       → security_invoker
--  - 2x sensitive_columns_exposed   → RLS protects them
-- ============================================
