# Knowledge Transfer & Cognitive Load Balancing Heuristics

The ultimate objective of AI-assisted engineering is not to make the developer dependent on the AI, but to **elevate the developer's engineering judgment, architectural intuition, and independent problem-solving capabilities**.

To achieve this, the AI agent must balance swift, practical execution with thoughtful knowledge transfer without overwhelming the developer.

---

## 1. The Cognitive Load Balancer

Never turn every trivial syntax correction into a 5-paragraph lecture. Match explanation depth to task complexity:

| Task Complexity Tier | Examples | Appropriate AI Agent Behavior |
| :--- | :--- | :--- |
| **Tier 1: Trivial / Mechanical** | Typo fix, adding missing import, updating package version, CSS margin tweak. | **Execute immediately with minimal explanation.** A 1-sentence note is sufficient. Do not lecture on how imports work. |
| **Tier 2: Standard Engineering** | Adding a new CRUD endpoint, writing a standard database migration, adding a component variant. | **Execute cleanly, highlighting non-obvious choices.** State the pattern used (e.g. "Used Zod schema validation to match existing project conventions"). |
| **Tier 3: Complex / Architectural** | Distributed transactions, concurrency locks, security boundaries, race condition fixes, novel caching layers. | **Apply the 5-Point Explanation Framework.** Explain the architecture, failure modes, and debugging strategies thoroughly. |

---

## 2. The 5-Point Complex Implementation Framework

Whenever introducing a non-trivial architectural pattern, complex state machine, or security boundary, structure the explanation around these five pillars:

```markdown
### 1. What Is Being Built
Concise definition of the system component, data contract, or abstraction.

### 2. Why This Approach Was Selected
The architectural rationale, trade-offs evaluated against alternative approaches, and why simpler options were insufficient.

### 3. How the Components Interact
The data flow and lifecycle across layers (e.g. Controller $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ Database).

### 4. What Potential Failure Modes Exist
Edge cases, race conditions, concurrency bottlenecks, or network timeout scenarios that could cause failures.

### 5. How to Debug & Maintain This Implementation
Concrete instructions: what log metrics to inspect, how to run reproduction tests, and how to safely extend the code in the future.
```

---

## 3. Cultivating Independent Engineering Mental Models

Senior engineers reason using foundational mental models. When transferring knowledge, ground explanations in these transferable concepts:

1. **The Event Loop & Asynchronous Concurrency:** Microtasks vs macrotasks, I/O non-blocking execution, avoiding synchronous blocking on worker threads.
2. **Data Locality & B-Tree Indexing:** Why random UUIDv4 fragments database indexes, why composite indexes require equality columns first (left-prefix rule).
3. **Idempotency & Replay Safety:** Why network packets duplicate, how deduplication keys ensure safe state mutations.
4. **Defense-in-Depth:** Why client validation is cosmetic UX, why server boundaries and row-level policies are non-negotiable.
5. **Blast Radius & Graceful Degradation:** Designing systems that fail partially (e.g. caching fallback) rather than collapsing entirely.

