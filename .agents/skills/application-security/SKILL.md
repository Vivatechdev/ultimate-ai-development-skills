---
name: application-security
description: Identify, audit, prevent, and remediate application security vulnerabilities across frontend and backend systems. Enforces OWASP Top 10 and ASVS standards, parameterized queries, server-side RBAC, secure session cookies, and defense-in-depth architecture.
---

# Application Security

This skill governs the identification, assessment, prevention, and remediation of security vulnerabilities across web applications and APIs. Operating as an experienced application security engineer, the agent audits code against the **OWASP Top 10 (2021)** and **OWASP ASVS v4.0** standards, models attack vectors, resolves critical vulnerabilities directly in source code, and enforces defense-in-depth architectures.

---

## 1. Purpose and Scope

### Scope
- Comprehensive auditing and code remediation across the 17 core security pillars:
  1. Authentication & session security
  2. Password hashing (Argon2id/bcrypt) & recovery
  3. Authorization & RBAC (IDOR/BOLA prevention)
  4. SQL and NoSQL injection
  5. Cross-Site Scripting (XSS)
  6. Cross-Site Request Forgery (CSRF)
  7. Input validation & strict allow-listing
  8. API security (CORS, token expiration)
  9. Rate limiting & brute force defense
  10. Secure file uploads (magic bytes, presigned URLs)
  11. Secrets management & environment isolation
  12. Database permissions (least privilege)
  13. Payment security & PCI-DSS compliance
  14. Dependency vulnerabilities & supply chain (SCA)
  15. Secure error handling (RFC 7807, zero stack trace leaks)
  16. Security logging & monitoring (PII sanitization)
  17. Backup & disaster recovery protocols
- Classifying vulnerabilities using the Common Vulnerability Scoring System (CVSS 3.1).
- Applying surgical code fixes and performing exploit re-testing to verify remediation.

### Out of Scope
- Physical data center security or hardware biometric controls.
- Active denial-of-service (DDoS) volumetric network scrubbing (handled at cloud CDN/Cloudflare tier).
- Legal compliance certification (SOC 2 / ISO 27001 formal auditor sign-offs).

---

## 2. When to Activate the Skill

### Primary Triggers
Activate this skill whenever:
- Conducting a security code audit or vulnerability review prior to release.
- Investigating potential security defects (e.g., reported SQL injection, IDOR, or authentication bypass).
- Hardening authentication, user registration, password resets, or API endpoints.
- Implementing file upload handlers, payment integrations, or third-party webhooks.
- The user requests: *"perform a security audit"*, *"check for OWASP vulnerabilities"*, *"fix an IDOR or SQL injection bug"*, *"secure our authentication/session tokens"*, or *"harden our API headers and cookies"*.

### Anti-Triggers
- Styling or UI layout refactoring with zero security or data implications.
- Headless unit test performance benchmarking.

---

## 3. Required Pre-Audit Intake & Threat Modeling

Never begin security audits without establishing the system baseline:

```text
┌────────────────────────────────────────────────────────┐
│             SECURITY PRE-AUDIT INTAKE BASELINE         │
├────────────────────┬───────────────────────────────────┤
│ 1. Data Sensitivity│ PII, financial, health, public    │
│ 2. Auth Flow       │ Cookie sessions, JWT, OAuth, SAML │
│ 3. Entry Points    │ Public APIs, webhooks, uploads    │
│ 4. Attack Vectors  │ Injection, privilege escalation   │
└────────────────────┴───────────────────────────────────┘
```

1. **Classify Data Sensitivity:** Is the system handling public data, personally identifiable information (PII), or payment/financial data?
2. **Catalog Entry Points:** Identify all public HTTP routes, authenticated endpoints, file upload listeners, and webhook handlers.
3. **Inspect Authentication Architecture:** Determine where session tokens are stored (`localStorage` vs `HttpOnly` cookies) and how roles are verified.
4. **Enforce the Integrity Rule:** *Never claim that an application is "100% secure" or "bulletproof."* Security assessments are always scoped to the examined surface and code.

---

## 4. Step-by-Step Security Engineering Workflow

Execute security auditing and remediation across eight disciplined phases:

```
[ Phase 1: Attack Surface Discovery & Threat Modeling ]
                           │
[ Phase 2: Static Analysis & Configuration Audit ]
                           │
[ Phase 3: Vulnerability Isolation & Severity Triage ]
                           │
[ Phase 4: Exploit Proof-of-Concept & Root Cause Analysis ]
                           │
[ Phase 5: Surgical Code Remediation ]
                           │
[ Phase 6: Verification & Exploit Regression Testing ]
                           │
[ Phase 7: Defense-in-Depth Hardening (Headers, Limits) ]
                           │
[ Phase 8: Scoped Security Certification Report ]
```

### Phase 1: Attack Surface Discovery & Threat Modeling
- Enumerate endpoints and map data flows from untrusted user inputs to backend persistence.
- Apply the STRIDE framework (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).

### Phase 2: Static Analysis & Configuration Audit
- Scan for dangerous patterns:
  - Raw string interpolation in database queries (`$query = "SELECT ... WHERE id = '$id'"`).
  - Missing ownership filters on database lookups (`findById(params.id)` without `tenant_id` check).
  - Secrets or private keys committed to source code or git history.
  - Raw HTML injection (`innerHTML`, `dangerouslySetInnerHTML`).

### Phase 3: Vulnerability Isolation & Severity Triage
Triage every discovered issue using CVSS 3.1 severity tiers:
- **Critical (CVSS 9.0–10.0):** Remote code execution (RCE), SQL injection, unauthenticated privilege escalation, hardcoded master credentials.
- **High (CVSS 7.0–8.9):** IDOR / BOLA (accessing another tenant's records), stored XSS, broken authentication, lack of webhook signature verification.
- **Medium (CVSS 4.0–6.9):** CSRF on non-critical endpoints, missing rate limits, verbose database error messages leaked in API responses.
- **Low (CVSS 0.1–3.9):** Missing security headers (`X-Frame-Options`, `nosniff`), cookie missing `SameSite` attribute.

### Phase 4: Exploit Proof-of-Concept & Root Cause Analysis
- Construct a minimal, non-destructive test case proving the vulnerability exists.
- Document exact root cause (e.g., missing parameterization, missing middleware, insecure cookie flag).

### Phase 5: Surgical Code Remediation
When authorized, apply targeted code fixes following [references/vulnerability-remediation-guide.md](references/vulnerability-remediation-guide.md):
- Parameterize SQL queries.
- Add server-side tenant isolation checks.
- Upgrade password hashing to Argon2id / bcrypt.
- Sanitize HTML outputs with DOMPurify.

### Phase 6: Verification & Exploit Regression Testing
- Re-run the exploit proof-of-concept against the modified code.
- Confirm that the attack payload is completely neutralized and the endpoint returns appropriate status codes (`401`, `403`, `422`, `404`).

### Phase 7: Defense-in-Depth Hardening
- Apply production HTTP security headers (`CSP`, `HSTS`, `X-Content-Type-Options`) following [references/security-headers-and-cookies.md](references/security-headers-and-cookies.md).
- Enforce strict `HttpOnly; Secure; SameSite=Lax` flags on session cookies.
- Add rate-limiting middleware to authentication and mutation endpoints.

### Phase 8: Scoped Security Certification Report
- Produce a structured security audit report summarizing: scope, methodology, discovered vulnerabilities, remediation diffs, and remaining residual risks.

---

## 5. Professional Standards & Best Practices

1. **Client-Side Validation is Never a Security Boundary:**
   - Attackers bypass frontend validation with `curl` or Postman in milliseconds. Every business rule and data constraint must be enforced on the server.
2. **Parameterized Queries 100% of the Time:**
   - No exceptions for internal or "trusted" inputs. All SQL queries must use parameters (`$1` or `?`).
3. **Enforce Tenant Boundaries in Every Query:**
   - Multi-tenant applications must include `tenant_id` in database lookups or enforce Row-Level Security (RLS).
4. **Secrets Belong in Environment Variables:**
   - Never commit API keys or passwords. Use secret scanning tools (TruffleHog, Gitleaks) in CI pipelines.
5. **Fail Closed & Generic Errors:**
   - Authentication failures should return generic messages (*"Invalid email or password"*) to prevent user enumeration attacks.
   - Internal crashes must return generic RFC 7807 error envelopes without leaking database stack traces.

---

## 6. Decision-Making Guidelines

```text
Vulnerability Discovered
├─ Does it permit unauthenticated data access, arbitrary query execution, or account takeover?
│  ├─ YES ──> Critical / High. Block release. Immediate remediation required.
│  └─ NO
│     ├─ Does it permit abuse via automated loops or missing rate limits?
│     │  ├─ YES ──> Medium. Add Redis rate-limiter and lockout logic before general release.
│     │  └─ NO  ──> Low. Add missing security headers or cookie flags during polish phase.
```

---

## 7. Common Mistakes & Anti-Patterns to Avoid

| Prohibited Anti-Pattern | Correct Senior Security Engineering Practice |
| :--- | :--- |
| **Claiming "100% Security"** | Provide scoped assessments: *"Audited for OWASP Top 10 vulnerabilities; verified zero SQLi and IDOR in examined endpoints."* |
| **Storing Tokens in `localStorage`** | Store authentication sessions in `HttpOnly; Secure; SameSite=Lax/Strict` cookies. |
| **Security by Obscurity** | Relying on secret URLs (`/admin-987654`) instead of strict server-side RBAC middleware. |
| **Leaking Database Traces on 500** | Catch internal exceptions; return generic error message with internal correlation ID. |
| **Unsigned Webhook Listeners** | Verify HMAC-SHA256 signatures with constant-time comparison (`timingSafeEqual`). |
| **Trusting Client-Supplied Roles** | Never trust `req.body.role` or JWT claims directly from client without server verification. |

---

## 8. Practical Implementation Examples

### Structured Vulnerability Report Format

```markdown
### [SEC-001] [Severity: Critical (CVSS 9.8)] SQL Injection in Order Lookup

- **Vulnerability:** Unsanitized string interpolation in SQL query.
- **Affected Route:** `GET /api/v1/orders/:orderId` (`src/controllers/orderController.ts:42`)
- **Observed Exploit:** Payload `?orderId=' OR '1'='1` returned all historical customer orders across all tenants.
- **Root Cause:** Dynamic query string concatenation: `SELECT * FROM orders WHERE id = '${req.params.orderId}'`.
- **Remediation:** Converted to prepared parameterized statement:
  ```typescript
  const order = await db.query('SELECT * FROM orders WHERE id = $1 AND tenant_id = $2', [req.params.orderId, req.user.tenantId]);
  ```
- **Verification:** Re-ran exploit payload; server returned `404 Not Found`.
```

---

## 9. Quality Assurance Checklist

Verify all 17 pillars from [references/owasp-top-10-and-asvs-checklist.md](references/owasp-top-10-and-asvs-checklist.md):
- [ ] **Authentication:** Sessions stored in `HttpOnly; Secure; SameSite=Lax/Strict` cookies; no tokens in localStorage.
- [ ] **Password Security:** Memory-hard hashing (Argon2id/bcrypt $\ge 12$); secure reset tokens.
- [ ] **Authorization:** Server-side RBAC and tenant boundaries (`WHERE tenant_id = ?`) enforced on every query.
- [ ] **SQLi Protection:** 100% parameterized queries; zero string concatenation.
- [ ] **XSS Mitigation:** Auto-escaping active; DOMPurify used for rich text; script injection blocked.
- [ ] **CSRF Defense:** SameSite cookies active; state-changing endpoints protected.
- [ ] **Input Validation:** Strict allow-list schemas defined for all request bodies.
- [ ] **Security Headers:** CSP, HSTS, X-Content-Type-Options, X-Frame-Options configured.
- [ ] **Rate Limiting:** Auth endpoints protected against brute force.
- [ ] **File Uploads:** Presigned URLs used; magic bytes verified; executable permissions stripped.
- [ ] **Secrets:** Zero secrets committed to git; `.env` excluded.
- [ ] **Least Privilege:** Database user restricted to operational privileges.
- [ ] **Payments:** Hosted fields used (Stripe Elements); webhooks verified with constant-time HMAC.
- [ ] **Dependencies:** Lockfile committed; zero critical vulnerabilities in `npm audit` / SCA scan.
- [ ] **Secure Errors:** Zero stack traces or query strings leaked in error responses.
- [ ] **Logging:** Logs sanitized of PII and credentials; audit trail recorded.
- [ ] **Backups:** Automated, encrypted, geographically isolated backups with tested restore.

---

## 10. Completion Criteria

An application security engagement is complete when:
1. The target application's attack surface and endpoints have been audited against the 17 core pillars.
2. Discovered vulnerabilities are classified with CVSS severity, impact, and root-cause analysis.
3. All authorized fixes are implemented in source code and verified using regression exploit tests.
4. Production security headers and cookie flags are active.
5. A scoped security certification report is compiled.
