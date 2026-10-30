# OWASP Top 10 & 17-Point Application Security Audit Checklist

This checklist aligns with the **OWASP Top 10 (2021)** and the **OWASP Application Security Verification Standard (ASVS v4.0)**. Use it as an exhaustive audit gate for both frontend and backend architectures.

---

## The 17 Core Security Inspection Pillars

### 1. Authentication & Session Security (OWASP A07)
- [ ] Session tokens stored exclusively in `HttpOnly; Secure; SameSite=Lax/Strict` cookies.
- [ ] No sensitive JWTs or session IDs stored in `localStorage` or `sessionStorage`.
- [ ] Absolute session timeout (e.g. 7–14 days) and inactivity idle timeout (e.g. 15–30 mins for high-risk applications).
- [ ] Session destroyed on server during logout (`revokeToken` / delete session record in Redis/DB).
- [ ] New session ID issued upon login to prevent session fixation attacks.

### 2. Password Hashing & Account Recovery (OWASP A02, A07)
- [ ] Passwords hashed using modern, memory-hard algorithms: **Argon2id** (recommended) or **bcrypt** (cost factor $\ge 12$).
- [ ] Zero plain-text MD5, SHA-1, or unsalted SHA-256 in password verification pipelines.
- [ ] Password reset tokens generated via cryptographically secure pseudorandom number generator (`crypto.randomBytes(32)`).
- [ ] Password reset tokens single-use, hashed in database, with a maximum lifetime of 15–30 minutes.
- [ ] Password comparison executes using constant-time string comparison (`crypto.timingSafeEqual`) to prevent side-channel timing attacks.

### 3. Authorisation & Role-Based Access Control (OWASP A01)
- [ ] Server-side authorization enforced on every mutation and query (never rely on frontend UI route guards).
- [ ] Broken Object-Level Authorization (BOLA/IDOR) eliminated: every request checks that `resource.tenant_id === req.user.tenant_id` and `resource.owner_id === req.user.id`.
- [ ] Administrative endpoints protected by explicit server-side RBAC middleware.
- [ ] Principle of least privilege enforced across user roles (Viewer, Editor, Admin).

### 4. SQL & NoSQL Injection Prevention (OWASP A03)
- [ ] 100% of database queries use parameterized prepared statements or safe ORM query builders.
- [ ] Zero raw string concatenation or template literal interpolation in SQL queries (`SELECT ... WHERE id = '${id}'`).
- [ ] Dynamic table or column names validated against strict internal allow-lists.
- [ ] NoSQL queries sanitize object inputs to prevent operator injection (e.g. `{ "$gt": "" }`).

### 5. Cross-Site Scripting (XSS) Mitigation (OWASP A03)
- [ ] Output encoding/escaping enforced by default in templates (React/Vue auto-escaping, HTML entity encoding).
- [ ] Raw HTML insertion methods (`dangerouslySetInnerHTML`, `v-html`, `innerHTML`) forbidden unless sanitized via **DOMPurify**.
- [ ] Content-Security-Policy (CSP) header configured without `'unsafe-inline'` or `'unsafe-eval'`.
- [ ] Contextual encoding applied for JavaScript strings, URLs, and HTML attributes.

### 6. Cross-Site Request Forgery (CSRF) Prevention (OWASP A01)
- [ ] Session cookies enforce `SameSite=Lax` or `SameSite=Strict`.
- [ ] State-changing endpoints (`POST`, `PUT`, `DELETE`, `PATCH`) protected by anti-CSRF tokens for session-cookie authentication.
- [ ] Custom request headers (`X-Requested-With` or custom headers) required for non-GET API requests.

### 7. Input Validation & Strict Allow-Listing (OWASP A03, A04)
- [ ] Server-side validation schemas (Zod, Pydantic, Joi) defined for 100% of incoming payloads.
- [ ] Validation follows strict allow-listing (reject unexpected fields) rather than block-listing.
- [ ] String lengths, numeric boundaries, email formats, and regex patterns strictly bounded.

### 8. API Security Architecture (OWASP A04, A05)
- [ ] HTTPS enforced with TLS 1.2+ across all endpoints with HSTS enabled (`Strict-Transport-Security`).
- [ ] CORS policy restricted to explicit, trusted origins; `Access-Control-Allow-Origin: *` forbidden on authenticated endpoints.
- [ ] API keys validated using constant-time comparison and rate-limited.

### 9. Rate Limiting & Brute Force Mitigation (OWASP A04, A07)
- [ ] Authentication endpoints (login, password reset, MFA) enforce strict rate limits (e.g. 5 attempts per 15 minutes per IP/account).
- [ ] Account lockout or exponential backoff triggered after repeated failed login attempts.
- [ ] Global API rate limits enforced using sliding-window or token-bucket algorithms (e.g. via Redis).

### 10. File Upload Security (OWASP A03, A04)
- [ ] Direct-to-cloud upload via presigned S3/GCS URLs preferred over streaming through web server.
- [ ] File extensions validated against a strict allow-list (never trust client-supplied filename).
- [ ] MIME types verified by inspecting file "magic bytes" (file header signatures), not `Content-Type` header.
- [ ] Uploaded files stored outside web root with execute permissions removed (`chmod 644`).
- [ ] File size limits strictly enforced at reverse proxy and application layer.

### 11. Environment Variables & Secrets Management (OWASP A05)
- [ ] Zero secrets, private keys, or passwords committed to Git repositories.
- [ ] `.env` and secret files included in `.gitignore`.
- [ ] Automated pre-commit hooks or CI secret scanners (TruffleHog, Gitleaks) enabled.
- [ ] Separate credentials provisioned for development, staging, and production environments.

### 12. Database Permissions & Least Privilege (OWASP A01, A05)
- [ ] Application database user lacks administrative permissions (`DROP DATABASE`, `ALTER TABLE`, `SUPERUSER`).
- [ ] Database migrations execute under a dedicated migration user; runtime application connects with restricted `SELECT`, `INSERT`, `UPDATE`, `DELETE` privileges.
- [ ] Database connection restricted to private subnet/VPC; public database ports closed.

### 13. Payment Security & PCI-DSS Compliance
- [ ] Zero raw credit card numbers, CVVs, or expiration dates ever touch application servers.
- [ ] Client uses PCI-compliant hosted fields (Stripe Elements, Braintree Drop-in, Adyen).
- [ ] Webhook endpoints verify cryptographic signatures (e.g. `Stripe-Signature` via `stripe.webhooks.constructEvent`).

### 14. Dependency Vulnerabilities & Supply Chain Security (OWASP A06)
- [ ] Dependency lockfiles committed (`package-lock.json`, `poetry.lock`, `go.sum`).
- [ ] Automated dependency vulnerability scanning active in CI (`npm audit`, `pip-audit`, Dependabot, Snyk).
- [ ] Unused or abandoned dependencies pruned regularly.

### 15. Secure Error Handling (OWASP A05)
- [ ] Stack traces, database query strings, and environment variables never returned in HTTP error responses.
- [ ] Standardized RFC 7807 Problem Details or generic error messages returned to clients.
- [ ] Errors logged internally with unique correlation IDs (`trace_id` / `request_id`).

### 16. Security Logging & Monitoring (OWASP A09)
- [ ] Security events logged: failed logins, password changes, privilege escalation, authorization failures, rate-limit hits.
- [ ] Logs sanitized to prevent accidental leakage of PII, passwords, session tokens, or API keys.
- [ ] Centralized log aggregation with alerting on suspicious thresholds.

### 17. Backup & Disaster Recovery
- [ ] Automated, encrypted database backups running on daily and point-in-time schedules.
- [ ] Backups stored in geographically distinct, write-once (WORM / Object Lock) cloud storage.
- [ ] Periodic restore drills executed and documented to verify Recovery Time Objective (RTO) and Recovery Point Objective (RPO).

