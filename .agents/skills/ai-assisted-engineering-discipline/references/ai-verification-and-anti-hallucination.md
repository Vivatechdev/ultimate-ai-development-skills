# AI Verification, Anti-Hallucination & Quality Control

AI coding assistants generate code with high linguistic confidence regardless of whether the technical claims, packages, or API signatures actually exist. Senior software engineering requires rigorous, skeptical verification gates before accepting any generated output.

---

## 1. The 5 Mandatory AI Verification Gates

```
[ Gate 1: Skepticism & Self-Correction ]
  Never assume AI code is correct without execution or review
                     │
                     ▼
[ Gate 2: Dependency & Supply Chain Verification ]
  Verify package existence, download counts, and real maintenance on registry
                     │
                     ▼
[ Gate 3: Official API Signature & Flag Check ]
  Verify library methods and CLI arguments against current official documentation
                     │
                     ▼
[ Gate 4: Complete Requirement Alignment ]
  Verify all explicit user constraints against the output (zero dropped requirements)
                     │
                     ▼
[ Gate 5: Non-Destructive Diff Audit ]
  Confirm no working tests, business logic, or comments were silently deleted
```

---

## 2. Preventing Hallucinated Dependencies & APIs

### 2.1 The Hallucinated Dependency Trap
- **The Threat:** LLMs frequently invent plausible-sounding packages (e.g. `express-rate-limit-redis-cluster-v2`) or reference typosquatted supply-chain malicious packages.
- **The Protocol:**
  - Before installing any third-party library, check npm/PyPI/crates.io.
  - Ask: *Can this be accomplished cleanly using standard library or existing project dependencies?*
  - Prefer established, widely maintained libraries over obscure wrappers.

### 2.2 The Invented Method / Parameter Trap
- **The Threat:** LLMs synthesize flags or methods that don't exist in the current version of a library (e.g., using deprecated v1 SDK syntax in a v3 library, or inventing `--force-clean` on a CLI).
- **The Protocol:**
  - Always consult current official documentation.
  - When writing client SDK calls (Stripe, AWS, Cloudflare, Prisma), verify exact identifier names against official docs or TypeScript type definitions.

---

## 3. Explaining Bugs by Root Cause, Not Just Symptoms

When fixing a bug in AI-assisted development, never merely apply a superficial band-aid (e.g. adding `try/catch` around everything or slapping on `any`).

Always document the **Root Cause Analysis (RCA)**:
1. **The Symptom:** What failed (e.g. `TypeError: Cannot read properties of undefined`).
2. **The Mechanism:** Why it failed (e.g. "An asynchronous event loop tick executed before the database connection pool finished its TLS handshake").
3. **The Root Fix:** Fixing the underlying invariant (e.g. "Awaiting the initialization promise before binding the HTTP router").
4. **The Prevention:** How to prevent regressions (e.g. "Added a pre-flight unit test verifying uninitialized access throws a descriptive domain error").
