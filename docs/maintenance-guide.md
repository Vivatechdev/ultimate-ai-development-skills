# Long-Term Skill Library Maintenance Guide

This document defines the governance model, quality invariants, and maintenance procedures for the **Ultimate AI Development Skills Library**. As an evolving open-source project, all maintainers, contributors, and AI assistants must strictly uphold these protocols.

---

## 1. The 10 Maintenance Invariants

Whenever a new skill, enhancement, or refactoring is proposed:

1. **Inspect Existing Library:** Always perform a directory and capability scan across `.agents/skills/` before designing new assets.
2. **De-Duplication Check:** Verify whether an existing skill already covers the domain or can be cleanly extended before authoring a new skill.
3. **Avoid Redundant Duplication:** Prevent overlapping instructions across skills; maintain focused, modular domains.
4. **Preserve Project Structure:** Strictly enforce the standard layout:
   ```text
   .agents/skills/<skill-name>/
   ├── SKILL.md
   ├── README.md
   ├── references/*.md
   └── examples/...
   ```
5. **Open Agent Skills Standard:** Maintain YAML frontmatter (`name`, `description`) and the 10 mandatory numbered sections in every `SKILL.md`.
6. **Empirical Verification:** Every meaningful change must be accompanied by a runnable testbed or verification script. Never mark code as complete without passing execution.
7. **Synchronize Documentation:** Update `README.md`, `docs/usage-guide.md`, and the individual skill's `README.md` in tandem with any structural changes.
8. **Update Changelog:** Document every notable addition, modification, or bug fix in `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/).
9. **Maintain Semantic Versioning:** Increment SemVer identifiers (Major/Minor/Patch) accurately based on impact and backwards compatibility.
10. **Preserve Backwards Compatibility:** Ensure existing agent prompts, skill directory paths, and references remain functional across upstream consumer projects.

---

## 2. De-Duplication & Overlap Assessment Protocol

Before creating a new skill, classify the proposed capability against the existing catalog:

```
[New Capability Requested]
           │
           ▼
Does an existing skill cover this layer?
├── YES: UI / Visual Polish ────────────> Extend `ui-ux-design-mastery`
├── YES: Layout QA / Viewports ─────────> Extend `visual-qa-and-ui-audit`
├── YES: Design Tokens / Theming ───────> Extend `design-system-architect`
├── YES: Backend / APIs / Migrations ───> Extend `senior-fullstack-engineer`
├── YES: Security / OWASP / Auth ───────> Extend `application-security`
├── YES: Testing / RCA / Debugging ─────> Extend `testing-and-debugging`
├── YES: SaaS Strategy / PRD / Billing ─> Extend `saas-product-architect`
├── YES: Cloud / CI/CD / Docker ────────> Extend `devops-deployment`
├── YES: Third-Party APIs / Payments ───> Extend `api-and-payment-integration`
├── YES: AI Metacognition / ADRs ───────> Extend `ai-assisted-engineering-discipline`
└── NO: Distinct Engineering Domain ────> Author New Skill (e.g. `performance-optimization`, `mobile-engineering`)
```

---

## 3. Review Against Official Documentation

Technical practices evolve rapidly. To prevent outdated instructions or deprecated APIs:

- **Periodic Audit Cadence:** Maintainers should periodically review references and testbeds against current official vendor documentation:
  - Node.js APIs (e.g. WHATWG URL standards, native test runners).
  - Web Standards (W3C Design Tokens, WCAG 2.2 AA).
  - Cloud & Container Standards (Docker multi-stage patterns, OCI specifications).
  - Payment Gateways (Stripe API updates, Paystack API v2, Flutterwave v3).
  - Security Recommendations (OWASP Top 10 updates, NIST SP 800-63B).
- **Deprecation Warning:** Never abruptly delete functional instructions. Mark outdated patterns with deprecation notices and specify the modern alternative.

---

## 4. Preservation of Validated Skills

- **Do Not Modify Validated Skills Unnecessarily:** Once a skill passes all quality gates and its testbed is verified green, avoid frivolous rewrites or speculative edits.
- **Root Cause Fixes Only:** If an error or edge case is discovered in a validated skill:
  1. Construct a minimal reproduction test proving the defect.
  2. Implement the root invariant fix.
  3. Update the regression suite.
  4. Sync the global mirror (`~/.gemini/config/skills/`).

---

## 5. Pre-Commit Validation Gate

No pull request or commit should be merged without running:

```bash
# 1. Master quality audit (Structural, links, testbeds)
node scripts/validate-library.js

# 2. Global discovery verification
node scripts/verify-global-installation.js
```

All 10 skills must pass Phase 1 (Structural Audit) and Phase 2 (Practical Testing) with **zero errors**.
