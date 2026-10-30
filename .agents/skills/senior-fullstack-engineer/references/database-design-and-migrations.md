# Database Design, Indexing & Zero-Downtime Migrations

Senior full-stack engineers design database schemas that guarantee referential integrity, scale efficiently, and evolve without downtime.

---

## 1. Schema Design Principles

### 1.1 Primary Key Strategy
- **UUIDv7 (Recommended for distributed systems):** Time-ordered 128-bit identifiers. Unlike random UUIDv4, UUIDv7 maintains sequential B-Tree index locality, preventing catastrophic index fragmentation on large tables while preventing ID enumeration attacks.
- **BIGINT / BIGSERIAL:** Highly performant, compact 64-bit integer. Ideal for internal sequential sequences, append-only logs, and high-throughput time-series records.

### 1.2 Referential Integrity & Cascade Safety
- **Always declare foreign key constraints:** Never rely solely on application-level code to maintain relational consistency.
- **Foreign Key Delete Rules:**
  - `ON DELETE RESTRICT` (Default): Prevent deletion of parent records (e.g., an Organization cannot be deleted while active Users exist).
  - `ON DELETE CASCADE`: Use only for tight composition / owned child entities (e.g., deleting an Invoice automatically deletes its InvoiceLineItems).
  - `ON DELETE SET NULL`: Use for optional associations (e.g., deleting a User sets `assigned_to_user_id = NULL` on assigned tickets).

### 1.3 Indexing Strategy
- **Index every foreign key column:** Databases do not automatically index foreign keys; unindexed foreign keys lead to full table scans during joins and delete cascades.
- **Composite Indexes (Left-Prefix Rule):** When querying by multiple columns (e.g., `WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC`):
  - Place equality columns first: `(tenant_id, status, created_at DESC)`.
- **Partial Indexes:** Index only the subset of rows queried frequently:
  ```sql
  CREATE INDEX idx_active_subscriptions ON subscriptions (user_id) WHERE status = 'active';
  ```

---

## 2. Zero-Downtime Schema Migrations (Expand & Contract)

Never execute destructive, breaking migrations directly against a production database. Use the **Expand and Contract** pattern across three deployment phases:

```
[ Phase 1: Expand ]
Add new column or table without removing old column.
Application writes to both old and new columns.
               │
               ▼
[ Phase 2: Backfill & Read Migration ]
Run background script to backfill historical data.
Deploy updated app that reads from new column.
               │
               ▼
[ Phase 3: Contract ]
Remove old application code referencing old column.
Execute migration to drop old column safely.
```

### Breaking vs. Safe Operations Matrix

| Database Operation | Risk Level | Safe Zero-Downtime Alternative |
| :--- | :---: | :--- |
| `ALTER TABLE ... DROP COLUMN name` | 🔴 **Breaking** | Stop reading the column in app code first. Deploy. Drop column in a subsequent release. |
| `ALTER TABLE ... ADD COLUMN ... NOT NULL` | 🔴 **Table Lock** | Add column as `NULLABLE`. Backfill data. Add `NOT NULL` constraint in separate migration. |
| `CREATE INDEX ...` | 🟡 **Lock Risk** | Use `CREATE INDEX CONCURRENTLY` (PostgreSQL) to avoid locking table writes during build. |
| `RENAME COLUMN ...` | 🔴 **Breaking** | Add new column. Dual-write in application. Migrate reads. Drop old column. |

---

## 3. Concurrency & Performance Patterns

### 3.1 Preventing the N+1 Query Problem
An N+1 query occurs when an application executes 1 query to fetch $N$ parent records, followed by $N$ separate queries to fetch children.
- **Relational Databases:** Use explicit SQL `JOIN` or batch queries (`WHERE parent_id IN (...)`).
- **ORMs:** Use eager loading (`include:` in Prisma, `selectinload()` in SQLAlchemy, `preload()` in GORM).

### 3.2 Optimistic Concurrency Control (OCC)
Prevent the "lost update" problem in concurrent environments (e.g., two users editing an invoice simultaneously) using a `version` column:

```sql
UPDATE invoices
SET total = 1500.00, version = version + 1
WHERE id = 'inv_123' AND version = 3;
```
If rows affected is `0`, a concurrent update occurred. The application catches this and returns a `409 Conflict` prompting the user to refresh.
