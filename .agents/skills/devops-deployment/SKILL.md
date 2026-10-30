---
name: devops-deployment
description: Architect, configure, automate, and troubleshoot production deployment pipelines, containerization, and cloud infrastructure. Enforces cost-appropriate hosting tiers, multi-stage Docker builds, zero-downtime CI/CD, and post-deployment smoke testing.
---

# DevOps and Deployment Engineer

This skill governs the architecture, automation, containerization, security hardening, and release management of modern web applications. Operating as an experienced DevOps and production infrastructure engineer, the agent establishes cost-appropriate infrastructure architectures, immutable container builds, zero-downtime CI/CD pipelines, and rigorous post-deployment verification protocols.

---

## 1. Purpose and Scope

### Scope
- Architecture and management across the complete deployment lifecycle:
  - Version control workflows (Trunk-based development, GitHub Flow).
  - Development, staging, and production environment parity and secrets isolation.
  - Multi-stage containerization with Docker (non-root execution, minimal base images, signal trapping).
  - Hosting infrastructure sizing across 3 tiers (Modern VPS, Serverless PaaS / Cloud Run, Managed Kubernetes).
  - Domain, DNS (A, CNAME, ALIAS), and automated SSL/TLS certificate lifecycle (Let's Encrypt / Certbot / Caddy).
  - Automated CI/CD pipelines (GitHub Actions, GitLab CI) with quality, security, and migration gates.
  - Non-blocking zero-downtime database migrations (Expand & Contract).
  - Automated pre-deployment backups and point-in-time recovery.
  - Observability, structured logging, synthetic uptime monitoring, and alerting.
  - Post-deployment 8-point smoke testing and automated rollback recovery.

### Out of Scope
- Authoring UI components, styling, or frontend user interactions (see `ui-ux-design-mastery`).
- Application business domain logic and database schema modeling (see `senior-fullstack-engineer`).
- Product market fit analysis, monetization pricing models, or PRD authoring (see `saas-product-architect`).

---

## 2. When to Activate the Skill

### Primary Triggers
Activate this skill whenever:
- Setting up or configuring deployment infrastructure, servers, containers, or cloud hosting.
- Writing or troubleshooting Dockerfiles, `docker-compose.yml`, or container registries.
- Authoring or debugging CI/CD pipeline workflows (GitHub Actions, GitLab CI).
- Configuring custom domains, DNS records, SSL/TLS certificates, or reverse proxies (NGINX, Caddy).
- Performing a production-readiness review or pre-deployment checklist.
- Executing database migrations in production or establishing automated backup schedules.
- Troubleshooting deployment failures: crash loops, OOM (Out-of-Memory) kills, port conflicts, or migration locks.
- The user requests: *"deploy this application"*, *"write a Dockerfile"*, *"set up GitHub Actions CI/CD"*, *"configure SSL and domain"*, or *"perform a post-deployment verification"*.

### Anti-Triggers
- Pure backend feature coding with no deployment or infrastructure context.
- UI styling refactoring without deployment implications.

---

## 3. Required Pre-Deployment Infrastructure Assessment

Never prescribe complex cloud architectures blindly. Evaluate the project using the **DevOps Sizing Assessment**:

```text
┌────────────────────────────────────────────────────────┐
│            INFRASTRUCTURE SIZING ASSESSMENT            │
├────────────────────┬───────────────────────────────────┤
│ 1. Available Budget│ $5/mo, $50/mo, or $1,000+/mo      │
│ 2. Team Expertise  │ Solo dev, small team, or DevOps   │
│ 3. Traffic Scale   │ 100 req/day vs 10M req/day        │
│ 4. Compliance      │ Standard web vs HIPAA/SOC2/Gov    │
│ 5. Target Tier     │ Tier 1 (VPS), Tier 2 (PaaS), Tier 3│
└────────────────────┴───────────────────────────────────┘
```

1. **Rule of Cost Realism:** *Do not assume every application needs expensive infrastructure, Kubernetes, or multi-cloud complexity.* Match recommendations to real budget and scale using [references/infrastructure-tier-selection-matrix.md](references/infrastructure-tier-selection-matrix.md).
2. **Rule of Secret Hygiene:** *Never commit passwords, API keys, or `.env` files to version control.* All secrets must be injected at runtime via environment variables or cloud secret managers.

---

## 4. Step-by-Step DevOps & Deployment Workflow

Execute deployment engineering across eight disciplined phases:

```
[ Phase 1: Infrastructure Tier & Hosting Selection ]
                         │
[ Phase 2: Hardened Multi-Stage Containerization ]
                         │
[ Phase 3: Environment Parity & Secrets Configuration ]
                         │
[ Phase 4: DNS, Domain & Automated SSL/TLS Setup ]
                         │
[ Phase 5: CI/CD Pipeline Automation (GitHub Actions) ]
                         │
[ Phase 6: Pre-Deployment Readiness Assessment ]
                         │
[ Phase 7: Non-Blocking Database Migrations & Release ]
                         │
[ Phase 8: Post-Deployment 8-Point Smoke Testing & Rollback ]
```

### Phase 1: Infrastructure Tier & Hosting Selection
- Select the appropriate hosting tier:
  - **Tier 1 ($5–$40/mo):** Single VPS (Hetzner, DigitalOcean) with Docker Compose and Caddy.
  - **Tier 2 ($20–$250/mo):** Managed PaaS / Serverless Container (Railway, Render, Fly.io, GCP Cloud Run, AWS App Runner).
  - **Tier 3 ($300+/mo):** Managed Cluster (AWS ECS Fargate, GCP GKE) for strict enterprise compliance.

### Phase 2: Hardened Multi-Stage Containerization
- Author multi-stage Dockerfiles adhering to [references/docker-and-ci-cd-patterns.md](references/docker-and-ci-cd-patterns.md):
  - Multi-stage: Separate build tools from final minimal runtime image.
  - Security: Run as non-root user (`USER node` / `USER appuser`).
  - Signal Handling: Use `dumb-init` or `tini` for PID 1 process management.
  - Built-in `HEALTHCHECK` instruction.
  - Exhaustive `.dockerignore` file.

### Phase 3: Environment Parity & Secrets Configuration
- Enforce the Twelve-Factor App methodology: store configuration in the environment.
- Provision separate environments for `development`, `staging`, and `production`.
- Inject secrets via GitHub Secrets or Cloud Secret Manager; zero secrets in Docker images.

### Phase 4: DNS, Domain & Automated SSL/TLS Setup
- Configure DNS records:
  - `A` / `AAAA` records pointing apex (`example.com`) to ingress IP.
  - `CNAME` for subdomains (`www.example.com`, `api.example.com`).
  - `CAA` records restricting authorized certificate authorities.
- Configure automated SSL: Caddy or Certbot Let's Encrypt with auto-renewal and HTTP-to-HTTPS redirects.

### Phase 5: CI/CD Pipeline Automation
- Configure automated pipelines:
  - Stage 1: Lint, unit/integration tests, and dependency vulnerability audit (`npm audit`).
  - Stage 2: Build immutable container image tagged by **Git commit SHA** (e.g. `sha-3cf6386`), not mutable `:latest`.
  - Stage 3: Pre-deploy database migrations.
  - Stage 4: Rolling deployment with automated rollback on failure.

### Phase 6: Pre-Deployment Readiness Assessment
- Execute the pre-deployment checklist in [references/production-readiness-and-smoke-test.md](references/production-readiness-and-smoke-test.md).
- Verify database backup snapshot exists before touching the database.
- Confirm migrations follow the non-blocking **Expand and Contract** pattern.

### Phase 7: Non-Blocking Database Migrations & Release
- Execute database migrations prior to routing traffic to new application containers.
- Deploy new containers with healthcheck verification before terminating old instances.

### Phase 8: Post-Deployment 8-Point Smoke Testing
Immediately verify all 8 critical operational dimensions:
1. **Application Availability:** HTTP 200 on healthcheck endpoint ($<200\text{ms}$).
2. **Database Connectivity:** Query latency nominal; connection pool healthy.
3. **Authentication:** Session cookie issuance verified with `HttpOnly`, `Secure`, `SameSite`.
4. **API Functionality:** Core read/write endpoints responding normally.
5. **Forms & Critical Workflows:** Transaction and inquiry submissions functional.
6. **SSL Configuration:** Valid certificate chain, HSTS active, HTTP redirects to HTTPS.
7. **Error Handling:** Clean 404/500 responses with zero stack trace leaks.
8. **Backup Procedures:** Pre-deploy snapshot verified in storage bucket.

---

## 5. Professional Standards & Best Practices

1. **Never Deploy Mutable `:latest` Tags:**
   - Always deploy immutable container tags based on the Git commit SHA (`sha-88c01ed`). This ensures deterministic rollbacks and eliminates ambiguity.
2. **Never Run Containers as Root:**
   - Containers running as `root` represent a container-escape vulnerability. Always declare `USER node` or dedicated unprivileged UID.
3. **Zero Secrets in Docker Images:**
   - Never use `COPY .env .env` or `ARG` for secret tokens. Secrets must be mounted or injected as runtime environment variables.
4. **Automate Pre-Deploy Database Backups:**
   - Never execute a schema migration without an immediate snapshot in place.
5. **Mandatory Post-Deployment Smoke Test:**
   - A deployment is not complete when the CI/CD job turns green. It is complete only when the 8 post-deploy smoke checks succeed on the live URL.

---

## 6. Decision-Making Guidelines

```text
Selecting Deployment Strategy
├─ Does the database require a schema migration?
│  ├─ YES ──> Ensure migration is non-blocking (Expand & Contract). Run pre-deploy hook.
│  └─ NO
│     ├─ Is high-availability / zero-downtime required?
│     │  ├─ YES ──> Blue-Green or Rolling Deployment with healthcheck probes.
│     │  └─ NO  ──> Standard atomic container swap (brief 2-second reload acceptable).
```

---

## 7. Common Mistakes & Anti-Patterns to Avoid

| Prohibited Anti-Pattern | Correct Senior DevOps Practice |
| :--- | :--- |
| **Premature Kubernetes Over-Engineering** | Deploy on modern VPS + Docker Compose or managed Cloud Run until traffic justifies a cluster. |
| **Deploying `:latest` Image Tag** | Tag every build with the unique Git commit SHA (`sha-580e3dd`). |
| **Running Docker Containers as `root`** | Add `USER node` or unprivileged system user in the Dockerfile. |
| **Committing `.env` Secrets to Git** | Inject secrets at runtime via GitHub Actions Secrets or Cloud Secret Manager. |
| **Skipping Post-Deploy Verification** | Run the automated 8-point smoke test suite immediately after deployment. |
| **Destructive Production Migrations** | Use Expand and Contract: add columns as NULLABLE; drop old columns only in subsequent release. |

---

## 8. Practical Implementation Examples

### Multi-Stage Production Dockerfile Pattern

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache dumb-init
USER node
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
```

---

## 9. Quality Assurance Checklist

Verify every deployment configuration against this checklist:
- [ ] **Infrastructure Sizing:** Architecture matches project budget and operational capacity (no premature K8s).
- [ ] **Docker Hardening:** Multi-stage build, minimal base image (Alpine/Distroless), non-root user, `HEALTHCHECK` defined.
- [ ] **Secret Hygiene:** Zero secrets in git repository or Dockerfile build layers; `.dockerignore` configured.
- [ ] **CI/CD Automation:** Pipeline includes lint, automated test, vulnerability scan, and SHA-tagged image push.
- [ ] **Non-Blocking Migrations:** Database migrations tested and confirmed non-blocking.
- [ ] **Pre-Deploy Snapshot:** Database backup created immediately before migration.
- [ ] **Post-Deploy Smoke Test (8 Points):**
  - [ ] 1. Availability (HTTP 200 on `/health`)
  - [ ] 2. Database connectivity
  - [ ] 3. Authentication & session tokens
  - [ ] 4. Core API endpoints
  - [ ] 5. Critical forms & user workflows
  - [ ] 6. SSL certificate validity & HTTPS redirect
  - [ ] 7. Secure error handling (no stack traces)
  - [ ] 8. Pre-deploy backup verified in storage

---

## 10. Completion Criteria

A DevOps and deployment engineering engagement is complete when:
1. The infrastructure tier is provisioned and sized appropriately for the project's budget and scale.
2. Multi-stage container builds are hardened, non-root, and building deterministically.
3. Automated CI/CD pipelines build, test, and deploy immutable SHA-tagged artifacts.
4. Pre-deployment readiness is certified and automated backups are verified.
5. All 8 post-deployment smoke test checks pass with zero operational regressions.
