---
name: saas-product-architect
description: Guides the strategic conception, multi-tenant architecture, billing engine design, and MVP delivery of commercially viable SaaS software products. Enforces PRD authoring, user journey mapping, entitlement gating, and unit economics modeling.
---

# SaaS Product Architect

This skill governs the strategic conception, technical architecture, and commercial execution of software-as-a-service (SaaS) products. Operating as a senior SaaS product architect and systems designer, the agent transforms rough concepts into focused, scalable, multi-tenant software platforms with robust subscription billing, granular role hierarchies, and defensible unit economics.

---

## 1. Purpose and Scope

### Scope
- Authoring comprehensive Product Requirements Documents (PRDs), feature specifications, and user journey maps.
- Defining MVP boundaries using the MoSCoW framework (Must-have, Should-have, Could-have, Won't-have) to prevent scope creep.
- Designing multi-tenant data storage models (Pooled with PostgreSQL Row-Level Security, Bridge, or Silo) and tenant resolution mechanics.
- Structuring authentication, workspace provisioning, and team invitation onboarding funnels.
- Architecting subscription billing engines (Stripe / Paddle), recurring state machines, and feature entitlement gating services.
- Designing administrative dashboards (Tenant Admin vs Internal Super-Admin) with telemetry, audit logs, and churn tracking.
- Modeling SaaS unit economics (infrastructure Cost of Goods Sold, token budgets, gross margin targets $\ge 75\%$).

### Out of Scope
- Direct visual styling, typography pairings, or CSS animations (see `ui-ux-design-mastery`).
- Manual visual QA and mobile viewport audits (see `visual-qa-and-ui-audit`).
- Low-level database index optimization and query refactoring (see `senior-fullstack-engineer`).

---

## 2. When to Activate the Skill

### Primary Triggers
Activate this skill whenever:
- Planning, designing, or scoping a new SaaS product, web platform, or multi-tenant software service.
- Structuring subscription tiers (Free, Pro, Enterprise), pricing models, and billing state machines.
- Creating product requirements documents (PRDs), user journey maps, or MVP roadmaps.
- Designing multi-tenant database architectures or team/workspace permission systems.
- Evaluating the commercial viability, unit economics, or feature prioritization of a software idea.
- The user requests: *"design a SaaS product architecture"*, *"write a PRD for this app idea"*, *"design a multi-tenant subscription system"*, *"scope an MVP"*, or *"map user onboarding and billing workflows"*.

### Anti-Triggers
- Single-user local utility scripts or offline CLI tools.
- Open-source libraries with no commercial, tenant, or subscription dimensions.

---

## 3. Required Strategic Intake & Assessment

Before proposing software architecture, evaluate the product across **15 core SaaS dimensions**:

```text
┌────────────────────────────────────────────────────────┐
│             SAAS STRATEGIC INTAKE MATRIX               │
├────────────────────┬───────────────────────────────────┤
│ 1. Target Audience │ Economic buyer vs daily end-user  │
│ 2. Core Problem    │ Urgent, painful, recurring bottleneck│
│ 3. Value Prop      │ Quantifiable ROI / time savings   │
│ 4. MVP Boundary    │ Minimal set delivering value      │
│ 5. MoSCoW Scope    │ Must / Should / Could / Won't have│
│ 6. User Journeys   │ Acquisition to "Aha!" moment      │
│ 7. Roles & RBAC    │ Owner, Admin, Member, Guest       │
│ 8. DB Isolation    │ Pooled (RLS) vs Schema vs Silo    │
│ 9. Auth & Onboard  │ Frictionless signup & workspace   │
│ 10. Billing Engine │ Subscription lifecycle & gating   │
│ 11. Admin Console  │ Tenant controls & internal health │
│ 12. Integrations   │ Webhooks, OAuth, email, CRM       │
│ 13. Scalability    │ Background queues, cache, read-ops│
│ 14. Security/Legal │ GDPR export/erase, SOC2, RLS      │
│ 15. Unit Economics │ COGS per tenant & gross margins   │
└────────────────────┴───────────────────────────────────┘
```

1. **Rule of Customer Focus:** *Do not add features simply because they are technically possible.* Every feature must directly solve an identified customer problem.
2. **Rule of Existing Systems:** When evaluating an existing application, inspect current schemas, active users, and code dependencies before proposing architectural changes.

---

## 4. Step-by-Step Architecture Workflow

Execute SaaS product development across eight disciplined phases:

```
[ Phase 1: Problem Definition & Value Proposition ]
                         │
[ Phase 2: PRD Authoring & MoSCoW MVP Scoping ]
                         │
[ Phase 3: User Journey Mapping & Time-to-Value ]
                         │
[ Phase 4: Multi-Tenant Database Architecture ]
                         │
[ Phase 5: Authentication, RBAC & Workspace Onboarding ]
                         │
[ Phase 6: Subscription Lifecycle & Entitlement Gating ]
                         │
[ Phase 7: Administrative Dashboards & Integrations ]
                         │
[ Phase 8: Unit Economics, Privacy & Scalability Sign-Off ]
```

### Phase 1: Problem Definition & Value Proposition
- Formulate the one-sentence product positioning statement.
- Identify the primary economic buyer (controls payment) and daily user personas. Consult [references/prd-and-mvp-framework.md](references/prd-and-mvp-framework.md).

### Phase 2: PRD Authoring & MoSCoW MVP Scoping
- Draft the Product Requirements Document (PRD) detailing user stories, success metrics, and non-functional requirements.
- Ruthlessly separate MVP launch requirements (Must-haves) from post-launch enhancements (Should/Could-haves).

### Phase 3: User Journey Mapping & Time-to-Value
- Design the onboarding funnel: Signup $\rightarrow$ Workspace Creation $\rightarrow$ First Core Value ("Aha!" moment) $\rightarrow$ Team Collaboration $\rightarrow$ Upgrade Trigger.
- Minimize friction: require only essential fields; defer billing entry until value is experienced.

### Phase 4: Multi-Tenant Database Architecture
- Select tenant isolation model using [references/multi-tenant-data-architecture.md](references/multi-tenant-data-architecture.md).
- Default to the **Pooled Model with PostgreSQL Row-Level Security (RLS)** for maximum resource efficiency.
- Establish schema with explicit `tenant_id` foreign keys and cascading delete rules.

### Phase 5: Authentication, RBAC & Workspace Onboarding
- Structure organization hierarchy: `tenants` $\rightarrow$ `memberships` $\rightarrow$ `users`.
- Define standard role permissions: `Owner` (billing + delete), `Admin` (invite + config), `Member` (read/write domain entities), `Viewer` (read-only).

### Phase 6: Subscription Lifecycle & Entitlement Gating
- Implement the 5-state subscription machine: `trialing`, `active`, `past_due`, `canceled`, `paused`. Consult [references/subscription-and-billing-engine.md](references/subscription-and-billing-engine.md).
- Implement a centralized `EntitlementGuard` service to enforce plan quotas before allowing entity creation.
- Ensure all webhook events (`customer.subscription.updated`, `invoice.payment_failed`) update local tenant state idempotently.

### Phase 7: Administrative Dashboards & Integrations
- Plan **Tenant Admin:** User management, billing portal link, API keys, audit logs.
- Plan **Internal Super-Admin:** Global MRR/churn tracking, tenant impersonation, feature flag toggles, system telemetry.

### Phase 8: Unit Economics, Privacy & Scalability Sign-Off
- Calculate hosting cost per active tenant; target $\ge 75\%$ gross margins.
- Provide GDPR-compliant automated endpoints for tenant data export and irreversible deletion.

---

## 5. Professional Standards & Best Practices

1. **The Pooled Architecture Rule:**
   - 95% of SaaS applications should use a shared database with `tenant_id` and Row-Level Security. Do not spin up separate database instances per tenant without legal/compliance mandates.
2. **Centralized Entitlement Checks:**
   - Never scatter `if (user.plan === 'pro')` across UI templates. Enforce limits via a server-side `EntitlementGuard`.
3. **Idempotent Webhook Processing:**
   - Record `event_id` in a database table inside a transaction. Never process duplicate payment webhooks.
4. **Time-to-First-Value Under 5 Minutes:**
   - Seed new workspaces with realistic demonstration artifacts so users understand value before configuring settings.
5. **Dunning & Grace Periods:**
   - Allow a 7-day grace period on `past_due` invoices with persistent in-app warnings before locking tenant access.

---

## 6. Decision-Making Guidelines

```text
Selecting Pricing & Monetization Model
├─ Is value tied directly to seat count (collaboration / team tools)?
│  ├─ YES ──> Per-Seat Pricing ($15/seat/mo). Simple, predictable.
│  └─ NO
│     ├─ Is value tied to compute, storage, or volume (APIs, logs, emails)?
│     │  ├─ YES ──> Usage-Based Metering ($0.01 per 1k events) with overage caps.
│     │  └─ NO  ──> Tiered Feature Packages (Starter, Pro, Enterprise).
```

---

## 7. Common Mistakes & Anti-Patterns to Avoid

| Prohibited Anti-Pattern | Correct Senior SaaS Architect Practice |
| :--- | :--- |
| **Feature Bloat (Adding features just because you can)** | Solve 1–2 customer pain points exceptionally well in the MVP. |
| **Database-per-Tenant Premature Optimization** | Use pooled multi-tenancy with PostgreSQL RLS; scale to thousands of tenants cheaply. |
| **Client-Side Entitlement Checks** | Validate quotas on the server before database inserts; return 402/403 on limit breach. |
| **Requiring Credit Card Before Value** | Offer frictionless free trials or freemium tiers to accelerate activation. |
| **Ignoring Unit Economics** | Model hosting compute, database I/O, and LLM token costs per tenant before pricing. |

---

## 8. Practical Implementation Examples

### Entitlement Guard Pattern (TypeScript)

```typescript
export class EntitlementGuard {
  static async checkCanCreateResource(tenant: Tenant, resourceCount: number): Promise<void> {
    const limits = PLAN_LIMITS[tenant.planTier];
    if (resourceCount >= limits.maxAllowed) {
      const err = new Error(`Quota limit reached (${limits.maxAllowed}) for plan '${tenant.planTier}'. Upgrade required.`);
      err.name = 'QuotaExceededError';
      (err as any).statusCode = 402; // Payment Required
      throw err;
    }
  }
}
```

---

## 9. Quality Assurance Checklist

Verify every SaaS product architecture blueprint against this checklist:
- [ ] **PRD Completed:** Problem, target personas, value proposition, and success metrics documented.
- [ ] **MoSCoW Prioritization:** Clear separation between MVP launch blockers and post-launch roadmap.
- [ ] **Multi-Tenant Schema:** Tables include `tenant_id` with foreign key indexes and RLS policies.
- [ ] **Role Hierarchy:** Clear permissions for Owner, Admin, Member, and Viewer.
- [ ] **Subscription State Machine:** Handles `trialing`, `active`, `past_due`, and `canceled` states gracefully.
- [ ] **Server-Side Entitlement Gating:** Plan limits enforced on the server before entity creation.
- [ ] **Idempotent Webhooks:** Gateway events recorded in database with deduplication.
- [ ] **Unit Economics Validated:** Estimated infrastructure COGS yields $\ge 75\%$ gross margins.
- [ ] **Privacy & Compliance:** GDPR data export and tenant deletion protocols defined.

---

## 10. Completion Criteria

A SaaS product architecture engagement is complete when:
1. The PRD and feature specifications are finalized with explicit MVP boundaries.
2. The multi-tenant database schema is modeled with referential integrity and isolation policies.
3. The subscription lifecycle and entitlement gating architecture are fully defined.
4. User onboarding journeys and time-to-value paths are documented.
5. All checklist criteria pass validation with realistic unit economics modeling.

