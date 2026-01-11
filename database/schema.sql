-- ============================================
-- Bitcoin Sovereign Academy Database Schema
-- PostgreSQL / Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Table
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  magic_link_token TEXT,
  magic_link_expires TIMESTAMP,
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_magic_link_token ON users(magic_link_token);

-- ============================================
-- Devices Table (For device management)
-- ============================================

CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_active_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_fingerprint ON devices(device_fingerprint);
CREATE INDEX idx_devices_active ON devices(user_id, is_active);

-- ============================================
-- Sessions Table
-- ============================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

-- Index for fast session lookups
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- ============================================
-- Entitlements Table
-- ============================================

CREATE TABLE entitlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entitlement_type VARCHAR(50) NOT NULL,  -- 'demo', 'workshop', 'path_monthly', 'path_annual', 'path_lifetime', 'all_access_monthly', 'all_access_annual'
  item_id TEXT,                           -- Specific demo/workshop/path ID, or NULL for all-access
  expires_at TIMESTAMP,                   -- NULL = lifetime access
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast entitlement lookups
CREATE INDEX idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX idx_entitlements_type ON entitlements(entitlement_type);
CREATE INDEX idx_entitlements_item ON entitlements(item_id);
CREATE INDEX idx_entitlements_active ON entitlements(user_id, is_active);
CREATE INDEX idx_entitlements_expires ON entitlements(expires_at);

-- ============================================
-- Payments Table
-- ============================================

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,           -- Store email even if user deleted
  product_id VARCHAR(100) NOT NULL,       -- 'demo_single', 'workshop_bundle', 'path_monthly_curious', etc.
  amount_usd DECIMAL(10, 2) NOT NULL,
  provider VARCHAR(50) NOT NULL,          -- 'stripe' or 'btcpay'
  provider_payment_id TEXT NOT NULL,      -- Stripe session ID or BTCPay invoice ID
  status VARCHAR(50) DEFAULT 'pending',   -- pending, completed, failed, refunded, cancelled
  metadata JSONB,                         -- Additional payment data
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast payment lookups
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_email ON purchases(email);
CREATE INDEX idx_purchases_provider_id ON purchases(provider, provider_payment_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_product ON purchases(product_id);

-- ============================================
-- Webhook Events Table (For Debugging)
-- ============================================

CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL,          -- 'stripe' or 'btcpay'
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for webhook event queries
CREATE INDEX idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- ============================================
-- Promo Codes Table (Future Feature)
-- ============================================

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL,     -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2),            -- Minimum purchase amount
  max_uses INTEGER,                       -- NULL = unlimited
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for promo code lookups
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active);

-- ============================================
-- Promo Code Usage Table
-- ============================================

CREATE TABLE promo_code_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMP DEFAULT NOW()
);

-- Index for promo code usage queries
CREATE INDEX idx_promo_usage_code_id ON promo_code_usage(promo_code_id);
CREATE INDEX idx_promo_usage_user_id ON promo_code_usage(user_id);

-- ============================================
-- Triggers
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entitlements_updated_at BEFORE UPDATE ON entitlements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Views for Analytics
-- ============================================

-- Revenue by month
CREATE VIEW revenue_by_month AS
SELECT
  DATE_TRUNC('month', paid_at) AS month,
  COUNT(*) AS purchase_count,
  SUM(amount_usd) AS total_revenue,
  AVG(amount_usd) AS avg_order_value
FROM purchases
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', paid_at)
ORDER BY month DESC;

-- Active users
CREATE VIEW active_users AS
SELECT
  COUNT(DISTINCT user_id) AS total_users,
  COUNT(DISTINCT CASE WHEN last_login_at > NOW() - INTERVAL '30 days' THEN user_id END) AS active_30d,
  COUNT(DISTINCT CASE WHEN last_login_at > NOW() - INTERVAL '7 days' THEN user_id END) AS active_7d
FROM users;

-- Content access stats
CREATE VIEW content_access_stats AS
SELECT
  entitlement_type,
  item_id,
  COUNT(*) AS access_count
FROM entitlements
WHERE is_active = TRUE
GROUP BY entitlement_type, item_id
ORDER BY access_count DESC;

-- ============================================
-- Sample Data (For Development)
-- ============================================

-- Insert sample promo code (development only)
-- INSERT INTO promo_codes (code, discount_type, discount_value, valid_until, is_active)
-- VALUES ('LAUNCH50', 'percentage', 50.00, NOW() + INTERVAL '30 days', TRUE);

-- ============================================
-- Row Level Security (RLS) - For Supabase
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can read their own sessions
CREATE POLICY sessions_select_own ON sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can delete their own sessions (logout)
CREATE POLICY sessions_delete_own ON sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Users can read their own entitlements
CREATE POLICY entitlements_select_own ON entitlements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can read their own devices
CREATE POLICY devices_select_own ON devices
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own devices
CREATE POLICY devices_update_own ON devices
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can read their own purchases
CREATE POLICY purchases_select_own ON purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- Functions
-- ============================================

-- Function to clean expired sessions
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

-- ============================================
-- Usage Events Table (For credits/metering)
-- ============================================

CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,                  -- demo ID, workshop ID, etc.
  event_type VARCHAR(50) NOT NULL,         -- 'demo_view', 'workshop_start', etc.
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_events_user_id ON usage_events(user_id);
CREATE INDEX idx_usage_events_item ON usage_events(item_id);
CREATE INDEX idx_usage_events_type ON usage_events(event_type);

-- ============================================
-- Subscription Management Table
-- ============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL,       -- 'path_monthly_curious', 'all_access_annual', etc.
  provider VARCHAR(50) NOT NULL,          -- 'stripe' or 'btcpay'
  provider_subscription_id TEXT,          -- Stripe subscription ID
  status VARCHAR(50) DEFAULT 'active',    -- active, cancelled, expired, past_due
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_provider_id ON subscriptions(provider, provider_subscription_id);

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user has access to content
CREATE OR REPLACE FUNCTION has_content_access(p_user_id UUID, p_item_id TEXT, p_item_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN := FALSE;
BEGIN
  -- Check for all-access entitlements
  SELECT EXISTS(
    SELECT 1 FROM entitlements
    WHERE user_id = p_user_id
    AND entitlement_type IN ('all_access_monthly', 'all_access_annual')
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO has_access;
  
  IF has_access THEN
    RETURN TRUE;
  END IF;
  
  -- Check for specific item access
  SELECT EXISTS(
    SELECT 1 FROM entitlements
    WHERE user_id = p_user_id
    AND item_id = p_item_id
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO has_access;
  
  IF has_access THEN
    RETURN TRUE;
  END IF;
  
  -- Check for path access (if item belongs to a path)
  IF p_item_type = 'module' THEN
    SELECT EXISTS(
      SELECT 1 FROM entitlements e
      WHERE e.user_id = p_user_id
      AND e.entitlement_type LIKE 'path_%'
      AND e.is_active = TRUE
      AND (e.expires_at IS NULL OR e.expires_at > NOW())
      AND p_item_id LIKE e.item_id || '%'  -- Simple path matching
    ) INTO has_access;
  END IF;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE users IS 'User accounts with magic link authentication';
COMMENT ON TABLE devices IS 'User devices for session management';
COMMENT ON TABLE sessions IS 'Active user sessions';
COMMENT ON TABLE entitlements IS 'User content access permissions';
COMMENT ON TABLE purchases IS 'One-time purchase transaction records';
COMMENT ON TABLE subscriptions IS 'Recurring subscription records';
COMMENT ON TABLE usage_events IS 'Content usage tracking for analytics';
COMMENT ON TABLE webhook_events IS 'Webhook event log for debugging';
COMMENT ON TABLE promo_codes IS 'Promotional discount codes';
COMMENT ON TABLE promo_code_usage IS 'Promo code redemption history';
