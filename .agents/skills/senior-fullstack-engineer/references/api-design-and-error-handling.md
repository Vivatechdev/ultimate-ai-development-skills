# REST API Architecture & Standardized Error Handling

Production APIs require deterministic contract definitions, predictable HTTP status code usage, and structured error formatting.

---

## 1. Pragmatic RESTful API Design

### 1.1 Resource-Oriented URL Structure
- Use lowercase, plural nouns: `/api/v1/projects`, `/api/v1/invoices`.
- Express relationships hierarchically: `/api/v1/organizations/:orgId/members`.
- Avoid actions in URLs:
  - ❌ `POST /api/v1/createProject`
  - ✅ `POST /api/v1/projects`
  - ❌ `POST /api/v1/deleteUser?id=123`
  - ✅ `DELETE /api/v1/users/123`
- Non-CRUD actions: Treat actions as sub-resources:
  - `POST /api/v1/invoices/:id/void` or `POST /api/v1/deployments/:id/rollback`.

### 1.2 HTTP Status Code Matrix

| Status Code | Meaning | When to Use |
| :--- | :--- | :--- |
| **200 OK** | Success with payload | Successful `GET`, or `PUT`/`PATCH` returning updated resource. |
| **201 Created** | Resource created | Successful `POST`. Include `Location` header or created object in body. |
| **204 No Content**| Success, no body | Successful `DELETE` or mutation returning no payload. |
| **400 Bad Request**| Malformed request | Syntax error or malformed JSON body. |
| **401 Unauthorized**| Missing/invalid auth | Missing token, expired session, or invalid credentials. |
| **403 Forbidden** | Authenticated, not allowed | User is logged in but lacks required permission/role for the resource. |
| **404 Not Found** | Resource missing | Requested ID does not exist, or hidden for security reasons. |
| **409 Conflict** | State collision | Unique constraint violation (e.g. duplicate email) or concurrency conflict. |
| **422 Unprocessable**| Schema validation failure| Payload is valid JSON but fails business validation rules (field errors). |
| **429 Too Many Requests**| Rate limited | Request quota exceeded; include `Retry-After` header. |
| **500 Internal Error**| Unhandled crash | Unexpected server exception. Never expose raw stack traces to the client. |

---

## 2. Standardized RFC 7807 Problem Details

Never return unstructured error strings (`{ "error": "Something went wrong" }`). Adopt the standard **RFC 7807 Problem Details** format:

```json
{
  "type": "https://api.example.com/errors/validation-error",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "The payload contained 2 invalid fields.",
  "instance": "/api/v1/users",
  "invalidParams": [
    {
      "name": "email",
      "reason": "Must be a valid email address."
    },
    {
      "name": "password",
      "reason": "Must contain at least 10 characters."
    }
  ]
}
```

---

## 3. Cursor-Based Pagination

Offset pagination (`LIMIT 20 OFFSET 10000`) becomes prohibitively slow on large datasets and suffers from the "skip/duplicate page drift" bug when new records are inserted concurrently.

Use **Cursor-Based Pagination** for high-volume collections:

```text
GET /api/v1/audit-logs?limit=25&cursor=eyJpZCI6MTU0LCJjcmVhdGVkQXQiOjE3M...
```

### SQL Implementation:
```sql
SELECT id, action, created_at
FROM audit_logs
WHERE (created_at, id) < (:cursor_created_at, :cursor_id)
ORDER BY created_at DESC, id DESC
LIMIT 26; -- Fetch 1 extra to determine 'hasMore'
```

### API Response Format:
```json
{
  "data": [...],
  "pagination": {
    "hasMore": true,
    "nextCursor": "eyJpZCI6MTI4LCJjcmVhdGVkQXQiOjE3MT..."
  }
}
```

---

## 4. Idempotency Keys for Critical Mutations

Financial transactions, charge creations, and order submissions must support the `Idempotency-Key` header:

1. Client sends `Idempotency-Key: uuid-v4` header with `POST /api/v1/payments`.
2. Server checks Redis/database for existing key:
   - If found and completed: Returns cached response immediately without re-executing charge.
   - If found and pending: Returns `409 Conflict` (request in flight).
   - If not found: Stores key in Redis with 24h TTL, executes payment, saves result, and returns.

