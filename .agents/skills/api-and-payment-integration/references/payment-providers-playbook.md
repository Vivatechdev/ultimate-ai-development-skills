# Payment Providers Architecture Playbook: Paystack, Flutterwave & Stripe

When integrating payment gateways into production applications, a single misunderstanding of verification lifecycles or currency subunits can cause severe revenue loss, double-charging, or fraudulent order fulfillment.

---

## The Cardinal Rule of Payment Engineering

> [!CAUTION]
> **NEVER trust a frontend payment callback or client redirect alone.**
> A malicious actor can inspect network traffic, forge a success callback URL (e.g. `callback?status=success&trxref=123`), and bypass payment entirely.
> **All order fulfillment, entitlement unlocking, and database updates MUST be driven by verified server-side API verification or cryptographically validated webhooks.**

---

## 1. Paystack Architecture

### 1.1 Currency Subunit Standard
Paystack amounts are represented in the smallest currency unit:
- Nigerian Naira (NGN): **Kobo** (e.g. ₦5,000 = `500000`).
- Ghanaian Cedi (GHS): **Pesewas** (e.g. GH₵50 = `5000`).
- South African Rand (ZAR): **Cents** (e.g. R100 = `10000`).

### 1.2 Payment Lifecycle
```text
1. Client Checkout Request ──> 2. App Server: POST https://api.paystack.co/transaction/initialize
                                   Payload: { email, amount: 500000, reference, callback_url }
                                   Header: Authorization: Bearer {PAYSTACK_SECRET_KEY}
                               3. Returns { authorization_url, reference, access_code }
4. Client Completes Payment on Authorization URL / Popup
                               5. Paystack Webhook Engine ──> POST /api/webhooks/paystack
                                   Header: x-paystack-signature
                               6. App Server: Verifies HMAC-SHA512(rawBody, SECRET_KEY)
                               7. App Server: Fulfills order idempotently
```

### 1.3 Server-Side Webhook Verification (HMAC-SHA512)
```javascript
const crypto = require('crypto');

function verifyPaystackWebhook(rawBody, signatureHeader, secretKey) {
  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(signatureHeader || '', 'hex')
  );
}
```

### 1.4 Direct Server-to-Server Fallback Verification
If the user returns to the application before the webhook arrives, query Paystack directly:
- **Endpoint:** `GET https://api.paystack.co/transaction/verify/:reference`
- **Verification Rule:** Confirm `response.data.status === 'success'` and `response.data.amount === expectedAmountInKobo`.

---

## 2. Flutterwave Architecture

### 2.1 Currency & Subunit Handling
Flutterwave amounts are passed as standard decimal figures (e.g., `amount: "5000.00"`), unlike Paystack/Stripe's subunit integers.

### 2.2 Payment Lifecycle & Server Verification
1. **Initialize Payment:**
   - **Endpoint:** `POST https://api.flutterwave.com/v3/payments`
   - **Headers:** `Authorization: Bearer {FLW_SECRET_KEY}`, `Content-Type: application/json`
   - **Payload:** `{ tx_ref, amount, currency: "NGN", redirect_url, customer: { email } }`
2. **Webhook Validation (`verif-hash`):**
   - Flutterwave transmits a secret hash configured in the dashboard in the header: `verif-hash`.
   - App Server validates: `req.headers['verif-hash'] === process.env.FLW_WEBHOOK_HASH`.
3. **Mandatory Transaction Verification (Double-Check):**
   - Even when a webhook arrives, Flutterwave best practice dictates verifying transaction ID directly:
   - **Endpoint:** `GET https://api.flutterwave.com/v3/transactions/:id/verify`
   - Confirm `response.data.status === "successful"` and `response.data.amount >= expectedAmount`.

---

## 3. Stripe Architecture

### 3.1 Currency Subunit Standard
Stripe amounts are passed in the smallest currency unit:
- USD: **Cents** ($50.00 = `5000`).
- EUR: **Cents** (€50.00 = `5000`).
- GBP: **Pence** (£50.00 = `5000`).
- JPY: **Zero-decimal currency** (¥5000 = `5000`).

### 3.2 PaymentIntent Lifecycle
1. **Create PaymentIntent on Server:**
   - **Endpoint:** `POST https://api.stripe.com/v1/payment_intents`
   - **Payload:** `{ amount: 5000, currency: "usd", automatic_payment_methods: { enabled: true } }`
   - Returns `client_secret` to client.
2. **Client Confirms via Stripe Elements / SDK:**
   - Card details never touch your application server (PCI-DSS compliant).
3. **Webhook Verification (`Stripe-Signature`):**
   - Header contains `t=timestamp,v1=signature`.
   - Webhook signature verifies `t + "." + rawBody` using HMAC-SHA256 with the endpoint secret.
   - **Replay Protection:** Verify that `timestamp` is within 5 minutes of current server time.
   - Use official SDK: `stripe.webhooks.constructEvent(rawBody, signatureHeader, endpointSecret)`.

