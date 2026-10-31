# DevOps & Deployment Engineer

[![Agent Skills: Compatible](https://img.shields.io/badge/Agent%20Skills-Compliant-blue.svg)](../../docs/skill-development-guide.md)
[![Status: Verified](https://img.shields.io/badge/Status-Verified-brightgreen.svg)](examples/deployment-testbed/test-devops.js)

Architect, configure, automate, and troubleshoot production deployment pipelines, containerization, and cloud infrastructure. Enforces cost-appropriate hosting tiers, multi-stage Docker builds, zero-downtime CI/CD, and post-deployment smoke testing.

---

## Quick Links
- **Primary Instructions:** [SKILL.md](SKILL.md)
- **DevOps References:**
  - [Infrastructure Tier Selection Matrix](references/infrastructure-tier-selection-matrix.md)
  - [Docker & CI/CD Hardening Patterns](references/docker-and-ci-cd-patterns.md)
  - [Production Readiness & Smoke Test Protocol](references/production-readiness-and-smoke-test.md)
- **Deployment Assets:** [Dockerfile](examples/deployment-testbed/Dockerfile), [deploy.yml](examples/deployment-testbed/deploy.yml)
- **8-Point Post-Deploy Smoke Test:** [test-devops.js](examples/deployment-testbed/test-devops.js)

---

## When to Activate
- Provisioning production infrastructure, servers, PaaS, or container runtimes.
- Writing hardened multi-stage Dockerfiles and `.dockerignore` files.
- Configuring GitHub Actions CI/CD deployment pipelines.
- Conducting pre-flight production-readiness reviews and post-deploy smoke tests.

---

## Verification
Run the 8-point post-deployment smoke test suite:
```bash
node examples/deployment-testbed/test-devops.js
```
