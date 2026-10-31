# Systematic Root-Cause Debugging (RCA) Playbook

Debugging is not trial-and-error code modification. It is an empirical, scientific investigation to falsify hypotheses and isolate invariants.

---

## 1. The 6-Step Scientific Debugging Cycle

```
[1. Observe & Document]
          │
          ▼
[2. Build Minimal Deterministic Reproduction (MRE)]
          │
          ▼
[3. Formulate Falsifiable Hypothesis]
          │
          ▼
[4. Isolate Variables & Instrument]
          │
          ▼
[5. Implement Invariant Patch]
          │
          ▼
[6. Add Regression Test & Verify]
```

### Step 1: Observe & Document
- What was the **expected behavior**?
- What was the **actual behavior**?
- What were the exact inputs, environment variables, dependencies, and state?
- Capture unedited stack traces, log lines, timestamps, and correlation IDs.

### Step 2: Build Minimal Deterministic Reproduction (MRE)
- Strip away irrelevant application layers, frameworks, and UI components.
- Create a standalone test or CLI script that reproduces the bug with $100\%$ consistency.
- **Rule:** If you cannot reproduce the failure on demand, you cannot prove that your fix worked.

### Step 3: Formulate Falsifiable Hypotheses
- List potential causes based on system architecture.
- For each hypothesis, define an empirical test: *"If hypothesis A is true, checking variable X at breakpoint Y will evaluate to null."*
- Reject "vague intuition"; require measurable assertions.

### Step 4: Isolate Variables & Instrument
- Use binary search / bisecting:
  - If a regression occurred across commits: `git bisect start`, `git bisect bad`, `git bisect good <commit>`.
  - If a large function is failing: split execution halfway and log intermediate invariants.
- Inspect state transitions immediately prior to the failure point.

### Step 5: Implement Invariant Patch
- Do not patch symptoms (e.g. adding `if (obj === undefined) return;` to silence an error without understanding why `obj` was undefined).
- Fix the structural invariant at the earliest point of corruption (fail fast).

### Step 6: Add Regression Test & Verify
- Convert the MRE into a permanent automated regression test.
- Verify that the test fails before the patch and passes after the patch.

---

## 2. Diagnosing Complex Defect Classes

### A. Asynchronous Race Conditions
- **Symptom:** Bug occurs intermittently under production load or high network latency, but rarely in local single-threaded debugging.
- **Root Causes:**
  - Unsynchronized read-modify-write cycles on shared in-memory state.
  - Floating promises (calling an `async` function without `await` or `.catch()`).
  - Event listener leaks where callbacks fire multiple times per trigger.
- **Diagnostic Method:**
  - Inject artificial network latency (`await new Promise(r => setTimeout(r, Math.random() * 50))`) between read and write steps.
  - Run concurrent stress tests firing $N = 50$ parallel requests.
  - Fix with transactional isolation, mutex locks, or optimistic concurrency tokens (`version` field).

### B. Floating-Point Calculation Errors
- **Symptom:** Discrepancies like `\$0.01` differences in shopping carts, billing invoices, or balance accounts.
- **Mechanism:** IEEE 754 double-precision binary floats cannot represent base-10 fractions like `0.1` or `0.2` accurately (`0.1 + 0.2 === 0.30000000000000004`).
- **Remediation:**
  - Represent all financial amounts in integer subunits (cents, kobo, pence, satoshis).
  - Perform all multiplications and additions in integers; apply banker's rounding (`Math.round`) only when converting back to decimal strings for display.

### C. Memory Leaks in Long-Running Node / JS Services
- **Symptom:** Process memory footprint grows monotonically over time until `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`.
- **Root Causes:**
  - Global event emitters retaining listeners indefinitely.
  - Unbounded caching structures without LRU eviction policies or TTL expiration.
  - Closures capturing large outer scopes unintentionally.
- **Diagnostic Method:**
  - Capture heap snapshots at $t_0$ (clean boot) and $t_1$ (after 10,000 requests) using `v8.getHeapSnapshot()`.
  - Compare allocation deltas in Chrome DevTools Memory Inspector.
  - Look for high retained sizes in arrays, closures, or event target maps.

---

## 3. The 5 Whys Root Cause Analysis (RCA) Template

```markdown
# Incident / Defect Root Cause Analysis (RCA)

**Incident ID:** INC-2026-1031
**Impact:** 41 users experienced double-billing on checkout during the flash sale.
**Severity:** Critical (Financial Data Corruption)

### The 5 Whys:
1. **Why were users double-billed?**
   Because the checkout API charged the credit card twice for a single order click.
2. **Why did the checkout API charge twice?**
   Because the user clicked "Pay" twice in rapid succession, generating two parallel HTTP POST requests.
3. **Why did two parallel requests result in two charges?**
   Because the server did not validate an idempotency key and executed two separate payment gateway charges.
4. **Why was idempotency not enforced?**
   Because the checkout route was implemented without an idempotency middleware layer.
5. **Why was the idempotency middleware missing?**
   Because payment integration guidelines did not include a mandatory architectural verification gate for duplicate request mutations.

### Remediation Action Items:
- [x] **Immediate:** Add distributed idempotency key cache with 120s TTL on `/api/v1/checkout`.
- [x] **Regression:** Add parallel request test harness verifying that 5 concurrent POST requests yield exactly 1 charge and 4 cached returns.
- [x] **Systemic:** Update API integration guidelines and architecture review checklist.
```
