# SaaS Architectural Blueprint: Kuro Fleet Telemetry

**Product:** Kuro Fleet Telemetry — Real-time telemetry, predictive maintenance, and battery health monitoring for autonomous industrial logistics fleets.

---

## 1. Product Requirements Document (PRD)

### 1.1 Problem Statement & Value Proposition
- **Problem:** Enterprise warehouse operators run mixed fleets of autonomous mobile robots (AMRs). Batteries fail unpredictably, halting fulfillment lines for an average of 42 minutes per incident and costing \$18,000 in delayed shipments.
- **Value Proposition:** Kuro predicts battery thermal degradation 72 hours before failure, scheduling automated charging and servicing without taking production lines offline.
- **Target Persona:** 
  - *Economic Buyer:* VP of Supply Chain / Warehouse Director (evaluated on line uptime & fulfillment SLA).
  - *Daily End-User:* Fleet Maintenance Lead (monitors alerts, schedules pod battery swaps).

### 1.2 Success Metrics (OKRs)
- **Time to First Value:** New customer connects first robot telemetric stream in < 10 minutes.
- **Line Uptime Impact:** Zero unplanned battery stalls across active customer facilities.
- **Monetization Target:** $49/month per connected robotic node (Average ACV \$24,000/yr).

---

## 2. Feature Specifications & MoSCoW Prioritization

| Priority Tier | Feature | User Value | Architectural Scope |
| :--- | :--- | :--- | :--- |
| **Must Have (MVP)** | Ingestion API for robot telemetry | Stream battery voltage, temperature, and cycle count | MQTT / REST ingest endpoint with token authentication |
| **Must Have (MVP)** | Multi-tenant organization portal | Manage fleet, invite technicians, view alerts | Pooled PostgreSQL database with Row-Level Security |
| **Must Have (MVP)** | Subscription billing & node metering | Automate monthly invoicing per connected robot | Stripe Billing with usage-based quantity subscription |
| **Must Have (MVP)** | Automated thermal alert triggers | Instant notification when battery exceeds 55°C | In-memory evaluation worker + email/webhook dispatch |
| **Should Have (v1.1)** | Slack & PagerDuty webhook dispatch | Route alerts to existing operational tools | Outbound webhook dispatcher with exponential backoff |
| **Could Have (v1.2)** | Predictive ML degradation model | 72-hour lookahead degradation curves | Nightly batch forecast worker via BigQuery / Spark |
| **Won't Have (MVP)** | On-premise air-gapped deployment | Enterprise compliance for defense sector | Deferred to Phase 3 Enterprise expansion |

---

## 3. End-to-End User Journey Map

```
1. Discovery (Self-Serve Signup)
   - Lead registers via work email. Zero credit card required for 14-day trial.
         │
         ▼
2. Workspace Creation & Token Provisioning
   - Organization created (`acme-robotics`). Ingestion API Key generated immediately.
         │
         ▼
3. "Aha!" Moment (<10 Mins)
   - User pastes 1-line curl script or Python SDK snippet into 1 robot controller.
   - Kuro dashboard immediately lights up with live battery temperature and telemetry chart.
         │
         ▼
4. Team Collaboration & Threshold Configuration
   - Owner invites 2 maintenance engineers. Configures thermal threshold alerts.
         │
         ▼
5. Fleet Expansion & Subscription Conversion
   - Day 12: Robot count reaches 15. In-app banner prompts upgrade to Pro tier ($49/node/mo).
   - Stripe Checkout completes; Stripe webhook activates subscription state in database.
```

---

## 4. Multi-Tenant Role-Based Access Control (RBAC)

| Role | Telemetry Read | Manage Alerts | Manage Team | Billing & Subscription | Delete Workspace |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Owner** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Member** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Viewer** | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 5. Technical Implementation & Migration Plan

- **Phase 1 (Week 1–2):** Core multi-tenant PostgreSQL schema, authentication, and RLS policies.
- **Phase 2 (Week 3–4):** High-throughput ingest endpoint, telemetry storage, and real-time dashboard UI.
- **Phase 3 (Week 5–6):** Stripe webhook processor, entitlement gating service, and automated team invites.
- **Phase 4 (Week 7):** End-to-end integration testing, visual QA, and security audit sign-off.

