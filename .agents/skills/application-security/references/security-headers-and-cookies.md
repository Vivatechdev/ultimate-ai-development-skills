# Production HTTP Security Headers & Cookie Hardening

Hardening HTTP transport layers and session cookies provides baseline mitigation against clickjacking, MIME-sniffing, XSS exfiltration, and CSRF attacks.

---

## 1. Standard Production HTTP Security Headers

Every web application server must return the following baseline security headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self';
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

### Purpose by Header:
1. **`Content-Security-Policy` (CSP):** Restricts the sources from which scripts, styles, images, and fonts can load, blocking unauthorized external script injection (XSS).
2. **`Strict-Transport-Security` (HSTS):** Instructs browsers to communicate exclusively over HTTPS for the next 2 years (`63072000` seconds), preventing SSL-stripping man-in-the-middle attacks.
3. **`X-Content-Type-Options: nosniff`:** Prevents browsers from guessing (MIME-sniffing) the content type of responses, forcing adherence to declared `Content-Type`.
4. **`X-Frame-Options: DENY`:** Forbids any domain (including own origin) from embedding the application inside an `<iframe>`, preventing Clickjacking attacks.
5. **`Referrer-Policy: strict-origin-when-cross-origin`:** Strips sensitive URL query parameters when navigating cross-origin while sending full origin on same-origin requests.
6. **`Permissions-Policy`:** Disables access to hardware APIs (webcam, microphone, geolocation) by default.

---

## 2. Hardened Session Cookie Configuration

Session tokens and refresh tokens must be set with the four mandatory security flags:

```http
Set-Cookie: session_id=s_984f7e2a; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax
```

| Cookie Flag | Security Protection |
| :--- | :--- |
| **`HttpOnly`** | Forbids access via JavaScript `document.cookie`, preventing XSS token exfiltration. |
| **`Secure`** | Instructs the browser to transmit the cookie exclusively over encrypted HTTPS connections. |
| **`SameSite=Lax`** (or `Strict`)| Forbids browser from sending cookie on cross-site requests, mitigating Cross-Site Request Forgery (CSRF). |
| **`Path=/`** | Confines cookie to the root path. |
| **`Max-Age` / `Expires`** | Implements deterministic expiration (e.g. 7 days). |

