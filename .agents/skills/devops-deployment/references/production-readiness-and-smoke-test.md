# Production-Readiness Assessment & Post-Deployment Smoke Testing

Deploying software to production without structured verification invites downtime. This reference establishes the mandatory pre-flight readiness gate and the post-deployment 8-point verification protocol.

---

## 1. Pre-Deployment Readiness Assessment Checklist

Execute this verification gate before triggering any production release:

```text
┌────────────────────────────────────────────────────────┐
│            PRE-DEPLOYMENT READINESS GATE               │
├────────────────────┬───────────────────────────────────┤
│ 1. Secrets & Env   │ All production keys in Secret Mgr │
│ 2. DB Backup       │ Pre-migration snapshot verified   │
│ 3. Non-Blocking DDL│ Migrations use Expand & Contract  │
│ 4. Build Artifacts │ Tagged by Git commit SHA (not just:latest)
│ 5. Rollback Plan   │ Instant previous-release fallback │
│ 6. Observability   │ Uptime pingers & Sentry/Logs active│
└────────────────────┴───────────────────────────────────┘
```

- [ ] **Zero Committed Secrets:** Confirmed no `.env` or production credentials in Git repository.
- [ ] **Database Pre-Migration Snapshot:** An automated database snapshot has been triggered immediately prior to running migrations.
- [ ] **Migration Safety Verified:** DDL changes verified as non-blocking (e.g. adding columns as NULLABLE, no exclusive table locks).
- [ ] **Artifact Immutability:** Deployment targets an immutable container image tag (e.g. `sha-3cf6386`), never mutable `:latest`.
- [ ] **Documented Rollback Plan:** The team has verified how to revert to the previous release artifact in < 60 seconds if health checks fail.
- [ ] **DNS & SSL Health:** Domain DNS records (A/CNAME) resolved; SSL certificate validity verified (>30 days remaining).

---

## 2. Post-Deployment 8-Point Smoke Test Protocol

Immediately following a deployment, execute the 8-point smoke test suite:

### 1. Application Availability & Healthcheck
- Probe `/api/health` or `/healthz`.
- Confirm `HTTP 200 OK` with JSON status `{"status": "healthy"}` within $< 200\text{ms}$.

### 2. Database Connectivity
- Confirm the application successfully connects to the database connection pool.
- Verify that a read query (`SELECT 1` or version check) executes with normal latency ($< 10\text{ms}$).

### 3. Authentication & Session Issuance
- Execute an end-to-end authentication test: login with a test account.
- Confirm session cookie is returned with `HttpOnly`, `Secure`, and `SameSite` flags.

### 4. API Core Endpoints
- Test primary public and authenticated REST endpoints.
- Confirm correct HTTP status codes (`200 OK`, `201 Created`).

### 5. Critical User Workflows & Forms
- Submit a smoke-test form (e.g. contact inquiry or test transaction).
- Verify that background jobs or notification webhooks dispatch successfully.

### 6. SSL / TLS Configuration
- Verify HTTPS protocol enforcement: requests to `http://` must return `301 Moved Permanently` redirecting to `https://`.
- Confirm SSL certificate chain is valid and trusted by standard browser root stores.

### 7. Secure Error Handling
- Request a nonexistent URL (`/api/v1/nonexistent-route-check-404`).
- Confirm the server returns a clean `404 Not Found` with zero stack traces or internal server paths leaked.

### 8. Backup Verification
- Confirm that the pre-deploy database backup is visible, non-zero in byte size, and accessible in the storage bucket.

---

## 3. Rollback & Incident Recovery Playbook

If any of the 8 post-deployment checks fail or error rates spike:

### Step 1: Declare Incident & Stop Traffic Bleed
- Revert traffic routing to the previous healthy container image or release slug:
  - *Docker Compose:* `docker compose down && docker compose up -d app:previous-sha`
  - *Cloud Run / PaaS:* Re-route 100% of traffic to previous revision.
  - *Kubernetes:* `kubectl rollout undo deployment/web`

### Step 2: Database Migration Recovery
- Because migrations follow the **Expand & Contract** pattern, the previous application version will continue to run seamlessly against the expanded schema without requiring an emergency database rollback.
- If a down-migration is strictly required, execute the tested down-migration script:
  ```bash
  # Example: revert last migration
  npx prisma migrate resolve --rolled-back <migration_name>
  ```

### Step 3: Post-Mortem & Blameless Root Cause Analysis (RCA)
- Document: Timeline of events, failure trigger, time to detect (TTD), time to recover (TTR), and preventive action items.

