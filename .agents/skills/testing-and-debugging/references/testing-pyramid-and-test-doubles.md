# The Testing Pyramid and Test Doubles Taxonomy

A resilient, scalable test suite provides high confidence with rapid feedback and low maintenance overhead. This reference establishes the architectural principles of the testing pyramid and the rigorous use of test doubles.

---

## 1. The Modern Testing Pyramid

```
         / \
        /   \     E2E / Browser Tests (5-10%)
       / E2E \    Slow, brittle, high system confidence
      /-------\
     /         \   Integration / Contract Tests (20-30%)
    / Integrat. \  Verifies cross-boundary coordination & schemas
   /-------------\
  /               \ Unit Tests (60-70%)
 /   Unit Tests    \ Fast (< 5ms), deterministic, tests pure domain logic
/-------------------\
```

### Layer Characteristics

| Layer | Target Under Test | Execution Speed | Isolation | Failure Diagnosis | Primary Tools |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit** | Individual functions, pure business algorithms, state machines | Sub-millisecond ($< 5\text{ms}$) | Total (in-memory, no I/O) | Pinpoints exact line and failing assertion | Node test runner, Jest, Vitest, Mocha, PyTest |
| **Integration** | Service + DB, API endpoints, repository queries, messaging | Fast ($10\text{ms} - 200\text{ms}$) | Medium (in-memory DB, local containers, wiremock) | Identifies query mismatch, schema serialization error, HTTP code | Supertest, Testcontainers, SQLite memory mode |
| **End-to-End (E2E)** | Full user journeys across frontend, backend, worker queues | Slow ($2\text{s} - 30\text{s}$) | None (full environment) | High-level failure; requires screenshots, network HAR, DOM trace | Playwright, Cypress, Puppeteer |

---

## 2. Gerard Meszaros' Test Doubles Taxonomy

The term "mock" is frequently misused to describe all test doubles. Misunderstanding test doubles leads to brittle tests that break upon refactoring or tests that pass despite broken production behavior.

### The 5 Types of Test Doubles

1. **Dummy:**
   - **Definition:** Objects passed around to satisfy signature constraints (e.g. required parameters) but never actually used or inspected.
   - **Example:** Passing a dummy logger `{ log: () => {} }` to a constructor that requires a logger instance when testing discount math.

2. **Stub:**
   - **Definition:** Provides pre-programmed canned answers to method calls during the test. Does not respond to anything outside the test setup. Does not record invocation counts.
   - **Example:** A database repository stub that returns `{ id: 'usr_1', status: 'ACTIVE' }` whenever `findById('usr_1')` is called.

3. **Spy:**
   - **Definition:** A stub that also records metadata about how it was called (arguments passed, invocation count, timestamps, returned values).
   - **Example:** Verifying that `emailService.sendWelcomeEmail(user.id)` was called exactly once with the expected user payload.

4. **Mock:**
   - **Definition:** Objects pre-programmed with explicit behavioral expectations (which methods *must* be called, in what order, and with which parameters). Fails the test if the expectation is violated during execution.
   - **Use Case:** Verifying interactions where state change is not directly observable via public getters (e.g. outbound message broker publish).

5. **Fake:**
   - **Definition:** A working, lightweight implementation of a dependency that takes shortcuts making it unsuitable for production (e.g. in-memory hash map instead of a distributed Redis instance or SQLite in-memory instead of PostgreSQL).
   - **Advantage:** Fakes maintain real interface invariants and allow natural state transitions without brittle method-mocking.

---

## 3. The "Mockist" vs. "Classical" (Detroit vs. London) School

### The London (Mockist) Approach
- Mocks every collaborating object outside the immediate unit.
- **Drawback:** Tightly couples tests to internal implementation details (method names, invocation orders). Refactoring internal class structure without altering observable behavior causes massive test failures.

### The Classical (Detroit) Approach (Recommended)
- Uses real objects for collaborators whenever fast and deterministic.
- Only doubles boundaries that involve slow, non-deterministic I/O (network, third-party APIs, disk, real payment gateways).
- Uses **Fakes** or in-memory databases over interaction mocks.
- **Benefit:** Tests verify *observable behavior and output state*, not implementation mechanics. Refactoring internal helper methods does not break tests.

---

## 4. Testing Contract Boundaries

When integrating third-party APIs or microservices, mocking the external HTTP call with hardcoded JSON risks **contract drift** (the provider updates their API schema, but your mocks continue to pass).

### Prevention Strategies
1. **Schema Validation on Doubles:** Validate mocked payloads against the provider's official JSON Schema or OpenAPI/TypeScript types.
2. **Recorded Wire Mocks (VCR Pattern):** Record actual HTTP interactions in staging once, replay them during CI runs, and periodically refresh the recordings.
3. **Consumer-Driven Contracts (Pact):** Define shared expectations between frontend and backend or microservice boundaries.
