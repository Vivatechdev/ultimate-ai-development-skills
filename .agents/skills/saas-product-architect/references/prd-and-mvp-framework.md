# SaaS PRD, MVP Scoping & Unit Economics Framework

Transforming raw product concepts into commercially viable software demands ruthless scope prioritization, precise user journey mapping, and realistic unit economics modeling.

---

## 1. Production SaaS PRD Template

Every SaaS product architecture engagement should begin with a structured Product Requirements Document (PRD):

```markdown
# [Product Name] — Product Requirements Document (PRD)

## 1. Executive Summary & Value Proposition
- **One-Sentence Pitch:** For [target customer] who [has problem], [Product Name] is a [category] that [key benefit], unlike [alternatives].
- **Core Value Proposition:** Quantifiable efficiency gain or revenue driver (e.g., "Reduces compliance audit preparation from 3 weeks to 15 minutes").

## 2. Target Customer & User Personas
- **Primary Economic Buyer:** (e.g. VP of Engineering / CFO — controls budget).
- **Daily End-User Persona:** (e.g. Lead DevOps Engineer / Senior Developer — uses tool daily).
- **Pain Points:** 3 concrete, painful, recurring bottlenecks experienced today.

## 3. Success Metrics & Key Results (OKRs)
- **Activation Metric (Time to First Value):** New user completes first core action within <5 minutes of signup.
- **Retention Metric:** >= 60% of workspaces active in week 4.
- **Monetization Target:** Average Revenue Per Account (ARPA) >= $150/mo.

## 4. Feature Specifications & MoSCoW Prioritization
- **Must Have (MVP Launch Blocker):** Core features required to deliver the primary value promise.
- **Should Have (Next Fast-Follow):** Critical enhancements expected shortly after launch.
- **Could Have (Future Roadmap):** Nice-to-have capabilities to consider once product-market fit is established.
- **Won't Have (Explicitly Out of Scope for MVP):** Intentional omissions to prevent scope creep.

## 5. Non-Functional Requirements (NFRs)
- **Performance:** P95 API response latency < 200ms; dashboard initial paint < 1.2s.
- **Availability:** 99.9% uptime SLA.
- **Security & Compliance:** SOC2 Type II readiness, GDPR data export/deletion API.
- **Tenant Isolation:** Zero cross-tenant data leakage.
```

---

## 2. The 5-Stage SaaS User Journey Map

Map the user's psychological and functional journey from stranger to advocate:

```
[ 1. Discovery & Frictionless Signup ]
       │  - Zero unnecessary fields (Email + Password or Google/GitHub OAuth).
       ▼
[ 2. Workspace Provisioning & Team Onboarding ]
       │  - Tenant slug selection, instant organization creation, invite colleagues.
       ▼
[ 3. The "Aha!" Moment (First Core Value) ]
       │  - Under 3 minutes. Seed with realistic demo data or 1-click import.
       ▼
[ 4. Daily Habit Loop & Collaboration ]
       │  - Team notifications, automated telemetry updates, Slack/Discord digests.
       ▼
[ 5. Entitlement Limit Reached & Expansion Trigger ]
       │  - Seamless upgrade prompt to unlock higher tier quotas or enterprise SSO.
```

---

## 3. SaaS Unit Economics & Infrastructure Cost Modeling

A SaaS product that costs more to host per customer than it charges is doomed. Model unit economics early:

### 3.1 Gross Margin Target
Aim for **75% to 85% SaaS Gross Margins** (Cost of Goods Sold / Hosting must not exceed 15–25% of subscription revenue).

### 3.2 COGS Components to Model:
1. **Database Compute & Storage:** Pooled PostgreSQL instance cost amortized across active tenants (~$0.05–$0.20 per active tenant/month).
2. **Compute / Containers:** Serverless or container replicas scaled to request volume (~$0.10–$0.50 per tenant/month).
3. **Third-Party API & LLM Token Budgets:**
   - If using LLMs (e.g. Gemini / Claude): Strict prompt token budgeting and per-tenant rate limits.
   - Example: 50 requests/day $\times$ 1,000 tokens $\times$ \$0.001/1k tokens = \$1.50/month per user.
4. **Transactional Email / SMS:** SendGrid/Postmark ($0.001 per email).
5. **Payment Processing:** Stripe takes 2.9% + $0.30 per transaction.
