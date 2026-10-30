/**
 * Resilient HTTP Client with Exponential Backoff and Full Jitter
 */

class ResilientClient {
  constructor({ maxRetries = 3, baseDelayMs = 50, maxDelayMs = 1000 } = {}) {
    this.maxRetries = maxRetries;
    this.baseDelayMs = baseDelayMs;
    this.maxDelayMs = maxDelayMs;
  }

  calculateDelay(attempt, retryAfterSeconds = null) {
    if (retryAfterSeconds) return retryAfterSeconds * 1000;
    // Full jitter formula: random(0, min(maxDelay, baseDelay * 2^attempt))
    const maxBackoff = Math.min(this.maxDelayMs, this.baseDelayMs * Math.pow(2, attempt));
    return Math.random() * maxBackoff;
  }

  async execute(requestFn) {
    let attempt = 0;
    while (true) {
      try {
        return await requestFn();
      } catch (err) {
        attempt++;
        const isTransient = err.status && [408, 429, 500, 502, 503, 504].includes(err.status);
        if (attempt > this.maxRetries || !isTransient) {
          throw err;
        }

        const retryAfter = err.retryAfter || null;
        const delay = this.calculateDelay(attempt, retryAfter);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
}

module.exports = { ResilientClient };
