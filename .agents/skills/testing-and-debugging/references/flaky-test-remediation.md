# Flaky Test Elimination and Deterministic Testing

A test that fails intermittently without underlying code changes erodes engineering trust in CI pipelines, slows down release velocity, and masks real regressions. This reference provides proven strategies to diagnose and eliminate test flakiness.

---

## 1. The Anatomy of Flakiness

A flaky test is caused by non-deterministic external variables leaking into the test execution boundary.

```
┌────────────────────────────────────────────────────────┐
│ Non-Deterministic Leaks                                 │
│ ├── Wall Clocks (`Date.now()`, Timezones)              │
│ ├── Asynchronous Arbitrary Delays (`setTimeout(..., 100)`)│
│ ├── Leaked Shared State (Global variables, DB state)   │
│ ├── Unordered Collections (Set/Map/DB iteration order) │
│ └── Unseeded Randomness (`Math.random()`)              │
└────────────────────────────────────────────────────────┘
```

---

## 2. The 5 Root Causes and Their Remediations

### 1. Arbitrary Sleep Delays (`sleep(500)`)
- **Anti-Pattern:**
  ```javascript
  // BRITTLE: Might take 50ms locally, but 600ms on a busy CI runner!
  await triggerBackgroundJob();
  await new Promise(resolve => setTimeout(resolve, 500));
  expect(await getJobStatus()).toBe('COMPLETED');
  ```
- **Remediation: Deterministic Polling with Await-Condition:**
  ```javascript
  // ROBUST: Polls frequently with exponential backoff and timeout
  async function waitForCondition(predicateFn, { timeoutMs = 3000, intervalMs = 25 } = {}) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (await predicateFn()) return true;
      await new Promise(r => setTimeout(r, intervalMs));
    }
    throw new Error(`Condition timed out after ${timeoutMs}ms`);
  }

  await triggerBackgroundJob();
  await waitForCondition(async () => (await getJobStatus()) === 'COMPLETED');
  ```

### 2. Wall-Clock and Timezone Dependencies
- **Anti-Pattern:**
  ```javascript
  // BRITTLE: Fails when executed at 23:59:59 or across DST transitions
  const expiresAt = new Date(Date.now() + 86400000);
  expect(isTokenExpired(token)).toBe(false);
  ```
- **Remediation: Clock Virtualization (Dependency Injection or Fake Timers):**
  - Inject a clock abstraction: `interface Clock { now(): Date }`.
  - In unit tests, pass a `ConstantClock(new Date('2026-01-01T12:00:00Z'))`.
  - Use `jest.useFakeTimers()` or modern equivalent to advance time deterministically via `jest.advanceTimersByTime(1000)`.

### 3. Leaked Shared State Between Tests
- **Anti-Pattern:** Multiple test suites writing to a single persistent database instance without cleanup, causing test order dependence (`test B` only passes if `test A` ran first).
- **Remediation:**
  - **Transaction Rollback:** Wrap each test in a database transaction that rolls back on test teardown.
  - **Tenant / UUID Namespacing:** Generate a random prefix for every test suite (e.g. `test_tenant_${crypto.randomUUID()}`).
  - **Truncate in `beforeEach`:** Clear all tables before each test rather than `afterEach` (so failures leave the DB state inspectable for debugging).

### 4. Unseeded Pseudo-Randomness
- **Anti-Pattern:** Using `Math.random()` to generate test payloads, leading to rare failure states that cannot be reproduced once CI finishes.
- **Remediation:** Use deterministic seeded pseudorandom number generators (PRNG) such as Mulberry32 or Linear Congruential Generators (LCG). If a test fails with seed `0xABCD1234`, running the test with that exact seed reproduces the exact data combination.

### 5. Collection Ordering Assumptions
- **Anti-Pattern:** `expect(results).toEqual(['apple', 'banana', 'orange'])` when the database query did not specify an `ORDER BY` clause. SQL engines make zero guarantees about unordered row returns across different vacuuming states.
- **Remediation:** Always sort results deterministically in the query (`ORDER BY id ASC`) or assert membership independently of order (`expect(results).toEqual(expect.arrayContaining([...]))`).

---

## 3. The Flakiness Stress-Test Protocol

To verify that a test suite is genuinely deterministic before certifying it:

```bash
# Run the suspect test 100 times in parallel or random order
for i in {1..100}; do
  npm test -- --runInBand --testNamePattern="SuspectTest" || break
done
```

If the test fails even once out of 100 iterations, it is non-deterministic and must be quarantined and refactored.

