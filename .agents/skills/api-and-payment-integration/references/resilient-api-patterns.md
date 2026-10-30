# Resilient Third-Party API Patterns: Retries, Idempotency & Rate Limits

Third-party APIs fail unpredictably: network partitions, transient 503 errors, rate-limit spikes, and duplicate webhook deliveries are standard operational realities. A resilient integration client must incorporate defensive architectural patterns.

---

## 1. Exponential Backoff with Full Jitter

When retrying transient network errors (HTTP 408, 429, 500, 502, 503, 504), naive retries create "thundering herd" spikes that crash recovering servers.

Use **Exponential Backoff with Full Jitter**:

$$\text{sleep} = \text{random}(0, \min(\text{max\_backoff}, \text{base\_delay} \times 2^{\text{attempt}}))$$

### Implementation (JavaScript/TypeScript):
```typescript
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 500,
  maxDelayMs: number = 8000
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      const isTransient = 
        err.code === 'ECONNRESET' ||
        err.code === 'ETIMEDOUT' ||
        (err.status && [408, 429, 500, 502, 503, 504].includes(err.status));

      if (attempt > maxRetries || !isTransient) {
        throw err;
      }

      // Check if upstream server provided a Retry-After header
      const retryAfterSeconds = err.headers?.['retry-after'] 
        ? parseInt(err.headers['retry-after'], 10) 
        : null;

      const delay = retryAfterSeconds 
        ? retryAfterSeconds * 1000 
        : Math.random() * Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));

      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

---

## 2. Idempotency Keys (`Idempotency-Key`)

Never execute non-idempotent operations (charging a credit card, transferring funds, dispatching an SMS) without an idempotency key.

1. **Client Generation:** Client generates a unique UUIDv4 per mutation attempt and transmits it in the header:
   ```http
   Idempotency-Key: 7b84f23b-059e-4df7-9759-9133b3a0df47
   ```
2. **Provider Handling:**
   - If the request drops mid-network, the client retries with the **same** idempotency key.
   - The provider detects the identical key, avoids double-charging, and returns the original cached transaction result.
3. **Application Inbound Idempotency (For Webhooks):**
   - Store incoming `event.id` or `transaction.reference` in a database table inside a transaction.
   - If the key exists, return `200 OK` immediately without re-fulfilling.

---

## 3. Strict Timeout Configuration

Never use unbounded HTTP clients. A frozen upstream third-party API can exhaust your server's connection pool in seconds:

- **Connect Timeout:** 3–5 seconds (time to establish TCP/TLS handshake).
- **Read / Socket Timeout:** 10–15 seconds (time to wait for response bytes).
- In Node.js `fetch` or `axios`:
  ```javascript
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s strict timeout
  try {
    const res = await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
  ```

---

## 4. Circuit Breaker Pattern

If a third-party service suffers an extended outage, repeatedly hammering it with requests wastes resources and slows down your application.

```
          [ Closed State ] (Normal Operations)
                 │
      (Failure Threshold Reached: e.g. 5 consecutive 503s)
                 ▼
          [ Open State ] (Fast-Fail: Reject immediately without calling upstream)
                 │
      (Cooldown Period Expires: e.g. 60 seconds)
                 ▼
        [ Half-Open State ] (Probe with 1 test request)
                 ├─ If Success ──> Return to [ Closed State ]
                 └─ If Failure ──> Return to [ Open State ]
```
