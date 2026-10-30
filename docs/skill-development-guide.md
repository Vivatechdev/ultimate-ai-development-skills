# Skill Development Guide

This guide establishes the engineering standards, architecture, and authoring rules for all skills created in the **Ultimate AI Development Skills** library. Every skill must strictly adhere to these guidelines to ensure consistency, high quality, and vendor neutrality.

---

## 1. The Open Agent Skills Standard

A skill is a structured directory containing contextual knowledge, execution workflows, and evaluation criteria designed to be interpreted by an AI coding assistant.

### 1.1 Directory Structure
Each skill resides in its own isolated directory under `.agents/skills/<skill-name>/`:

```text
.agents/skills/<skill-name>/
├── SKILL.md                 # Primary entry point (mandatory)
├── references/              # Detailed specifications, checklists, cheatsheets (optional)
├── examples/                # Concrete code examples, pattern demonstrations (optional)
├── scripts/                 # Deterministic utility scripts / validators (optional)
└── assets/                  # Supporting diagrams or templates (optional)
```

### 1.2 The `SKILL.md` File
`SKILL.md` is the only mandatory file for a skill. It must start with valid YAML frontmatter and contain markdown-formatted instructional text.

#### Required YAML Frontmatter:
```yaml
---
name: skill-name
description: Explicit, concise summary of the skill's capabilities and precise trigger criteria.
---
```

#### Metadata Constraints:
- `name`: Must be lowercase, alphanumeric, hyphen-delimited, and match the parent directory name exactly (e.g. `senior-fullstack-engineer`).
- `description`: Must clearly describe **what** the skill does and **when** it should be activated. Agents use this field during tool and skill indexing.

---

## 2. Core Structure of a Skill

To ensure skills are comprehensive, battle-tested, and practical rather than superficial, each `SKILL.md` must implement the following ten sections:

### 1. Purpose and Scope
Define what domain problem the skill addresses and the exact boundaries of its responsibility. Explicitly state what falls outside the scope of this skill.

### 2. When to Activate the Skill
Provide concrete user intent cues, keywords, and architectural scenarios that trigger activation. Include negative conditions (when *not* to activate).

### 3. Required Inputs & Initial Assessment
List the baseline technical prerequisites needed before taking action:
- Project stack and framework versions
- Existing architecture or configuration files
- Environmental constraints or design assets

### 4. Step-by-Step Workflow
A sequential, deterministic process the AI agent must execute. Use numbered phases (e.g., *Phase 1: Discovery & Assessment*, *Phase 2: Architectural Plan*, *Phase 3: Implementation*, *Phase 4: Verification*).

### 5. Professional Standards & Best Practices
Established industry standards, conventions, security rules, and performance guidelines applicable to the domain (e.g. WCAG 2.2 for accessibility, OWASP Top 10 for security, Clean Architecture, 12-Factor App principles).

### 6. Decision-Making Guidelines
Decision trees, trade-off matrices, and criteria for choosing among competing patterns, libraries, or architectures (e.g., Server Components vs Client Components, SQL vs NoSQL, optimistic updates vs pessimistic locking).

### 7. Common Mistakes & Anti-Patterns to Avoid
Highlight frequent LLM pitfalls, legacy practices, and failure modes in the domain, explicitly forbidding them.

### 8. Practical Implementation Examples
Provide concrete code patterns, configuration templates, or diffs illustrating best-in-class implementation.

### 9. Quality Assurance Checklist
A rigorous verification checklist the agent must execute before declaring the task complete.

### 10. Completion Criteria
The exact exit condition that marks successful execution (e.g., all tests pass, lint clean, zero accessibility violations, documentation updated).

---

## 3. Modular Supporting Files

Do not bloat `SKILL.md` with hundreds of lines of reference tables or extensive code templates. Move large supporting content into dedicated subdirectories:

- `references/`: Detailed standards, API specs, schema definitions, or extensive checklists.
- `examples/`: End-to-end code examples, before-and-after refactorings.
- `scripts/`: Platform-agnostic shell or Python scripts for validation, linting, or auditing.

Link to these files from `SKILL.md` using relative markdown links (e.g. `[OWASP Checklist](references/owasp-checklist.md)`).

---

## 4. Portability & Vendor Neutrality

To guarantee compatibility across AI agents (Antigravity, Claude Code, Cursor, Windsurf, Roo Code):
1. **No Agent-Specific Tool Assumptions:** Do not assume proprietary tool names (e.g., specific subagent APIs or custom MCP tools) in the primary workflow. If utilizing special tooling, frame it as an optional capability or fallback to standard CLI commands (`git`, `npm test`, `pytest`).
2. **No Hardcoded Machine Paths:** Never use absolute paths like `C:\Users\...` or `/home/user/...`. Use relative project paths (`src/`, `config/`).
3. **No Private Secrets or Credentials:** Never embed API keys, internal endpoints, or proprietary corporate information.
4. **Distinguish Mandatory vs. Recommended:** Use precise language (RFC 2119 keywords: `MUST`, `MUST NOT`, `SHOULD`, `RECOMMENDED`, `MAY`).

---

## 5. Development & Testing Lifecycle

Every skill must be developed and verified using this 9-step lifecycle:
1. **Research Domain:** Survey contemporary best practices, official docs, and industry standards.
2. **Define Scope & Boundaries:** Prevent scope creep; keep skills focused.
3. **Author Instructions:** Draft the 10 core sections following this guide.
4. **Create Supporting References:** Extract large checklists or templates into `references/`.
5. **Validate Frontmatter & Schema:** Verify YAML syntax and naming consistency.
6. **Contradiction Review:** Check for ambiguous directives or redundant instructions.
7. **Empirical Task Testing:** Run the skill on an actual codebase task with an AI coding agent.
8. **Iterate & Refine:** Fix failure modes discovered during practical testing.
9. **Update Documentation:** Record additions and milestones in `CHANGELOG.md` and `README.md`.

