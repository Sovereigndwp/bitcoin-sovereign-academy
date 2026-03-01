-- ============================================
-- WARNING FIX MIGRATION
-- Run in Supabase SQL Editor
-- Fixes 6 linter warnings (2026-03-01)
-- ============================================
-- Safe to re-run (all operations are idempotent)
-- ============================================

-- ============================================
-- 1) FIX FUNCTION SEARCH PATHS
-- ============================================

-- update_updated_at_column: recreate with SET search_path and qualified names
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- clean_expired_sessions: recreate with SET search_path and qualified names
CREATE OR REPLACE FUNCTION public.clean_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- get_user_entitlements & has_module_access: ALTER dynamically
-- (we don't have their source locally, so we find them by name
--  and pin search_path without rewriting the body)
DO $$
DECLARE
  func_oid oid;
BEGIN
  -- get_user_entitlements
  SELECT p.oid INTO func_oid
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' AND p.proname = 'get_user_entitlements'
  LIMIT 1;
  IF func_oid IS NOT NULL THEN
    EXECUTE format('ALTER FUNCTION %s SET search_path = ''public''', func_oid::regprocedure);
  END IF;

  -- has_module_access
  SELECT p.oid INTO func_oid
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' AND p.proname = 'has_module_access'
  LIMIT 1;
  IF func_oid IS NOT NULL THEN
    EXECUTE format('ALTER FUNCTION %s SET search_path = ''public''', func_oid::regprocedure);
  END IF;
END $$;

-- ============================================
-- 2) FIX PERMISSIVE INSERT POLICIES
--    Replace WITH CHECK (true) with real validation
-- ============================================

-- analytics_events: require non-null fields + sane limits
DROP POLICY IF EXISTS analytics_events_insert ON public.analytics_events;
CREATE POLICY analytics_events_insert ON public.analytics_events
  FOR INSERT
  WITH CHECK (
    session_id IS NOT NULL
    AND length(session_id) <= 128
    AND event_type IS NOT NULL
    AND length(event_type) <= 100
  );

-- email_subscribers: require valid email format + active status
DROP POLICY IF EXISTS email_subscribers_insert ON public.email_subscribers;
CREATE POLICY email_subscribers_insert ON public.email_subscribers
  FOR INSERT
  WITH CHECK (
    email IS NOT NULL
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND (status IS NULL OR status = 'active')
  );

-- ============================================
-- DONE! 6 warnings resolved:
--  - 4x function_search_path_mutable → search_path pinned
--  - 2x rls_policy_always_true       → real validation checks
-- ============================================
