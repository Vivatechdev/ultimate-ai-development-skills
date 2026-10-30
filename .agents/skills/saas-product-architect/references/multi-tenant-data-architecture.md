# Multi-Tenant Data Architecture & Isolation Strategies

Multi-tenancy is the architectural cornerstone of SaaS software. Designing multi-tenant data storage requires balancing security isolation, blast radius, operational complexity, and infrastructure unit economics.

---

## 1. The Three Tenant Isolation Models

| Model | Architecture | Isolation Level | Infrastructure Cost | Operational Complexity | Best Suited For |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **1. Pooled (Shared DB, Shared Schema)** | All tenants share the same database and tables. Every row includes `tenant_id`. Enforced via app logic or DB Row-Level Security (RLS). | Logical | 🟢 **Lowest** (Scale to 100k+ tenants efficiently) | 🟢 **Lowest** (Single schema to migrate) | **95% of B2B SaaS**, self-serve freemium, high-volume products. |
| **2. Bridge (Shared DB, Schema-per-Tenant)** | All tenants share one database cluster, but each tenant has their own isolated PostgreSQL schema (`tenant_acme.*`). | Schema | 🟡 **Moderate** (Connection pooling overhead) | 🔴 **High** (Running 5,000 migrations on release) | Mid-market SaaS, clients requiring custom schema extensions. |
| **3. Silo (Database-per-Tenant)** | Every tenant has an isolated physical or logical database instance. | Physical | 🔴 **Highest** (Cost scales linearly per tenant) | 🔴 **Very High** (Complex orchestration & backups) | Enterprise healthcare (HIPAA), government, defense, sovereign data laws. |

---

## 2. The Pooled Architecture Standard (Production Recommended)

For standard SaaS applications, use the **Pooled Model with PostgreSQL Row-Level Security (RLS)**:

```sql
-- 1. Core Tenant Entity
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(63) NOT NULL UNIQUE,
  plan_tier VARCHAR(32) NOT NULL DEFAULT 'starter', -- starter, pro, enterprise
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tenant Membership (Many-to-Many User to Tenant with RBAC)
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL DEFAULT 'member', -- owner, admin, member, billing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, user_id)
);

-- 3. Application Domain Table with Multi-Tenant Protection
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row-Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON projects
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
```

### Application Connection Middleware (Setting Tenant Context):
```typescript
// On every incoming request:
await db.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${req.user.tenantId}';`);
```

---

## 3. Tenant Resolution Strategies

How does the application know which tenant is making the request?

1. **Subdomain Resolution (`acme.app.com`):**
   - Ideal for B2B applications where organizations want custom branded URLs.
   - Requires wildcard DNS (`*.app.com`) and reverse-proxy SSL management.
2. **Path-Prefix Resolution (`app.com/:tenantSlug/dashboard`):**
   - Easiest to manage, zero DNS or SSL configuration overhead.
   - Clean user switching between multiple organizations using the same user login.
3. **Session Header Resolution (`X-Tenant-Id` or JWT claim):**
   - Ideal for mobile apps, single-page apps (SPAs), and REST/GraphQL APIs.
   - Server validates that `req.user` has active membership in the requested `X-Tenant-Id`.
