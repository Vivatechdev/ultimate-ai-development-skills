# Application Security Engineer

[![Agent Skills: Compatible](https://img.shields.io/badge/Agent%20Skills-Compliant-blue.svg)](../../docs/skill-development-guide.md)
[![Status: Verified](https://img.shields.io/badge/Status-Verified-brightgreen.svg)](examples/security-audit-testbed/audit-and-exploit.js)

Identify, audit, prevent, and remediate application security vulnerabilities across frontend and backend systems. Enforces OWASP Top 10 and ASVS standards, parameterized queries, server-side RBAC, secure session cookies, and defense-in-depth architecture.

---

## Quick Links
- **Primary Instructions:** [SKILL.md](SKILL.md)
- **Security References:**
  - [OWASP Top 10 & ASVS Checklist](references/owasp-top-10-and-asvs-checklist.md)
  - [Vulnerability Remediation Guide](references/vulnerability-remediation-guide.md)
  - [Security Headers & Cookies](references/security-headers-and-cookies.md)
- **Vulnerable vs. Hardened Server:** [vulnerable-api.js](examples/security-audit-testbed/vulnerable-api.js) vs [remediated-api.js](examples/security-audit-testbed/remediated-api.js)
- **Automated Exploit & Verification Suite:** [audit-and-exploit.js](examples/security-audit-testbed/audit-and-exploit.js)

---

## When to Activate
- Performing security code audits or threat modeling.
- Reviewing authentication, session storage, password reset, or OAuth flows.
- Auditing against SQL injection, XSS, CSRF, IDOR/BOLA, or SSRF.
- Hardening production HTTP headers and cookie security flags.

---

## Verification
Run the security audit and exploit remediation suite:
```bash
node examples/security-audit-testbed/audit-and-exploit.js
```

