# Authentication, RBAC & Cloud File Storage Architecture

Security must be implemented with defense-in-depth on the server. Never trust client-side claims or rely solely on frontend route guards.

---

## 1. Authentication Architecture

### 1.1 Secure Cookie vs. LocalStorage
- **Never store sensitive session tokens or JWTs in `localStorage` or `sessionStorage`:** Any cross-site scripting (XSS) vulnerability can immediately read and exfiltrate the token.
- **Always store tokens in `HttpOnly; Secure; SameSite=Lax/Strict` cookies:**
  - `HttpOnly`: Inaccessible to JavaScript `document.cookie`.
  - `Secure`: Transmitted exclusively over encrypted HTTPS connections.
  - `SameSite=Lax` (or `Strict`): Prevents Cross-Site Request Forgery (CSRF) on cross-origin requests.

### 1.2 Dual-Token Architecture with Refresh Token Rotation
```text
Client Request
      │
      ├──> Short-Lived Access Token (15 mins) ──> Validates Statelessly on API
      │
      └──> (When Access Token Expires)
           POST /api/auth/refresh (Cookie with Refresh Token)
                 │
                 ▼
           Server validates refresh token in Redis/DB
           Issues NEW Access Token + NEW Refresh Token
           Old Refresh Token is IMMEDIATELY revoked
```
*Reuse Detection:* If an already-revoked refresh token is presented, the server immediately revokes all sessions for that user (indicating token theft).

---

## 2. Server-Side Authorization (RBAC / ABAC)

Frontend route protection (e.g. hiding an "Admin" button) is merely UX sugar; the **server must independently enforce authorization on every request**.

### 2.1 Role-Based Access Control (RBAC)
Map roles to specific granular permissions:

```typescript
export const RolePermissions = {
  viewer: ['documents:read'],
  editor: ['documents:read', 'documents:create', 'documents:edit'],
  admin:  ['documents:read', 'documents:create', 'documents:edit', 'documents:delete', 'users:manage']
} as const;

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const permissions = RolePermissions[userRole] || [];

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        type: 'https://api.example.com/errors/forbidden',
        title: 'Forbidden',
        status: 403,
        detail: `Role '${userRole}' lacks permission '${permission}'`
      });
    }
    next();
  };
}
```

### 2.2 Multi-Tenant Data Isolation
Every database query in a multi-tenant application **must** filter by `tenant_id`.
- *PostgreSQL Row-Level Security (RLS):* Enforce at the database level so developers cannot accidentally omit `WHERE tenant_id = ?`:
  ```sql
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  CREATE POLICY tenant_isolation_policy ON projects
    USING (tenant_id = current_setting('app.current_tenant_id'));
  ```

---

## 3. Direct-to-Cloud File Storage (Presigned URLs)

**Anti-Pattern:** Uploading multi-megabyte files (images, videos, PDFs) directly to the application server (`express`, `django`, `fastapi`). This saturates server memory, ties up worker threads, and creates an easy denial-of-service (DoS) attack vector.

**Senior Pattern:** Use Presigned URLs (S3, Cloud Storage, Cloudflare R2):

```text
[ Browser / Client ] ── 1. POST /api/uploads/sign (filename, size, mimeType) ──> [ App Server ]
                                                                                        │
                                                                               Validates size/auth
                                                                               Generates S3 Presigned URL
                                                                                        │
[ Browser / Client ] <── 2. Returns { uploadUrl, fileKey } ─────────────────────────────┘
      │
      └── 3. PUT file directly to S3 / R2 using uploadUrl ──> [ S3 / Cloud Bucket ]
            (Zero application server memory or network consumed)
```

