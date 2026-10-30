# Hardened Docker & Production CI/CD Pipeline Architecture

Containerization and continuous deployment must prioritize reproducibility, minimal attack surfaces, and zero-downtime release guarantees.

---

## 1. Hardened Multi-Stage Dockerfile Pattern (Node.js Example)

A production Dockerfile must:
1. Use multi-stage builds to strip build toolchains (compilers, devDependencies) from the final image.
2. Run as a **non-root user** (`USER node` or custom UID 10001).
3. Include an explicit `HEALTHCHECK` instruction.
4. Use minimal base images (`alpine` or `distroless`).
5. Handle Linux process signals (PID 1 `SIGTERM` / `SIGINT`) properly using `dumb-init` or `tini`.

```dockerfile
# ================= STAGE 1: DEPENDENCY RESOLUTION =================
FROM node:20-alpine AS deps
WORKDIR /app
# Install libc6-compat if building native modules
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ================= STAGE 2: APPLICATION BUILDER =================
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Run build command (e.g. Next.js build, TypeScript tsc)
RUN npm run build

# ================= STAGE 3: HARDENED RUNTIME =================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install dumb-init for proper signal handling (PID 1)
RUN apk add --no-cache dumb-init

# Create and switch to non-root user
USER node

# Copy production artifacts from previous stages
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./package.json

EXPOSE 3000

# Built-in Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

---

## 2. Production `.dockerignore` Specification

Prevent leaking secrets, local build artifacts, and Git metadata into image layers:

```text
.git
.github
.env
.env.*
*.local
node_modules
dist
build
coverage
*.log
Dockerfile*
.dockerignore
README.md
```

---

## 3. Production GitHub Actions CI/CD Pipeline

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # ================= STAGE 1: QUALITY & SECURITY GATES =================
  quality-gate:
    name: Lint, Test & Secret Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js Runtime
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter & Static Analysis
        run: npm run lint

      - name: Run Automated Test Suite
        run: npm test

      - name: Security Vulnerability Scan
        run: npm audit --audit-level=high

  # ================= STAGE 2: BUILD & CONTAINER PUSH =================
  build-and-push:
    name: Build & Push Container Image
    needs: quality-gate
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Metadata (Git SHA & Tags)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,prefix=sha-,format=short
            type=raw,value=latest

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ================= STAGE 3: DATABASE MIGRATION & DEPLOYMENT =================
  deploy-production:
    name: Deploy to Production & Verify Health
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Run Database Migrations (Pre-Deployment Hook)
        run: |
          echo "Executing non-blocking database migrations..."
          # npx prisma migrate deploy || ./scripts/migrate.sh

      - name: Trigger Rolling Deployment
        run: |
          echo "Deploying container version sha-${{ github.sha }}..."

      - name: Automated Post-Deployment Smoke Test
        run: |
          echo "Running post-deploy smoke test suite..."
          # node scripts/smoke-test.js https://app.example.com
```

