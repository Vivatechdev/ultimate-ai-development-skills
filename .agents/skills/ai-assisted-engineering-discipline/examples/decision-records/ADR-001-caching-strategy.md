# [ADR-001] Cache Layer Strategy for High-Read Organization Settings

- **Status:** Accepted
- **Date:** 2026-10-31
- **Deciders:** Senior Systems Architect, Lead Backend Engineer
- **Technical Domain:** Performance, Caching, Database I/O

---

## 1. Context & Problem Statement
The organization settings endpoint (`GET /api/v1/organizations/:id/settings`) is queried on every client page load to retrieve theme tokens, active feature flags, and custom domain configurations.
Under peak loads (5,000 req/s), direct PostgreSQL lookups account for 38% of total database connection pool utilization, even though organization settings change less than twice a month.
We need to reduce database read load to < 5% while ensuring that updates to organization settings reflect immediately without stale data bugs.

## 2. Considered Architectural Options

### Option A: External Redis Cluster
- **Pros:** Sub-millisecond latency; shared state across multiple horizontally scaled application replicas.
- **Cons:** Additional infrastructure cost ($35–$120/mo); network hop required; operational overhead of managing Redis cluster failover.

### Option B: In-Memory LRU Cache with Distributed Invalidation via PostgreSQL LISTEN/NOTIFY
- **Pros:** Zero network hop (in-process RAM, < 0.05ms lookup); zero additional infrastructure cost; instant invalidation across all app replicas using existing PostgreSQL connection.
- **Cons:** Memory footprint on application processes; process restart clears cache (minor cold-start warming).

### Option C: HTTP Cache-Control Max-Age Headers
- **Pros:** Handled entirely by browser/CDN; zero server compute on cache hits.
- **Cons:** Inability to perform immediate, reliable cache invalidation when an admin updates settings mid-session.

## 3. Decision Outcome
> **Chosen Option:** **Option B (In-Memory LRU with PostgreSQL LISTEN/NOTIFY invalidation)**.

### Rationale:
The settings payload is compact (< 2KB per organization). An in-memory LRU cache storing 10,000 active organizations requires only ~20MB of RAM per application node. Utilizing PostgreSQL's native `LISTEN/NOTIFY` channels triggers instant pub/sub invalidation across all application replicas whenever `UPDATE organizations` executes, guaranteeing zero stale data without introducing an external Redis dependency.

## 4. Consequences & Trade-Offs
- **Positive Impacts:** Database read pressure on the `organizations` table drops by >98%. Average response latency drops from 14ms to 0.4ms.
- **Negative Impacts:** Each app process maintains a lightweight memory cache; requires persistent pub/sub listener connection.
- **Residual Risks:** If the database pub/sub connection momentarily drops, nodes might serve stale settings.
  - *Mitigation:* Configured a conservative 10-minute maximum Time-to-Live (TTL) on cache entries as a fallback safeguard.

## 5. Maintenance & Debugging Playbook
- **Code Location:** `src/infrastructure/cache/OrgSettingsCache.ts`.
- **Diagnostic Metrics:** Logged under `telemetry.cache.hit_rate`. Target hit rate: $\ge 95\%$.
- **Debugging Pub/Sub:** Check `postgres.pubsub.connected` metric. If false, inspect connection pool listener logs.
- **Revisit Threshold:** Re-evaluate and migrate to Redis if active organization count exceeds 500,000 or process memory overhead exceeds 250MB.

