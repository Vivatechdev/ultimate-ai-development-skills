---
name: testing-and-debugging
description: Architect and execute comprehensive test suites, deterministic bug reproduction, and systematic root-cause analysis (RCA). Enforces the testing pyramid, contract-safe test doubles, flaky test elimination, and regression prevention.
---

# Testing & Debugging Specialist

Act as a Principal Software Quality and Systems Reliability Engineer. Your mission is to design comprehensive, deterministic testing suites, establish systematic debugging workflows, eliminate test flakiness, and ensure that every production defect is met with an automated regression test.

---

## 1. Purpose and Scope

This skill establishes an empirical, high-velocity testing and debugging discipline across frontend and backend systems:
- **Testing Pyramid Governance:** Balancing unit, integration, contract, and end-to-end (E2E) suites to maximize diagnostic speed and system confidence.
- **Scientific Root Cause Analysis (RCA):** Diagnosing elusive defects through minimal reproducible examples (MREs) and hypothesis falsification rather than speculative trial-and-error.
- **Flaky Test Elimination:** Eradicating non-deterministic failures stemming from wall clocks, race conditions, leaked test state, and unseeded randomness.
- **Deterministic Bug Reproduction:** Proving defects before modifying code and sealing fixes with automated regression assertions.

---

## 2. Activation Criteria

Activate this skill whenever the task involves:
- Writing or refactoring unit, integration, or end-to-end test suites.
- Debugging intermittent, flaky, or failing automated tests in CI/CD.
- Investigating production defects, data discrepancies, or performance bottlenecks.
- Performing Root Cause Analysis (RCA) or writing post-mortem defect reports.
- Designing mock strategies, test fixtures, or test double architectures.
- Testing race conditions, concurrency limits, or asynchronous event loops.

---

## 3. Initial Assessment Procedure

Before writing or modifying any test or production code:

1. **Audit Existing Test Infrastructure:**
   - Inspect existing frameworks (Jest, Vitest, Playwright, Cypress, PyTest, Go test).
   - Inspect CI execution time, test parallelization, and existing coverage metrics.
2. **Classify the Target Defect or Coverage Gap:**
   - Is it an isolated computational error (Unit level)?
   - Is it a boundary/schema serialization or query mismatch (Integration level)?
   - Is it an end-to-end user workflow or rendering anomaly (E2E level)?
3. **Inspect Determinism Prerequistes:**
   - Does the codebase rely on uncontrolled globals (`Date.now()`, `Math.random()`, unmocked network sockets)?
   - Can dependencies be passed via inversion of control (dependency injection) or fake implementations?

---

## 4. Professional Workflow

Follow this 5-stage testing and debugging methodology:

```
[1. Characterize & Reproduce]
             │
             ▼
[2. Formulate Falsifiable Hypothesis]
             │
             ▼
[3. Instrument & Isolate Root Cause]
             │
             ▼
[4. Implement Invariant Fix]
             │
             ▼
[5. Automate Regression Suite]
```

### Stage 1: Characterize & Reproduce
1. Document the exact Delta: Expected vs. Actual behavior, input parameters, runtime environment, and stack traces.
2. Construct a **Minimal Reproducible Example (MRE)** script or standalone test isolated from unrelated UI or microservices.
3. Verify that the MRE fails with $100\%$ repeatability.

### Stage 2: Formulate Falsifiable Hypotheses
1. Brainstorm candidate mechanisms for failure (e.g. "Floating-point precision loss", "Unsynchronised async lock", "Stale cache key").
2. Define a concrete verification assertion for each candidate hypothesis.

### Stage 3: Instrument & Isolate Root Cause
1. Use binary search (or `git bisect`) to pinpoint the exact commit or execution step where the invariant breaks.
2. Trace the corrupted state upstream to the first point of invariant violation.

### Stage 4: Implement Invariant Fix
1. Fix the underlying root cause, never the superficial symptom (e.g. fix the race condition with an atomic lock or transaction, do not just increase a sleep timer).
2. Maintain documentation integrity and preserve unrelated existing code.

### Stage 5: Automate Regression Suite
1. Convert the MRE into a permanent test suite assertion.
2. Run the regression test against both the buggy implementation (verifying failure) and the remediated implementation (verifying pass).
3. Execute the full test suite to guarantee zero unintended side effects.

---

## 5. Technical Implementation Guidelines

### A. Testing Pyramid Allocation
- **60–70% Unit Tests:** Sub-millisecond, pure domain algorithms, validators, state transitions, utility functions.
- **20–30% Integration Tests:** Verifying API routing, database repositories, schema serialization, transaction rollbacks.
- **5–10% E2E Tests:** Critical happy-path user journeys (onboarding, checkout, authentication).

### B. Test Double Taxonomy (Meszaros Standard)
- **Dummy:** Passed only to fulfill parameter signatures; never invoked or asserted.
- **Stub:** Returns fixed canned responses for specific queries.
- **Spy:** Wraps real or stubbed functions to record call count, arguments, and invocation timestamps.
- **Mock:** Pre-programmed with behavioral expectations; fails the test if expected calls do not occur.
- **Fake:** Lightweight working implementation (e.g., in-memory Map store or SQLite in-memory). *Prefer Fakes over heavy interaction mocking.*

### C. Eliminating Test Flakiness
- **Clock Virtualization:** Never test time-dependent logic with `setTimeout` or raw `new Date()`. Inject a `Clock` interface or utilize test framework fake timers (`jest.useFakeTimers()`).
- **Dynamic Polling:** Replace arbitrary sleeps (`sleep(500)`) with condition-awaiting loops that poll the desired state with exponential backoff and explicit timeouts.
- **Isolated State:** Execute database integration tests within rolled-back transactions or unique UUID-namespaced schemas.

---

## 6. Decision-Making Frameworks

### Decision 1: When to Use Unit vs. Integration Tests
```
Is the logic pure business computation without external I/O?
├── YES ──> Write a UNIT TEST (Fast, in-memory, zero doubles).
└── NO  ──> Does it touch a database, filesystem, or HTTP API?
            ├── YES ──> Write an INTEGRATION TEST using a Fake or in-memory DB.
            └── NO  ──> Write a Component/Contract test.
```

### Decision 2: Mockist (London) vs. Classical (Detroit) School
```
Are you testing an internal private implementation detail?
├── YES ──> DO NOT TEST. Test only observable public behavior.
└── NO  ──> Can collaborators run fast in-memory?
            ├── YES ──> CLASSICAL APPROACH: Use real instances or Fakes.
            └── NO  ──> LONDON APPROACH: Use Stubs/Mocks only at network/disk boundaries.
```

---

## 7. Common Mistakes & How to Avoid Them

| Mistake | Consequence | Professional Remediation |
| :--- | :--- | :--- |
| **Testing Implementation Details** | Tests break when refactoring internal methods even though behavior is intact. | Assert inputs and observable outputs/state, not private helper calls. |
| **Arbitrary `sleep(500)` in Async Tests** | CI fails intermittently under high worker load (flaky tests). | Use predicate polling (`waitForCondition(async () => status === 'DONE')`). |
| **Over-Mocking (Mocking Everything)** | Tests pass green while production crashes due to contract schema drift. | Use Fakes or run against containerized real dependencies (Testcontainers). |
| **Symptom Patching** | Adding `obj?.prop ?? ""` silences the crash but masks upstream corruption. | Trace why `obj` was undefined and enforce invariants at the boundary. |
| **Floating-Point Currency Math** | Fractional cents lead to reconciliation discrepancies. | Use integer subunits (cents, satoshis) with integer arithmetic and banker's rounding. |

---

## 8. Practical Examples

### Deterministic Financial Cart & Concurrency Testbed
A complete reference implementation demonstrating reproduction and remediation of:
1. Floating-point imprecision ($0.10 + $0.20 \neq 0.30$).
2. Concurrent race conditions on promo code redemption.
3. Wall-clock boundary flakiness.

- **Buggy Implementation:** [buggy-cart.js](file:///c:/Users/user/Desktop/DEV/Antigravity-Skills/.agents/skills/testing-and-debugging/examples/calculator-and-bug-reproduction/buggy-cart.js)
- **Deterministic Reproduction:** [reproduction-test.js](file:///c:/Users/user/Desktop/DEV/Antigravity-Skills/.agents/skills/testing-and-debugging/examples/calculator-and-bug-reproduction/reproduction-test.js)
- **Remediated Production Code:** [fixed-cart.js](file:///c:/Users/user/Desktop/DEV/Antigravity-Skills/.agents/skills/testing-and-debugging/examples/calculator-and-bug-reproduction/fixed-cart.js)
- **Regression Suite:** [test-runner.js](file:///c:/Users/user/Desktop/DEV/Antigravity-Skills/.agents/skills/testing-and-debugging/examples/calculator-and-bug-reproduction/test-runner.js)

### Reference Guides
- [Testing Pyramid & Test Doubles](file:///c:/Users/user/Desktop/DEV/Antigravity-Skills/.agents/skills/testing-and-debugging/references/testing-pyramid-and-test-doubles.md)
- [Systematic Root-Cause Debugging (RCA)](file:///c:/Users/user/Desktop/DEV/Antigravity-Skills/.agents/skills/testing-and-debugging/references/root-cause-debugging-playbook.md)
- [Flaky Test Remediation](file:///c:/Users/user/Desktop/DEV/Antigravity-Skills/.agents/skills/testing-and-debugging/references/flaky-test-remediation.md)

---

## 9. Testing & Quality Assurance

To verify that this skill has been applied successfully:
1. **Reproduction Validation:** Execute the reproduction harness to observe the failure mode.
   ```bash
   node .agents/skills/testing-and-debugging/examples/calculator-and-bug-reproduction/reproduction-test.js
   ```
2. **Remediation Validation:** Execute the regression suite to confirm that 100% of assertions pass.
   ```bash
   node .agents/skills/testing-and-debugging/examples/calculator-and-bug-reproduction/test-runner.js
   ```

---

## 10. Completion Checklist

- [ ] Defect characterized with expected vs. actual behavior and reproducible inputs.
- [ ] Minimal Reproducible Example (MRE) created that reliably demonstrates the failure.
- [ ] Root cause identified and validated via hypothesis testing (not speculative patching).
- [ ] Invariant patched at the root source rather than masking symptoms.
- [ ] Automated regression test added to prevent recurrence.
- [ ] Tests run deterministically without arbitrary sleep delays or unvirtualized clocks.
- [ ] Full existing test suite verified green with zero regressions.
