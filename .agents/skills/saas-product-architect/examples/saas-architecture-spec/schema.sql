-- =========================================================================
-- KURO FLEET TELEMETRY: MULTI-TENANT POSTGRESQL DDL SPECIFICATION
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tenants (Organizations / Accounts)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(63) NOT NULL UNIQUE,
  plan_tier VARCHAR(32) NOT NULL DEFAULT 'starter', -- starter, pro, enterprise
  subscription_status VARCHAR(32) NOT NULL DEFAULT 'trialing', -- trialing, active, past_due, canceled
  max_nodes_quota INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Users (Global user identities)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Memberships (RBAC link between User and Tenant)
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL DEFAULT 'member', -- owner, admin, member, viewer
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, user_id)
);

-- 4. Subscriptions & Billing State
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_subscription_id VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(32) NOT NULL, -- trialing, active, past_due, canceled
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Webhook Idempotency Registry
CREATE TABLE processed_webhooks (
  id VARCHAR(255) PRIMARY KEY, -- Stripe Event ID (evt_xxx)
  event_type VARCHAR(128) NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Domain Entity: Robotic Nodes (Scoped to Tenant)
CREATE TABLE robots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(128) NOT NULL,
  serial_number VARCHAR(64) NOT NULL,
  battery_health_pct NUMERIC(5,2) NOT NULL DEFAULT 100.0,
  current_temp_celsius NUMERIC(5,2) NOT NULL DEFAULT 25.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, serial_number)
);

-- Foreign Key & Composite Indexes
CREATE INDEX idx_memberships_tenant_user ON memberships(tenant_id, user_id);
CREATE INDEX idx_robots_tenant ON robots(tenant_id);

-- Enable Row-Level Security (RLS) on Domain Tables
ALTER TABLE robots ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_robots ON robots
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
