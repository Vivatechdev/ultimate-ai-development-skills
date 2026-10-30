# Layered Backend Architecture & Modular Domain Design

Production backend applications must maintain a strict separation of concerns. AI code generators frequently bundle database queries, validation, authorization, and HTTP formatting into a single route handler, creating unmaintainable, untestable code.

---

## 1. The 3-Tier Layered Architecture

Always structure backend logic into three distinct layers:

```
┌────────────────────────────────────────────────────────┐
│                   HTTP / API LAYER                     │
│  Controllers, Route Handlers, Serialization, HTTP Codes│
└───────────────────────────┬────────────────────────────┘
                            │ (Calls Service Interface)
                            ▼
┌────────────────────────────────────────────────────────┐
│                  DOMAIN / SERVICE LAYER                │
│  Business Rules, Authorization, Validation, Workflows │
└───────────────────────────┬────────────────────────────┘
                            │ (Calls Repository Interface)
                            ▼
┌────────────────────────────────────────────────────────┐
│               DATA ACCESS / REPOSITORY LAYER           │
│  Database Queries, Transactions, SQL, Redis, Storage   │
└────────────────────────────────────────────────────────┘
```

### 1.1 Responsibilities by Layer

| Layer | Strict Responsibilities | Prohibited Actions |
| :--- | :--- | :--- |
| **1. Controller / Handler** | - Parse HTTP request headers, query params, and body.<br>- Trigger input schema validation.<br>- Extract authenticated user context (`req.user`).<br>- Call appropriate Service method.<br>- Format HTTP response status (200, 201, 204, 400, etc.). | - Executing direct SQL queries or ORM calls.<br>- Containing business logic or transaction boundaries.<br>- Interacting with external third-party APIs directly. |
| **2. Service / Domain** | - Enforce business rules and domain invariants.<br>- Enforce role and resource permissions (RBAC / ABAC).<br>- Orchestrate multi-step workflows (e.g. charge payment $\rightarrow$ update inventory $\rightarrow$ send receipt).<br>- Manage database transaction lifecycles. | - Reading raw `req` or writing raw `res` HTTP objects.<br>- Knowing about HTTP headers, status codes, or cookies.<br>- Writing raw SQL queries. |
| **3. Repository / Data Access** | - Execute queries against the database (PostgreSQL, MySQL, SQLite, MongoDB).<br>- Hydrate data models / entities.<br>- Manage database connection pooling and query efficiency (indexes, joins). | - Making business decisions or authorization checks.<br>- Calling external third-party payment/email APIs.<br>- Parsing HTTP parameters. |

---

## 2. Multi-Stack Architectural Mapping

This pattern is universally applicable across modern backend environments:

### TypeScript / Node.js
```text
src/
├── controllers/       # UserController.ts (HTTP endpoints)
├── services/          # UserService.ts (Business logic & authorization)
├── repositories/      # UserRepository.ts (Prisma / Drizzle / Kysely queries)
└── schemas/           # user.schema.ts (Zod validation contracts)
```

### Python / FastAPI
```text
app/
├── routers/           # api/v1/users.py (FastAPI route decorators & DTOs)
├── services/          # user_service.py (Business rules & auth checks)
├── repositories/      # user_repository.py (SQLAlchemy / SQLModel sessions)
└── schemas/           # user_schema.py (Pydantic models)
```

### Go
```text
internal/
├── handler/           # http/user_handler.go (net/http or Chi/Gin)
├── service/           # domain/user_service.go (Domain interface & logic)
└── repository/        # postgres/user_repo.go (database/sql or pgx)
```

---

## 3. Dependency Inversion & Testability

Services depend on repository interfaces, not concrete database connections. This allows deterministic unit testing using in-memory mock repositories without spawning a live database instance:

```typescript
// Interface defined in domain
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
}

// Service accepts interface via constructor (Dependency Injection)
export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async registerUser(dto: CreateUserDTO): Promise<User> {
    // 1. Enforce business invariant
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }
    // 2. Persist
    return this.userRepo.create(dto);
  }
}
```

