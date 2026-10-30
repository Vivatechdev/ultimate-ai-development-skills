---
name: api-and-payment-integration
description: Architect, integrate, and harden third-party REST/GraphQL APIs and payment gateways (Paystack, Flutterwave, Stripe). Enforces server-side transaction verification, cryptographic webhook validation, idempotency, and resilient backoff retries.
---

# API and Payment Integration Specialist

This skill governs the integration, security hardening, and resilient operation of third-party REST/GraphQL APIs and payment gateways (Paystack, Flutterwave, Stripe, PayPal). Operating as an experienced integration engineer, the agent enforces server-side transaction verification, cryptographic webhook validation, idempotency, and exponential backoff retry mechanisms while strictly safeguarding API secrets.

---

## 1. Purpose and Scope

### Scope
- Engineering resilient client integrations across 15 core dimensions: REST APIs, GraphQL, API authentication (Bearer, API keys, mTLS), OAuth 2.0 (PKCE), secret management, webhooks, request/response lifecycle, structured error handling, rate limiting (HTTP 429), exponential retries with jitter, idempotency keys, data mapping (DTOs), API documentation, contract integration testing, and telemetry.
- Architecting robust payment gateways:
  - **Paystack:** Initialization (`/transaction/initialize`), server-side verification (`/transaction/verify/:ref`), webhook validation (`x-paystack-signature` HMAC-SHA512), currency subunit conversion (kobo/pesewas).
  - **Flutterwave:** Payment initialization (`/v3/payments`), verification (`/v3/transactions/:id/verify`), webhook validation (`verif-hash`).
  - **Stripe:** PaymentIntents API, Stripe Elements, cryptographic webhook validation (`Stripe-Signature` HMAC-SHA256 with timestamp tolerance), customer billing portals, and refunds.
- Eliminating client-side trust vulnerabilities: all order fulfillment and entitlement granting must be driven strictly by server-side verification.

### Out of Scope
- Frontend visual design of checkout buttons or card styling (see `ui-ux-design-mastery`).
- Core multi-tenant database modeling (see `senior-fullstack-engineer` and `saas-product-architect`).
- Cloud container orchestration or server provisioning (see `devops-deployment`).

---

## 2. When to Activate the Skill

### Primary Triggers
Activate this skill whenever:
- Integrating third-party APIs (payment gateways, CRMs, email dispatchers, SMS gateways, external data providers).
- Implementing payment workflows with **Paystack**, **Flutterwave**, **Stripe**, or other payment aggregators.
- Authoring or securing webhook receivers, signature validation, or event dispatchers.
- Debugging third-party integration failures, timeout exceptions, rate-limit blocks (HTTP 429), or double-charging bugs.
- Configuring OAuth 2.0 authorization flows with external identity providers.
- The user requests: *"integrate Paystack / Stripe / Flutterwave"*, *"set up a payment webhook"*, *"verify transactions securely"*, *"add retry logic with exponential backoff"*, or *"implement an idempotency key engine"*.

### Anti-Triggers
- Building internal database queries with no external API connectivity.
- Styling static landing pages with no dynamic checkout or third-party integrations.

---

## 3. Required Pre-Integration Intake & Standards

Before writing any integration code, establish the technical baseline:

```text
┌────────────────────────────────────────────────────────┐
│             API & PAYMENT INTAKE ASSESSMENT            │
├────────────────────┬───────────────────────────────────┤
│ 1. Documentation   │ Official docs & current API version│
│ 2. Credentials     │ Test/Sandbox keys in .env.local   │
│ 3. Currency Units  │ Subunits (kobo/cents) vs Decimals │
│ 4. Webhook Engine  │ Raw unparsed body buffer access   │
│ 5. Idempotency     │ Deduplication store / table ready │
└────────────────────┴───────────────────────────────────┘
```

1. **Official Documentation as Authority:** *Never invent API endpoints, request parameters, or provider capabilities.* Use official documentation as the primary reference.
2. **The Cardinal Rule of Payment Verification:** *Never assume a successful frontend payment response means a transaction is complete.* All fulfillment must execute server-to-server.
3. **Secret Key Hygiene:** *Never expose secret keys (`sk_live_*`, `sk_test_*`) in frontend code or Git repositories.*

---

## 4. Step-by-Step Integration Workflow

Execute integrations across eight disciplined phases:

```
[ Phase 1: Official Docs Review & Contract Mapping ]
                         │
[ Phase 2: Secure Credential Injection & Environment Setup ]
                         │
[ Phase 3: Resilient HTTP Client (Timeouts & Retries) ]
                         │
[ Phase 4: Idempotency Key Architecture ]
                         │
[ Phase 5: Payment Initialization & Server-Side Verification ]
                         │
[ Phase 6: Webhook Endpoint Hardening (Raw Body & HMAC) ]
                         │
[ Phase 7: Observability, Error Handling & PII Sanitization ]
                         │
[ Phase 8: End-to-End Sandbox Verification & Reconciliation ]
```

### Phase 1: Official Docs Review & Contract Mapping
- Survey provider API documentation. Map request parameters and response schemas into strongly typed DTOs.
- Identify currency representation:
  - Paystack (NGN): Multiply amount by 100 (₦100.00 = `10000` kobo).
  - Stripe (USD): Multiply amount by 100 ($50.00 = `5000` cents).
  - Flutterwave (NGN): Decimal string/float (`5000.00`).

### Phase 2: Secure Credential Injection & Environment Setup
- Store provider secret keys exclusively in server-side environment variables (`PAYSTACK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `FLW_SECRET_KEY`).
- Provide only public publishable keys to the frontend (`pk_test_*`).

### Phase 3: Resilient HTTP Client Architecture
- Implement defensive HTTP requests adhering to [references/resilient-api-patterns.md](references/resilient-api-patterns.md):
  - Strict timeouts: Connect timeout (3–5s), read timeout (10–15s).
  - Exponential backoff with full jitter on transient status codes (`408`, `429`, `500`, `502`, `503`, `504`).
  - Honor `Retry-After` response headers when rate limited.

### Phase 4: Idempotency Key Architecture
- Transmit a unique `Idempotency-Key: {uuid}` header on all state-mutating requests (charge, transfer, refund) to prevent duplicate transactions on network retries.

### Phase 5: Payment Initialization & Server-Side Verification
- Consult [references/payment-providers-playbook.md](references/payment-providers-playbook.md).
- Create payment sessions on the backend; return session tokens / redirect URLs to the client.
- When client reports return, verify transaction directly against provider verification endpoints (`/transaction/verify/:ref` or `/v3/transactions/:id/verify`).
- Confirm both `status === 'success'` and `amount === expectedAmount` before updating user records.

### Phase 6: Webhook Endpoint Hardening
- Follow [references/oauth2-and-webhook-security.md](references/oauth2-and-webhook-security.md):
  - Capture **raw, unparsed body bytes** before JSON middleware parsing.
  - Compute expected cryptographic HMAC signature (Paystack: HMAC-SHA512; Stripe: HMAC-SHA256).
  - Use constant-time comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.
  - Validate timestamp tolerance to eliminate replay attacks.
  - Record processed event IDs in an idempotency table within a database transaction.

### Phase 7: Observability, Error Handling & PII Sanitization
- Sanitize logs to strip credit card numbers, CVVs, passwords, and authorization tokens.
- Map third-party error codes into user-friendly localized messages without leaking internal endpoints.

### Phase 8: End-to-End Sandbox Verification
- Execute end-to-end payment flows using official test card numbers and simulated webhook events.

---

## 5. Professional Standards & Best Practices

1. **Verify Amount and Currency on the Server:**
   - Attackers can manipulate client parameters to initiate a payment of ₦1 instead of ₦10,000. The server must verify that `verifiedAmount === order.expectedAmount`.
2. **Preserve Raw Webhook Body:**
   - Frameworks that parse JSON before signature validation alter byte formatting, causing HMAC verification failures. Preserve the raw `Buffer`.
3. **Use Constant-Time Signature Comparison:**
   - Always use `crypto.timingSafeEqual` for cryptographic signatures. Never use standard `===` operators.
4. **Enforce Request Timeouts:**
   - Never allow external API requests to hang indefinitely. Enforce strict 10-second request abort timers.
5. **Idempotent Webhook Processing:**
   - Payment providers retry webhooks up to 72 hours if your server fails to respond. Ensure your webhook handler is fully idempotent.

---

## 6. Decision-Making Guidelines

```text
Selecting Payment Provider for Regional Footprint
├─ Is the primary market Africa (Nigeria, Ghana, Kenya, South Africa)?
│  ├─ Multi-currency & cards/bank transfers/USSD/MoMo? ──> Paystack (Preferred) or Flutterwave.
│  └─ Global / North America / Europe?
│     ├─ Global cards, Apple Pay, multi-country tax compliance? ──> Stripe.
│     └─ Merchant of Record (MoR) handling sales tax worldwide? ──> Paddle / LemonSqueezy.
```

---

## 7. Common Mistakes & Anti-Patterns to Avoid

| Prohibited Anti-Pattern | Correct Senior Integration Practice |
| :--- | :--- |
| **Fulfilling Orders from Client Callback URLs** | Fulfill strictly from verified server-to-server API verification or verified webhooks. |
| **Exposing Secret Keys in Frontend (`sk_live`)** | Restrict secret keys to backend environments; expose only public keys (`pk_live`). |
| **Parsing JSON before Webhook Verification** | Capture raw byte buffer (`express.raw()`) for cryptographic signature verification. |
| **Using `===` for Signature Comparison** | Use `crypto.timingSafeEqual` to prevent timing attacks. |
| **Currency Subunit Mismatch (Charging $5 instead of $500)** | Accurately calculate subunits: multiply by 100 for NGN kobo, USD cents, EUR cents. |
| **Unbounded HTTP Calls with No Timeout** | Wrap all external `fetch`/`axios` calls with `AbortController` (10s timeout). |

---

## 8. Practical Implementation Examples

### Paystack Webhook Verification & Idempotent Fulfillment

```javascript
const crypto = require('crypto');

app.post('/api/webhooks/paystack', express.raw({ type: '*/*' }), async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  // 1. Compute HMAC SHA-512 over raw body
  const hash = crypto.createHmac('sha512', secretKey).update(req.body).digest('hex');

  // 2. Constant-time comparison
  const isValid = crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(signature || '', 'hex'));
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const event = JSON.parse(req.body.toString());

  // 3. Process event with database idempotency
  if (event.event === 'charge.success') {
    const { reference, amount } = event.data;
    await orderService.fulfillIfPaid(reference, amount);
  }

  res.sendStatus(200);
});
```

---

## 9. Quality Assurance Checklist

Verify every API and payment integration against this checklist:
- [ ] **Secret Isolation:** Secret keys (`sk_*`) stored exclusively in server environment; zero keys in frontend or git.
- [ ] **Server-Side Verification:** All transactions verified via provider API or verified webhook; zero fulfillment from client parameters.
- [ ] **Currency Subunits Confirmed:** Amounts multiplied correctly (e.g. kobo/cents $\times 100$).
- [ ] **Cryptographic Webhooks:** Signatures verified over raw bytes using constant-time comparison (`timingSafeEqual`).
- [ ] **Replay Protection:** Timestamps checked within a 5-minute tolerance window.
- [ ] **Idempotency Protection:** `Idempotency-Key` headers sent on mutations; webhook event IDs deduplicated in database.
- [ ] **Resilient Client:** Timeouts configured (connect 5s, read 10s); exponential backoff with full jitter on 429/5xx.
- [ ] **Sanitized Logging:** Credit card numbers, CVVs, and auth tokens stripped from all application logs.

---

## 10. Completion Criteria

An API and payment integration task is complete when:
1. Provider API contracts and authentication lifecycles are implemented using official documentation.
2. Transactions are verified server-to-server with amount and currency checks.
3. Webhook endpoints enforce raw-body HMAC signature validation and idempotent processing.
4. Outbound HTTP requests enforce timeouts, exponential backoff retries, and idempotency keys.
5. All items on the Quality Assurance Checklist are verified via sandbox test transactions.
