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
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token TEXT,
  password_reset_token TEXT,
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(email_verification_token);
CREATE INDEX idx_users_reset_token ON users(password_reset_token);

-- ============================================
-- Sessions Table
-- ============================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  modules TEXT[] DEFAULT '{}',           -- Array of module IDs
  paths TEXT[] DEFAULT '{}',             -- Array of path IDs
  access_token TEXT UNIQUE,              -- JWT token for API access
  purchase_date TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,                  -- NULL = lifetime access
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast entitlement lookups
CREATE INDEX idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX idx_entitlements_access_token ON entitlements(access_token);

-- ============================================
-- Payments Table
-- ============================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,           -- Store email even if user deleted
  provider VARCHAR(50) NOT NULL,          -- 'stripe' or 'btcpay'
  provider_payment_id TEXT NOT NULL,      -- Stripe session ID or BTCPay invoice ID
  amount_usd DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL,                   -- Cart items purchased
  status VARCHAR(50) DEFAULT 'pending',   -- pending, completed, failed, refunded
  metadata JSONB,                         -- Additional payment data
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast payment lookups
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_email ON payments(email);
CREATE INDEX idx_payments_provider_id ON payments(provider, provider_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

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
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
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

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Views for Analytics
-- ============================================

-- Revenue by month
CREATE VIEW revenue_by_month AS
SELECT
  DATE_TRUNC('month', paid_at) AS month,
  COUNT(*) AS payment_count,
  SUM(amount_usd) AS total_revenue,
  AVG(amount_usd) AS avg_order_value
FROM payments
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
  UNNEST(modules) AS module_id,
  COUNT(*) AS access_count
FROM entitlements
GROUP BY module_id
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
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

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

-- Users can read their own payments
CREATE POLICY payments_select_own ON payments
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

-- Function to get user entitlements
CREATE OR REPLACE FUNCTION get_user_entitlements(user_email TEXT)
RETURNS TABLE (
  modules TEXT[],
  paths TEXT[],
  access_token TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT e.modules, e.paths, e.access_token
  FROM entitlements e
  JOIN users u ON e.user_id = u.id
  WHERE u.email = user_email
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to check module access
CREATE OR REPLACE FUNCTION has_module_access(user_email TEXT, module_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT module_id = ANY(e.modules) INTO has_access
  FROM entitlements e
  JOIN users u ON e.user_id = u.id
  WHERE u.email = user_email;

  RETURN COALESCE(has_access, FALSE);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE users IS 'User accounts with authentication data';
COMMENT ON TABLE sessions IS 'Active user sessions';
COMMENT ON TABLE entitlements IS 'User content access permissions';
COMMENT ON TABLE payments IS 'Payment transaction records';
COMMENT ON TABLE webhook_events IS 'Webhook event log for debugging';
COMMENT ON TABLE promo_codes IS 'Promotional discount codes';
COMMENT ON TABLE promo_code_usage IS 'Promo code redemption history';
