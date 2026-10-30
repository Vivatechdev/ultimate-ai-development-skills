---
name: senior-fullstack-engineer
description: Architect and engineer production-grade full-stack web applications. Enforces 3-tier layered backend architecture (Controller-Service-Repository), type-safe APIs, zero-downtime database migrations, server-side RBAC, and robust error handling.
---

# Senior Full-Stack Engineer

This skill governs the end-to-end engineering lifecycle for production-grade full-stack web applications. Operating as a senior full-stack software engineer, the agent enforces disciplined 3-tier backend architecture (Controller-Service-Repository), robust relational schema design with zero-downtime migrations, server-side authentication and role-based access control (RBAC), and seamless frontend-to-backend integration.

---

## 1. Purpose and Scope

### Scope
- Architecture and implementation across the full application lifecycle: frontend state management, API contracts, domain service logic, database persistence, and cloud file storage.
- Enforcing strict separation of concerns across a 3-tier backend architecture:
  - **HTTP Controller / Route Handler:** Request parsing, status codes, DTO mapping.
  - **Domain Service:** Business logic, authorization, transaction boundaries.
  - **Data Access Repository:** SQL queries, ORM mapping, index efficiency.
- Designing normalized database schemas with UUIDv7/BIGSERIAL keys, cascade safety, and zero-downtime migration protocols (Expand and Contract).
- Server-side authentication (`HttpOnly; Secure; SameSite=Strict` cookies) and granular RBAC/ABAC enforcement.
- Eliminating N+1 query anti-patterns, establishing connection pooling, and standardizing RFC 7807 Problem Details error responses.

### Out of Scope
- Visual design archetypes, color palette generation, or micro-interaction styling (see `ui-ux-design-mastery`).
- Multi-viewport visual regression and tap-target audits (see `visual-qa-and-ui-audit`).
- Infrastructure provisioning, Kubernetes cluster orchestration, and cloud Terraform setups (see `devops-deployment`).

---

## 2. When to Activate the Skill

### Primary Triggers
Activate this skill whenever:
- Designing or implementing new full-stack features, web applications, or RESTful API endpoints.
- Structuring backend services, domain business logic, or database schemas.
- Implementing authentication flows, session handling, or role-based authorization.
- Connecting frontend interfaces (forms, tables, dashboards) to live backend databases and APIs.
- Refactoring bloated route handlers or fixing database performance issues (N+1 queries, table locking).
- The user requests: *"build a full-stack feature"*, *"design the database schema"*, *"implement user authentication and RBAC"*, *"create a REST API"*, or *"refactor backend architecture"*.

### Anti-Triggers
- Styling-only tasks with no data fetching or backend logic.
- Low-level hardware drivers or embedded firmware development.

---

## 3. Required Pre-Development Discipline

Never jump directly into writing code. Before beginning development, execute the **Senior Engineer Pre-Flight Assessment**:

```text
┌────────────────────────────────────────────────────────┐
│            SENIOR PRE-FLIGHT ASSESSMENT                │
├────────────────────┬───────────────────────────────────┤
│ 1. Codebase Audit  │ Language, runtime, package manager│
│ 2. Existing Stack  │ Framework, ORM, database engine   │
│ 3. Architecture    │ Layered, MVC, microservice, etc.  │
│ 4. Requirements    │ Explicit user stories & invariants│
│ 5. Technical Risks │ Concurrency, data loss, locks     │
│ 6. Action Plan     │ Phased implementation roadmap     │
└────────────────────┴───────────────────────────────────┘
```

1. **Inspect Existing Project:** Check directory layout, package managers (`package.json`, `pyproject.toml`, `go.mod`, `Gemfile`), and dependencies.
2. **Identify Existing Architecture:** Determine whether the codebase uses monolithic MVC, modular domain-driven architecture, or serverless functions. *Never rewrite functioning systems unnecessarily.*
3. **Analyze Technical Stack:** Use the established technologies in the project (e.g. Prisma, Drizzle, SQLAlchemy, GORM). Do not introduce unnecessary libraries.
4. **Clarify Invariants & Constraints:** Identify required business rules, tenant boundaries, and permissions.
5. **Evaluate Technical Risks:** Identify concurrency risks, database locking potential, and security attack surfaces.
6. **Propose an Implementation Plan:** Deliver a concise roadmap before executing major refactorings.

---

## 4. Step-by-Step Engineering Workflow

Execute full-stack development through eight disciplined phases:

```
[ Phase 1: Pre-Flight Discovery & Tech Stack Inspection ]
                           │
[ Phase 2: Schema Design & Zero-Downtime Migration ]
                           │
[ Phase 3: Data Access Layer (Repository Pattern) ]
                           │
[ Phase 4: Business Domain Layer (Service Pattern & RBAC) ]
                           │
[ Phase 5: API Layer & Contract Validation (Controllers) ]
                           │
[ Phase 6: Frontend Integration & State Hydration ]
                           │
[ Phase 7: Observability, Error Handling & Logging ]
                           │
[ Phase 8: Production-Readiness Sign-Off ]
```

### Phase 1: Pre-Flight Discovery & Stack Inspection
- Audit existing database connections, environment variables (`.env.example`), and route configurations.
- Ensure the proposed changes align with existing naming conventions and directory structures.

### Phase 2: Schema Design & Zero-Downtime Migration
- Design normalized tables in [references/database-design-and-migrations.md](references/database-design-and-migrations.md).
- Choose primary key strategy (UUIDv7 for distributed environments; BIGSERIAL for internal sequences).
- Declare explicit foreign keys with safe delete rules (`ON DELETE RESTRICT` or `ON DELETE CASCADE`).
- Index foreign key columns and frequently filtered columns.
- For existing schemas, use the **Expand and Contract** pattern to prevent table locks and deployment downtime.

### Phase 3: Data Access Layer (Repository Pattern)
- Implement repository methods encapsulating SQL queries or ORM calls.
- Prevent N+1 queries using explicit SQL joins or eager-loading relations.
- Implement connection pooling and transaction rollbacks on failures.

### Phase 4: Business Domain Layer (Service Pattern & RBAC)
- Implement domain business logic in dedicated service classes. Consult [references/layered-backend-architecture.md](references/layered-backend-architecture.md).
- Enforce authentication and RBAC permissions strictly on the server:
  - Verify `req.user` role and permissions before executing mutations. Consult [references/auth-rbac-and-security.md](references/auth-rbac-and-security.md).
  - Enforce tenant isolation (`WHERE tenant_id = ?` or Row-Level Security).

### Phase 5: API Layer & Contract Validation (Controllers)
- Author RESTful endpoints following [references/api-design-and-error-handling.md](references/api-design-and-error-handling.md).
- Validate all incoming query parameters and request bodies using strict validation schemas (Zod, Pydantic, Joi).
- Return standard HTTP status codes: `201 Created` for creations, `204 No Content` for deletions, `422 Unprocessable Entity` for validation failures.
- Format errors using RFC 7807 Problem Details.

### Phase 6: Frontend Integration & State Hydration
- Connect frontend components to live backend endpoints.
- **Rule of Integrity:** Never build a frontend with static, disconnected mock data when full-stack functionality is requested.
- Handle all network states: loading skeleton, populated data table, empty state, and error banner.
- Implement optimistic updates only when paired with rollback on server failure.

### Phase 7: Observability, Error Handling & Logging
- Centralize unhandled exception logging with request correlation IDs (`X-Request-Id`).
- Never expose internal database errors or raw stack traces in API response bodies.
- Store sensitive session tokens exclusively in `HttpOnly; Secure; SameSite=Lax/Strict` cookies.

### Phase 8: Production-Readiness Sign-Off
- Run integration tests covering happy paths, validation rejection, and unauthorized attempts.

---

## 5. Professional Standards & Best Practices

1. **The 3-Tier Layer Separation:**
   - Controllers handle HTTP transport; Services handle business rules; Repositories handle database I/O.
2. **Server-Side Validation is Mandatory:**
   - Client-side validation is a UX convenience; server-side validation is a security boundary.
3. **Server-Side Authorization is Non-Negotiable:**
   - Never trust frontend role flags (e.g. `isAdmin: true` in localStorage). Validate session cookies and verify permissions in backend middleware.
4. **Presigned Cloud Uploads:**
   - Large file uploads must bypass application servers and stream directly to cloud storage (S3/GCS/R2) via presigned URLs.
5. **ACID Transaction Boundaries:**
   - Multi-step operations affecting multiple tables must execute within an explicit database transaction with automatic rollback on error.

---

## 6. Decision-Making Guidelines

```text
Evaluating API Architectural Pattern
├─ Is the frontend tightly coupled to a single TypeScript backend?
│  ├─ YES ──> tRPC or Next.js Server Actions (End-to-end type safety).
│  └─ NO
│     ├─ Does the client require complex, flexible nested data graphs?
│     │  ├─ YES ──> GraphQL (Apollo / Yoga).
│     │  └─ NO  ──> RESTful API (OpenAPI / JSON Schema). Standard, universal, cacheable.
```

```text
Database Selection Matrix
├─ Relational, structured data requiring ACID guarantees & foreign keys?
│  ├─ YES ──> PostgreSQL (Default choice for 90% of enterprise web apps).
│  └─ NO
│     ├─ High-volume append-only event streaming or flexible schemaless documents?
│     │  ├─ YES ──> MongoDB / ClickHouse / DynamoDB.
│     │  └─ NO  ──> SQLite (Embedded, single-node, edge, or dev/test environments).
```

---

## 7. Common Mistakes & Anti-Patterns to Avoid

| Prohibited Anti-Pattern | Correct Senior Engineering Practice |
| :--- | :--- |
| **"Fake Frontends" (Mock Data Only)** | Connect frontend components to real, working backend endpoints and database models. |
| **Fat Route Handlers (Queries inside Controllers)** | Decouple into Controllers $\rightarrow$ Services $\rightarrow$ Repositories. |
| **Client-Only Form Validation** | Validate schemas on the server; return 422 with granular field error mappings. |
| **Storing JWTs in `localStorage`** | Store authentication sessions in `HttpOnly; Secure; SameSite=Lax/Strict` cookies. |
| **N+1 Query Cascades in Loops** | Use SQL `JOIN`, batch queries, or ORM eager-loading (`include:` / `selectinload()`). |
| **Direct File Uploads to Web Servers** | Generate presigned S3/GCS URLs; client uploads directly to cloud storage. |
| **Unindexed Foreign Keys** | Create explicit indexes on all foreign key columns. |

---

## 8. Practical Implementation Examples

### 3-Tier Architecture in TypeScript / Node.js

```typescript
// ================= 1. REPOSITORY LAYER =================
export class ProjectRepository {
  constructor(private db: DatabaseClient) {}

  async findByTenant(tenantId: string): Promise<Project[]> {
    return this.db.query('SELECT * FROM projects WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId]);
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    return this.db.query(
      'INSERT INTO projects (id, tenant_id, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [crypto.randomUUID(), data.tenantId, data.name]
    );
  }
}

// ================= 2. SERVICE LAYER (BUSINESS RULES + RBAC) =================
export class ProjectService {
  constructor(private projectRepo: ProjectRepository) {}

  async createProject(user: AuthUser, name: string): Promise<Project> {
    // Authorization Check
    if (!user.permissions.includes('projects:create')) {
      throw new ForbiddenError('User lacks permission to create projects');
    }
    // Business Rule: Validate name length
    if (name.trim().length < 3) {
      throw new ValidationError('Project name must be at least 3 characters');
    }

    return this.projectRepo.create({ tenantId: user.tenantId, name: name.trim() });
  }
}

// ================= 3. CONTROLLER LAYER (HTTP TRANSPORT) =================
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  async handleCreate(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user; // Injected by auth middleware
      const { name } = req.body;

      const project = await this.projectService.createProject(user, name);
      res.status(201).json({ data: project });
    } catch (err: any) {
      if (err instanceof ForbiddenError) {
        res.status(403).json({ title: 'Forbidden', status: 403, detail: err.message });
      } else if (err instanceof ValidationError) {
        res.status(422).json({ title: 'Validation Error', status: 422, detail: err.message });
      } else {
        res.status(500).json({ title: 'Internal Server Error', status: 500 });
      }
    }
  }
}
```

---

## 9. Production-Readiness Quality Checklist

Before declaring any full-stack feature complete:
- [ ] **3-Tier Separation:** Handlers do not execute raw database queries; services contain business rules; repositories handle I/O.
- [ ] **Server-Side Validation:** All inputs validated against strict schemas on the server (returning 422 on failure).
- [ ] **Server-Side Authorization:** Permissions enforced on the server; multi-tenant queries filter by `tenant_id`.
- [ ] **No N+1 Queries:** Relational joins or eager-loading verified; foreign keys are indexed.
- [ ] **Secure Session Storage:** Authentication tokens stored in `HttpOnly; Secure; SameSite=Lax/Strict` cookies.
- [ ] **Connected Frontend:** UI components render real data from endpoints with loading, error, and empty states.
- [ ] **Structured Errors:** Errors conform to RFC 7807 Problem Details; zero raw stack traces exposed to client.
- [ ] **ACID Transactions:** Multi-table writes wrapped in database transactions with rollback capability.

---

## 10. Completion Criteria

A full-stack engineering task is complete when:
1. The pre-flight inspection confirms seamless integration with the host project's architecture.
2. Database migrations are generated, reversible, and non-blocking.
3. The 3-tier backend layers are implemented, tested, and strictly decoupled.
4. Frontend interfaces are verified against live backend endpoints with complete state coverage.
5. All checklist items pass verification without regressions.
