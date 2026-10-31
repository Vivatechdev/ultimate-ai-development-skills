# Contributing to Ultimate AI Development Skills

Thank you for your interest in contributing to the **Ultimate AI Development Skills** library! We are committed to building an open, high-quality, vendor-neutral collection of production engineering skills for AI coding agents.

To maintain professional standards, all contributions must adhere to the guidelines outlined below.

---

## 1. Code of Conduct

We are dedicated to providing a welcoming, inclusive, and professional environment for everyone. Please treat all contributors with respect, constructiveness, and empathy. Harassment or unprofessional conduct will not be tolerated.

---

## 2. Guiding Principles

1. **Practical & Rigorous:** Skills must provide actionable, prescriptive guidance rather than broad, generic platitudes. Every rule must influence actual code generation.
2. **Open Agent Skills Standard:** Every skill must conform strictly to the Agent Skills specification (`SKILL.md` with valid YAML frontmatter and the 10 mandatory sections).
3. **Vendor Neutrality:** Core skills must not rely on proprietary, closed toolchains. Platform-specific features (e.g. MCP tools or interactive sidecars) must be documented as optional enhancements with CLI fallbacks.
4. **Empirically Verified:** No skill or rule may be submitted without an accompanying testbed or verification script proving its correctness on real-world code.
5. **Zero Hallucinated Tools or Dependencies:** Never reference fabricated APIs, non-existent packages, or imaginary CLI commands.
6. **Long-Term Governance & Maintenance:** All changes must comply with the 10 core invariants in the [Maintenance Guide](docs/maintenance-guide.md) (de-duplication, official doc alignment, and backwards compatibility).

---

## 3. Reporting Issues

### Bug Reports
If you encounter an issue, broken workflow, outdated standard, or flakiness in a testbed:
1. Search existing issues to prevent duplicate reports.
2. Open a new issue using the **Bug Report** template.
3. Provide:
   - Target skill name.
   - AI agent environment and version (e.g., Antigravity IDE 2.0, Claude Code, Cursor 0.42).
   - Expected vs. actual behavior.
   - Minimal reproduction prompt or error log.

### Skill Proposals
Before investing hours writing a large new skill, open a **Skill Proposal** issue:
1. Outline the proposed skill name (`lowercase-hyphenated`).
2. Define the specialization and target engineering domain.
3. Detail the specific problem it solves that existing skills do not cover.
4. List key references, anti-patterns, and the proposed practical testbed.

### Security Vulnerabilities
If you discover a security vulnerability in any skill or testbed script, please **do not** open a public GitHub issue. Email the maintainers privately or use GitHub's private vulnerability reporting feature.

---

## 4. Developing a New Skill

Follow the [Skill Development Guide](docs/skill-development-guide.md):

### Directory Layout
```text
.agents/skills/<skill-name>/
├── SKILL.md                 # Primary instruction entrypoint (10 mandatory sections)
├── references/              # Detailed specifications, checklists, matrices
│   └── *.md
└── examples/                # Practical testbed, working code, test runners
    └── ...
```

### Frontmatter Schema
Every `SKILL.md` must start with:
```yaml
---
name: skill-name
description: Clear, specific summary of what the skill does and exact activation triggers.
---
```

### The 10 Mandatory Sections
Each `SKILL.md` must contain:
1. `## 1. Purpose and Scope`
2. `## 2. When to Activate the Skill` (or `Activation Criteria`)
3. `## 3. Required Inputs & Initial Assessment`
4. `## 4. Step-by-Step Workflow`
5. `## 5. Technical Implementation Guidelines` (or `Professional Standards`)
6. `## 6. Decision-Making Guidelines` (or `Trade-offs`)
7. `## 7. Common Mistakes & Anti-Patterns to Avoid`
8. `## 8. Practical Implementation Examples`
9. `## 9. Quality Assurance Checklist` (or `Testing`)
10. `## 10. Completion Criteria` (or `Checklist`)

---

## 5. Local Validation Before Submitting PR

Before committing or opening a Pull Request, run the master quality audit suite locally:

```bash
# Run structural, YAML frontmatter, link integrity, and testbed validation
node scripts/validate-library.js
```

All 10 skills must pass Phase 1 (structural audit) and Phase 2 (practical testing) with zero errors.

---

## 6. Pull Request Workflow

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/ultimate-ai-development-skills.git
   cd ultimate-ai-development-skills
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feat/add-new-skill
   ```
4. Implement your skill, references, and practical testbed.
5. Run the validation suite:
   ```bash
   node scripts/validate-library.js
   ```
6. Commit your changes using conventional commit messages:
   ```bash
   git commit -m "feat(skills): add performance-optimization skill"
   ```
7. Push to your fork and submit a Pull Request against `main`. Fill out the Pull Request template completely.

---

## 7. Versioning Policy

This repository adheres to [Semantic Versioning (SemVer)](https://semver.org/):
- **Major (X.0.0):** Breaking reorganizations, changes to directory standards, or deprecations.
- **Minor (0.X.0):** New skills added, major additions to existing skills.
- **Patch (0.0.X):** Bug fixes, testbed repairs, typo corrections, documentation updates.
