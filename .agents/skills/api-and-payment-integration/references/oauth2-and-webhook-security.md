# OAuth 2.0 Architecture & Webhook Security Standards

Integrating third-party platforms requires strict authorization handshakes and cryptographic webhook integrity validation.

---

## 1. OAuth 2.0 Authorization Code Flow with PKCE

For web applications, SPAs, and mobile apps communicating with third-party APIs (Google, GitHub, Slack, QuickBooks), the **Authorization Code Flow with Proof Key for Code Exchange (PKCE)** is mandatory (RFC 7636).

```
[ Client / Browser ] ── 1. Generates code_verifier & code_challenge (SHA-256)
        │
        ├── 2. Redirects to Provider Authorization URL with ?code_challenge=... ──> [ Identity Provider ]
        │                                                                                  │
        │ <── 3. Provider redirects back with authorization ?code=... ────────────────────┘
        │
[ App Server ] ── 4. POST /oauth/token { code, code_verifier, client_id, secret } ──> [ Identity Provider ]
        │                                                                                  │
        │ <── 5. Returns { access_token (short-lived), refresh_token } ────────────────────┘
```

### Key Security Requirements:
- **`state` Parameter:** Always generate a cryptographically random `state` parameter stored in an `HttpOnly` cookie to prevent CSRF attacks during the OAuth callback.
- **Refresh Token Rotation:** Every time a new `access_token` is retrieved using a `refresh_token`, invalidate the old refresh token and issue a replacement.

---

## 2. Webhook Cryptographic Verification Architecture

Webhooks are public HTTP `POST` endpoints exposed to the internet. An attacker can easily spoof incoming webhook requests unless cryptographic signature verification is strictly enforced.

### 2.1 The Raw Body Preservation Rule
Cryptographic signatures are generated over the **exact raw byte stream** received across the network. If your web framework parses the body as JSON before verification (modifying whitespace, key order, or character encoding), the signature will fail to verify.

```javascript
// Express.js Example: Capture raw body Buffer exclusively for webhook routes
app.use('/api/webhooks', express.raw({ type: '*/*' }));
```

### 2.2 Replay Attack Prevention
Always verify the timestamp embedded in the signature header:
```javascript
function verifyTimestamp(timestampHeader, maxToleranceSeconds = 300) {
  const eventTime = parseInt(timestampHeader, 10);
  const currentTime = Math.floor(Date.now() / 1000);

  if (Math.abs(currentTime - eventTime) > maxToleranceSeconds) {
    throw new Error('Webhook rejected: Timestamp exceeds 5-minute replay tolerance window');
  }
}
```

### 2.3 Timing-Attack Safe Comparison
Never use standard string equality (`hash === signatureHeader`). A standard equality comparison returns `false` on the first mismatched byte, leaking timing information that allows attackers to iteratively reconstruct the signature.

Always use **Constant-Time Comparison**:
```javascript
const crypto = require('crypto');

function safeCompare(a, b) {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
```
