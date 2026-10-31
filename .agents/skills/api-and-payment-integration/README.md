# API & Payment Integration Specialist

[![Agent Skills: Compatible](https://img.shields.io/badge/Agent%20Skills-Compliant-blue.svg)](../../docs/skill-development-guide.md)
[![Status: Verified](https://img.shields.io/badge/Status-Verified-brightgreen.svg)](examples/payment-gateway-testbed/test-payments.js)

Architect, integrate, and harden third-party REST/GraphQL APIs and payment gateways (Paystack, Flutterwave, Stripe). Enforces server-side transaction verification, cryptographic webhook validation, idempotency, and resilient backoff retries.

---

## Quick Links
- **Primary Instructions:** [SKILL.md](SKILL.md)
- **Integration References:**
  - [Payment Providers Playbook (Paystack, Flutterwave, Stripe)](references/payment-providers-playbook.md)
  - [Resilient API Patterns (Backoff, Idempotency, Timeouts)](references/resilient-api-patterns.md)
  - [OAuth 2.0 & Webhook Security](references/oauth2-and-webhook-security.md)
- **Integration Engine:** [gateway-adapters.js](examples/payment-gateway-testbed/gateway-adapters.js), [resilient-client.js](examples/payment-gateway-testbed/resilient-client.js)
- **Verification Suite:** [test-payments.js](examples/payment-gateway-testbed/test-payments.js)

---

## When to Activate
- Integrating payment gateways (Paystack, Flutterwave, Stripe, PayPal).
- Validating and hardening webhook handlers with cryptographic HMAC signatures.
- Building resilient HTTP client wrappers with exponential backoff and idempotency keys.
- Implementing OAuth 2.0 Authorization Code with PKCE.

---

## Verification
Run the multi-gateway payment and webhook verification suite:
```bash
node examples/payment-gateway-testbed/test-payments.js
```
