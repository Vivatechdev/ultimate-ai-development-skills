# SaaS Subscription & Billing Architecture

A resilient billing engine must handle the complete recurring subscription lifecycle, feature entitlement gating, usage metering, and asynchronous webhook synchronization without desynchronizing application state from payment gateways (Stripe, Paddle).

---

## 1. Subscription Lifecycle State Machine

```
               [ User Signs Up ]
                       │
                       ▼
                 [ trialing ] ──(Trial Expires Without Card)──> [ canceled ]
                       │
             (Card Added / Paid)
                       ▼
                 [ active ] <────────────────────────┐
                  │      ▲                           │
    (Payment Fails)      (Invoice Paid in Dunning)   │
                  ▼      │                           │
                [ past_due ]                         │
                  │                                  │
     (Max Retries Exceeded / Unpaid)                 │
                  ▼                                  │
                [ canceled ]                         │
                  │                                  │
           (User Reactivates)                        │
                  └──────────────────────────────────┘
```

### State Definitions & Access Rules

| State | Gateway Status (Stripe) | Customer Access Allowed? | Operational Behavior |
| :--- | :--- | :---: | :--- |
| **`trialing`** | `trialing` | ✅ Yes | Full access to tier features. Prompt user to add payment method prior to trial expiry. |
| **`active`** | `active` | ✅ Yes | Normal operations. Quotas enforced based on plan tier. |
| **`past_due`** | `past_due` | ⚠️ Grace Period (Yes, 7 days) | Display prominent in-app billing alert ("Payment failed. Update payment method to prevent service suspension"). |
| **`unpaid` / `canceled`**| `canceled` / `unpaid` | ❌ No | Lock mutation endpoints. Downgrade tenant to Free/Read-Only tier. Redirect all actions to billing portal. |
| **`paused`** | `paused` | ❌ Read-Only | Preserve customer data without charging. Allow unpausing anytime. |

---

## 2. Feature Entitlement & Limit Gating

Never hardcode plan checks in application business logic (`if (plan === 'pro')`). Implement a centralized **Entitlement Gating Service**:

```typescript
export interface PlanEntitlements {
  maxMembers: number;
  maxProjects: number;
  advancedAnalytics: boolean;
  auditLogsRetentionDays: number;
  apiRateLimitPerMin: number;
}

export const PLAN_LIMITS: Record<string, PlanEntitlements> = {
  starter: {
    maxMembers: 3,
    maxProjects: 5,
    advancedAnalytics: false,
    auditLogsRetentionDays: 7,
    apiRateLimitPerMin: 60
  },
  pro: {
    maxMembers: 20,
    maxProjects: 100,
    advancedAnalytics: true,
    auditLogsRetentionDays: 90,
    apiRateLimitPerMin: 600
  },
  enterprise: {
    maxMembers: 1000,
    maxProjects: 10000,
    advancedAnalytics: true,
    auditLogsRetentionDays: 365,
    apiRateLimitPerMin: 3000
  }
};

export class EntitlementGuard {
  static async assertCanCreateProject(tenant: Tenant, currentProjectCount: number): Promise<void> {
    const limits = PLAN_LIMITS[tenant.planTier];
    if (currentProjectCount >= limits.maxProjects) {
      const err = new Error(`Project limit reached (${limits.maxProjects}) for plan '${tenant.planTier}'. Please upgrade your subscription.`);
      err.name = 'EntitlementLimitExceeded';
      throw err;
    }
  }
}
```

---

## 3. Webhook Synchronization & Idempotency

Payment gateways dispatch webhooks asynchronously. Always process webhooks with strict idempotency:

1. **`customer.subscription.created` / `.updated`:** Update `tenants.subscription_status`, `tenants.plan_tier`, `tenants.current_period_end`.
2. **`invoice.payment_failed`:** Set `subscription_status = 'past_due'`; send transactional dunning notification.
3. **`customer.subscription.deleted`:** Set `subscription_status = 'canceled'`; downgrade tenant permissions to read-only.
4. **Idempotency Store:** Record `event.id` in a `processed_webhook_events` table within a database transaction. If `event.id` has already been processed, return `200 OK` immediately.

