# Usage Guide

This guide details how to effectively activate, combine, and adapt skills from the **Ultimate AI Development Skills** library during day-to-day software engineering workflows.

---

## 1. How AI Agents Consume Skills

Under the open **Agent Skills** specification, an AI skill is a structured directory containing:
1. **`SKILL.md`**: The primary entry point containing YAML frontmatter (`name`, `description`) and 10 standardized sections providing architectural rules, decision trees, checklists, and anti-patterns.
2. **`references/`**: Deep-dive technical specifications, checklists, security matrices, and API patterns.
3. **`examples/`**: Minimal working reference code, before/after comparisons, and testbeds.
4. **`scripts/`**: Deterministic automation utilities (e.g. layout audit tools, test runners).

When an AI coding agent indexes this repository or your project's `.agents/skills/` directory, it reads the skill's frontmatter to understand **what** the skill accomplishes and **when** it should activate. When a prompt matches a skill's activation triggers, the agent consults the instructions in `SKILL.md` to guide its code generation and verification.

---

## 2. Using Skills in Google Antigravity

Google Antigravity natively discovers skills located in:
- **Workspace scope:** `<project-root>/.agents/skills/<skill-name>/`
- **Global scope:** `~/.gemini/config/skills/<skill-name>/` (available across all projects on your machine)

### A. Implicit (Natural Language) Activation
Antigravity automatically matches your natural language prompt against the skill's description and triggers:

```text
"Review this payment checkout route. We are integrating Paystack and Stripe, and I want to make sure our webhook verification is secure against timing attacks and replay."
```
*Antigravity automatically activates `api-and-payment-integration` and `application-security`.*

### B. Explicit Skill Invocation
To guarantee that Antigravity prioritizes a specific skill's workflow, reference the skill name directly in your prompt:

```text
"Using the senior-fullstack-engineer skill, architect a Controller-Service-Repository structure for our new team invite feature with zero-downtime database migrations."
```

### C. Triggering Verification Testbeds
Every skill includes practical verification testbeds. You can prompt Antigravity to run them directly:

```text
"Run the visual-qa-and-ui-audit testbed to check for horizontal overflows and tap targets below 44px."
```

---

## 3. Adapting Skills for Other Compatible AI Agents

The skills in this library are strictly vendor-neutral. Here is how to use them across other popular AI coding environments:

### Claude Code
Claude Code reads instructions from `CLAUDE.md` or `.claude/skills/`.
- **Method 1 (Reference in `CLAUDE.md`):**
  Add a section in your project's `CLAUDE.md`:
  ```markdown
  ## Specialized Engineering Guidelines
  - When designing user interfaces: refer to `.agents/skills/ui-ux-design-mastery/SKILL.md`
  - When auditing security or auth: refer to `.agents/skills/application-security/SKILL.md`
  - When writing tests or debugging: refer to `.agents/skills/testing-and-debugging/SKILL.md`
  ```
- **Method 2 (Direct Prompt):**
  ```bash
  claude "Follow the workflow in .agents/skills/devops-deployment/SKILL.md to write a hardened multi-stage Dockerfile for this Node service."
  ```

### Cursor
Cursor attaches rules via `.cursor/rules/*.mdc` or `.cursorrules`.
- Copy or link the desired skill into `.cursor/rules/<skill-name>.mdc`.
- Set frontmatter:
  ```yaml
  ---
  description: Senior Full-Stack Engineering standards and 3-tier architecture
  globs: ["src/**/*.ts", "api/**/*.ts"]
  ---
  ```
- Include or link the instructions from `.agents/skills/senior-fullstack-engineer/SKILL.md`.

### Windsurf (Cascade)
Windsurf references instructions defined in `.windsurfrules`.
- Add an explicit guideline in your `.windsurfrules`:
  ```markdown
  Always follow the testing pyramid and root-cause debugging methodology outlined in `.agents/skills/testing-and-debugging/SKILL.md`.
  ```

### Roo Code / Cline
Roo Code supports custom instruction modes.
- Copy `SKILL.md` to `.clinerules/<skill-name>.md` or include its path in your mode configuration.

### GitHub Copilot Workspace & Chat
In Copilot Chat, reference the skill file using the `#file` directive:
```text
"#file:.agents/skills/saas-product-architect/SKILL.md Design a multi-tenant PostgreSQL schema with Row-Level Security for our tenant workspace feature."
```

---

## 4. Multi-Skill Composition Workflows

Real-world software engineering rarely involves a single domain. Combine complementary skills to execute end-to-end production pipelines:

### Pipeline 1: Greenfield SaaS Feature Development
```
[1. saas-product-architect]
    Scope MVP, author PRD, map user journeys, design tenant model.
         │
         ▼
[2. senior-fullstack-engineer]
    Implement 3-tier architecture (Controller-Service-Repo), DB migration.
         │
         ▼
[3. ui-ux-design-mastery]
    Design accessible UI, typography scale, micro-interactions.
         │
         ▼
[4. application-security]
    Audit for IDOR, CSRF, server-side RBAC, and input sanitization.
         │
         ▼
[5. testing-and-debugging]
    Author unit & integration tests; eliminate flakiness & race conditions.
         │
         ▼
[6. devops-deployment]
    Package with hardened Dockerfile; execute post-deploy smoke test.
```

### Pipeline 2: Frontend Modernization & Visual QA
1. **`ui-ux-design-mastery`**: Redesign layout, apply deliberate font scales, eliminate AI clichés.
2. **`design-system-architect`**: Extract CSS tokens (colors, spacing, typography) into a 3-tier DTCG token hierarchy.
3. **`visual-qa-and-ui-audit`**: Run automated script to detect overflows, tap-target issues (< 44px), and contrast defects across 5 viewports (375px to 1440px).

### Pipeline 3: Payment Gateway Integration
1. **`api-and-payment-integration`**: Implement webhook handler with raw buffer preservation and constant-time HMAC validation.
2. **`application-security`**: Enforce server-side transaction verification and defense against parameter tampering.
3. **`testing-and-debugging`**: Run concurrent request simulation to verify idempotent charge handling.

---

## 5. Customizing Skills for Team Conventions

You can customize any skill for your organization's specific tech stack:

1. **Add Custom Reference Files:**
   Drop internal standards into a skill's `references/` directory (e.g. `references/internal-auth0-sso.md`).
2. **Extend `SKILL.md` Sections:**
   Add team-specific rules under **Section 5 (Technical Implementation Guidelines)** or **Section 7 (Common Mistakes)**.
3. **Preserve Version Control:**
   Keep your customized `.agents/skills/` committed in your project repository so your entire team and all agents share identical standards.

---

## 6. Verifying Skill Activation

To verify that your agent is adhering to a skill:
- **Check Diagnostic Reasoning:** Ensure the agent outlines its initial assessment (Section 3) before writing code.
- **Inspect Code Structure:** Verify that fullstack code follows the Controller-Service-Repository pattern rather than dumping database queries into route handlers.
- **Run the Master Validator:**
  ```bash
  node scripts/validate-library.js
  ```

