# SaaS Product Architect

[![Agent Skills: Compatible](https://img.shields.io/badge/Agent%20Skills-Compliant-blue.svg)](../../docs/skill-development-guide.md)
[![Status: Verified](https://img.shields.io/badge/Status-Verified-brightgreen.svg)](examples/saas-architecture-spec/test-architecture.js)

Guides the strategic conception, multi-tenant architecture, billing engine design, and MVP delivery of commercially viable SaaS software products. Enforces PRD authoring, user journey mapping, entitlement gating, and unit economics modeling.

---

## Quick Links
- **Primary Instructions:** [SKILL.md](SKILL.md)
- **Product Architecture References:**
  - [PRD & MVP Framework](references/prd-and-mvp-framework.md)
  - [Multi-Tenant Data Architecture](references/multi-tenant-data-architecture.md)
  - [Subscription & Billing Engine](references/subscription-and-billing-engine.md)
- **Production Blueprint:** [blueprint.md](examples/saas-architecture-spec/blueprint.md)
- **PostgreSQL RLS Schema:** [schema.sql](examples/saas-architecture-spec/schema.sql)
- **Automated Verification:** [test-architecture.js](examples/saas-architecture-spec/test-architecture.js)

---

## When to Activate
- Transforming rough software ideas into commercial SaaS specifications.
- Authoring Product Requirements Documents (PRDs) and scoping MoSCoW MVPs.
- Designing multi-tenant databases with Row-Level Security (RLS).
- Implementing recurring billing state machines, dunning, and tier entitlements.

---

## Verification
Run the SaaS product architecture and RLS verification suite:
```bash
node examples/saas-architecture-spec/test-architecture.js
```
