# AI-Assisted Engineering Discipline: Practical Walkthrough

This document illustrates how an AI coding agent applies the **12 Core Principles** and **5-Point Explanation Framework** during a realistic engineering task.

---

## Scenario
A developer requests:
> *"We have an inventory checkout endpoint that is double-selling stock when multiple customers purchase the last item at the exact same millisecond. Fix this."*

---

## The AI Agent's Disciplined Execution

### Step 1: Pre-Flight Risk & Invariant Identification
- **Identified Failure Mode:** Concurrent race condition (Lost Update / TOCTOU — Time-of-Check to Time-of-Use).
- **Evaluating Dependencies (Principle 6 & 7):**
  - *Naive AI Suggestion:* Install `redlock` or external distributed locking libraries.
  - *Disciplined Engineering Decision:* Reject adding Redis/Redlock. The application already runs on PostgreSQL. A native database-level atomic lock (`SELECT ... FOR UPDATE` or conditional `UPDATE ... WHERE stock >= qty`) solves the problem in standard SQL with ACID transactional guarantees and zero new dependencies.

### Step 2: Implementation of Minimal, Robust Solution
```sql
-- Atomic Decrement with Strict Guard
UPDATE inventory_items
SET stock_count = stock_count - :purchase_quantity,
    version = version + 1
WHERE id = :item_id
  AND stock_count >= :purchase_quantity;
```

### Step 3: Balanced Knowledge Transfer (The 5-Point Framework)
The agent delivers the code accompanied by structured architectural context:

1. **What Is Being Built:** An atomic, database-level conditional update query that guarantees inventory consistency under concurrent load.
2. **Why This Approach Was Selected:** Instead of introducing an external Redis distributed lock (`redlock`), we utilize PostgreSQL's native row-level write lock. The conditional `WHERE stock_count >= :purchase_quantity` guarantees that if two requests execute simultaneously, the database serializes row writes; the second request affects 0 rows and fails cleanly.
3. **How the Components Interact:** 
   - `CheckoutController` $\rightarrow$ `OrderService.checkout()` $\rightarrow$ `InventoryRepository.decrementStock()`.
   - If rows affected is `0`, `OrderService` throws `InsufficientStockError`, and the controller returns HTTP `409 Conflict`.
4. **What Potential Problems Exist:** High contention on a single viral SKU could cause transaction queue latency if thousands of users purchase the identical item simultaneously.
5. **How to Debug & Maintain:** 
   - Test under concurrency using `Promise.all()` in integration tests.
   - Look for `409 Conflict` in application logs. If row locks exceed 500ms, inspect lock wait queues via `pg_stat_activity`.

### Step 4: Empirical Verification
The agent writes and executes a concurrent integration test firing 10 simultaneous purchases against an item with only 1 unit remaining. 1 succeeds (201 Created), 9 receive 409 Conflict with zero negative inventory.

