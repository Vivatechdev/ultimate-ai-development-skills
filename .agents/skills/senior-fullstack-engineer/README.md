# Senior Full-Stack Engineer

[![Agent Skills: Compatible](https://img.shields.io/badge/Agent%20Skills-Compliant-blue.svg)](../../docs/skill-development-guide.md)
[![Status: Verified](https://img.shields.io/badge/Status-Verified-brightgreen.svg)](examples/fullstack-api-app/test-runner.js)

Architect and engineer production-grade full-stack web applications. Enforces 3-tier layered backend architecture (Controller-Service-Repository), type-safe APIs, zero-downtime database migrations, server-side RBAC, and robust error handling.

---

## Quick Links
- **Primary Instructions:** [SKILL.md](SKILL.md)
- **Engineering References:**
  - [Layered Backend Architecture](references/layered-backend-architecture.md)
  - [Database Design & Migrations](references/database-design-and-migrations.md)
  - [Auth, RBAC & Security](references/auth-rbac-and-security.md)
  - [API Design & Error Handling](references/api-design-and-error-handling.md)
- **3-Tier Implementation:** [app.js](examples/fullstack-api-app/app.js)
- **Automated Verification:** [test-runner.js](examples/fullstack-api-app/test-runner.js)

---

## When to Activate
- Architecting new backend services, RESTful APIs, or full-stack features.
- Refactoring bloated controllers into clean Controller-Service-Repository layers.
- Designing normalized relational schemas and zero-downtime database migrations.
- Implementing server-side authorization, authentication, and session handling.

---

## Verification
Run the 3-tier fullstack application test suite:
```bash
node examples/fullstack-api-app/test-runner.js
```
