-- ============================================
-- Bitcoin Sovereign Academy - SAFE MIGRATION
-- ============================================
-- This script reconciles the partially-deployed schema
-- with the target schema. All operations are non-destructive:
-- - Uses IF NOT EXISTS for new tables/indexes
-- - Uses ADD COLUMN IF NOT EXISTS for new columns
-- - Preserves all existing data and columns
-- - Uses CREATE OR REPLACE for functions/views
-- ============================================
-- Run this in Supabase SQL Editor (one query)
-- ============================================

-- 1) Ensure UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2) USERS TABLE - Add missing columns
-- ============================================
-- Existing: id, email, password_hash, password_salt, is_email_verified,
--           email_verification_token, password_reset_token, password_reset_expires,
--           created_at, last_login_at, updated_at
-- Missing: magic_link_token, magic_link_expires

ALTER TABLE users ADD COLUMN IF NOT EXISTS magic_link_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS magic_link_expires TIMESTAMP;

-- Add missing indexes on users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_magic_link_token ON users(magic_link_token);

-- ============================================
-- 3) DEVICES TABLE - Create (does not exist)
-- ============================================

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

-- ============================================
-- 4) SESSIONS TABLE - Add missing columns
-- ============================================
-- Sessions already exists. Add any missing columns.

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_id UUID REFERENCES devices(id) ON DELETE CASCADE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS session_token TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ip_address INET;

-- Add missing indexes on sessions
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- ============================================
-- 5) ENTITLEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS entitlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entitlement_type VARCHAR(50) NOT NULL,
  item_id TEXT,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_type ON entitlements(entitlement_type);
CREATE INDEX IF NOT EXISTS idx_entitlements_item ON entitlements(item_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_active ON entitlements(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_entitlements_expires ON entitlements(expires_at);

-- ============================================
-- 6) PURCHASES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  amount_usd DECIMAL(10, 2) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_payment_id TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  metadata JSONB,
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_provider_id ON purchases(provider, provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_product ON purchases(product_id);

-- ============================================
-- 7) WEBHOOK EVENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);

-- ============================================
-- 8) PROMO CODES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);

-- ============================================
-- 9) PROMO CODE USAGE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promo_usage_code_id ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_user_id ON promo_code_usage(user_id);

-- ============================================
-- 10) USAGE EVENTS TABLE
-- ============================================

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

-- ============================================
-- 11) SUBSCRIPTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at TIMESTAMP,
  canceled_at TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(stripe_customer_id);

-- ============================================
-- 12) FUNCTIONS (CREATE OR REPLACE = safe)
-- ============================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Check content access
CREATE OR REPLACE FUNCTION has_content_access(p_user_id UUID, p_item_id TEXT, p_item_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM entitlements
    WHERE user_id = p_user_id
    AND entitlement_type IN ('all_access_monthly', 'all_access_annual')
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO has_access;

  IF has_access THEN RETURN TRUE; END IF;

  SELECT EXISTS(
    SELECT 1 FROM entitlements
    WHERE user_id = p_user_id
    AND item_id = p_item_id
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO has_access;

  IF has_access THEN RETURN TRUE; END IF;

  IF p_item_type = 'module' THEN
    SELECT EXISTS(
      SELECT 1 FROM entitlements e
      WHERE e.user_id = p_user_id
      AND e.entitlement_type LIKE 'path_%'
      AND e.is_active = TRUE
      AND (e.expires_at IS NULL OR e.expires_at > NOW())
      AND p_item_id LIKE e.item_id || '%'
    ) INTO has_access;
  END IF;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 13) TRIGGERS (safe: drop if exists, recreate)
-- ============================================

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_entitlements_updated_at ON entitlements;
CREATE TRIGGER update_entitlements_updated_at BEFORE UPDATE ON entitlements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchases_updated_at ON purchases;
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 14) VIEWS (CREATE OR REPLACE = safe)
-- ============================================

CREATE OR REPLACE VIEW revenue_by_month AS
SELECT
  DATE_TRUNC('month', paid_at) AS month,
  COUNT(*) AS purchase_count,
  SUM(amount_usd) AS total_revenue,
  AVG(amount_usd) AS avg_order_value
FROM purchases
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', paid_at)
ORDER BY month DESC;

CREATE OR REPLACE VIEW active_users AS
SELECT
  COUNT(DISTINCT id) AS total_users,
  COUNT(DISTINCT CASE WHEN last_login_at > NOW() - INTERVAL '30 days' THEN id END) AS active_30d,
  COUNT(DISTINCT CASE WHEN last_login_at > NOW() - INTERVAL '7 days' THEN id END) AS active_7d
FROM users;

CREATE OR REPLACE VIEW content_access_stats AS
SELECT
  entitlement_type,
  item_id,
  COUNT(*) AS access_count
FROM entitlements
WHERE is_active = TRUE
GROUP BY entitlement_type, item_id
ORDER BY access_count DESC;

-- ============================================
-- 15) ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Drop policies first (idempotent), then recreate
DROP POLICY IF EXISTS users_select_own ON users;
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS sessions_select_own ON sessions;
CREATE POLICY sessions_select_own ON sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS sessions_delete_own ON sessions;
CREATE POLICY sessions_delete_own ON sessions FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS entitlements_select_own ON entitlements;
CREATE POLICY entitlements_select_own ON entitlements FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS devices_select_own ON devices;
CREATE POLICY devices_select_own ON devices FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS devices_update_own ON devices;
CREATE POLICY devices_update_own ON devices FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS purchases_select_own ON purchases;
CREATE POLICY purchases_select_own ON purchases FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 16) IMPORTANT: Service role bypass policy
-- ============================================
-- Your API uses the service_role key which bypasses RLS.
-- This means your serverless functions can read/write all tables.
-- RLS only restricts the anon key (direct client access).
-- This is the correct setup for your architecture.

-- ============================================
-- 17) TABLE COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'User accounts with magic link + password authentication';
COMMENT ON TABLE devices IS 'User devices for session management';
COMMENT ON TABLE sessions IS 'Active user sessions';
COMMENT ON TABLE entitlements IS 'User content access permissions';
COMMENT ON TABLE purchases IS 'One-time purchase transaction records';
COMMENT ON TABLE subscriptions IS 'Recurring subscription records';
COMMENT ON TABLE usage_events IS 'Content usage tracking for analytics';
COMMENT ON TABLE webhook_events IS 'Webhook event log for debugging';
COMMENT ON TABLE promo_codes IS 'Promotional discount codes';
COMMENT ON TABLE promo_code_usage IS 'Promo code redemption history';

-- ============================================
-- DONE! Verify with:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' ORDER BY table_name;
-- ============================================
-- Expected tables (10):
--   devices, entitlements, promo_code_usage, promo_codes,
--   purchases, sessions, subscriptions, usage_events,
--   users, webhook_events
-- ============================================
