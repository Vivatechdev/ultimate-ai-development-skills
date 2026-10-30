# Contributing to Ultimate AI Development Skills

Thank you for your interest in contributing to the **Ultimate AI Development Skills** library! We are committed to building an open, high-quality, vendor-neutral collection of AI engineering skills.

To maintain professional standards, all contributions must adhere to the guidelines outlined below.

---

## Code of Conduct

We are dedicated to providing a welcoming, inclusive, and professional environment for everyone. Please treat all contributors with respect and professionalism.

---

## Guiding Principles

1. **Practical & Rigorous:** Skills must provide actionable, prescriptive guidance rather than broad, generic platitudes.
2. **Open Agent Skills Standard:** Every skill must conform strictly to the Agent Skills specification (`SKILL.md` with valid YAML frontmatter).
3. **Vendor Neutrality:** Core skills must not rely on agent-specific or proprietary toolchains unless clearly isolated in an optional, documented extension block.
4. **Tested in Practice:** Every proposed skill must have undergone validation on real-world codebases before submission.

---

## How to Contribute

### 1. Proposing a New Skill or Improvement
- Open an issue titled `[Proposal] Skill Name` or `[Enhancement] Target Skill`.
- Outline the skill's purpose, scope, intended triggers, and real-world value.
- Await discussion and alignment before writing extensive instructions.

### 2. Developing a Skill
Follow the [Skill Development Guide](docs/skill-development-guide.md):
- Directory structure: `.agents/skills/<skill-name>/`
- Root entry point: `SKILL.md`
- Lowercase, hyphen-delimited directory names (e.g. `senior-fullstack-engineer`).
- Valid YAML frontmatter:
  ```yaml
  ---
  name: skill-name
  description: Clear, specific summary of what the skill does and when to activate it.
  ---
  ```
- Modular supporting files: Place large reference guides, code snippets, or templates into subdirectories:
  - `references/`: Extended technical guidelines, checklists, and specifications.
  - `examples/`: Reference implementations and before/after comparisons.
  - `scripts/`: Helper scripts (if applicable, without machine-specific assumptions).

### 3. Verification Checklist
Before submitting a Pull Request, verify that:
- [ ] Directory and file names use only lowercase letters, numbers, and hyphens.
- [ ] `SKILL.md` contains valid YAML frontmatter matching the directory name.
- [ ] The description clearly describes *what* the skill accomplishes and *when* it triggers.
- [ ] No hardcoded machine paths, personal data, or API keys are present.
- [ ] No fabricated tools, imaginary APIs, or unverified libraries are referenced.
- [ ] Mandatory requirements are distinguished from optional recommendations.
- [ ] The skill has been tested against an actual coding task.

---

## Pull Request Workflow

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/new-skill-name
   ```
2. Commit your changes with clear, semantic commit messages:
   ```bash
   git commit -m "feat(skills): add senior-fullstack-engineer skill"
   ```
3. Push to your fork and submit a Pull Request describing your changes, motivation, and practical test results.

---

## Semantic Versioning & Releases

This project follows [Semantic Versioning](https://semver.org/):
- **Major (X.0.0):** Significant structural revisions, breaking changes in skill specifications, or major reorganizations.
- **Minor (0.X.0):** New skills added, substantial enhancements to existing workflows.
- **Patch (0.0.X):** Clarifications, typo corrections, minor bug fixes, or documentation updates.
