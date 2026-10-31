# Installation & Setup Guide

This guide details how to install, configure, and activate individual skills or the complete **Ultimate AI Development Skills** library across various AI coding agents and development environments.

---

## 1. Installation Scopes: Workspace vs. Global

Agent skills can be installed in one of two scopes:

| Scope | Location | Visibility | Best For |
| :--- | :--- | :--- | :--- |
| **Workspace Scope** *(Recommended)* | `<project-root>/.agents/skills/<skill-name>/` | Single repository | Committing to Git; team-wide shared engineering standards; CI/CD validation |
| **Global Scope** | `~/.gemini/config/skills/<skill-name>/` | All projects on your machine | Personal developer workstation; cross-project reuse without duplicating files |

---

## 2. Installing Individual Skills

You do not need to install the entire library at once. Each skill is self-contained and independently functional.

### Option A: Install an Individual Skill into a Project Workspace
To install a single skill (e.g., `application-security`) into an existing project:

```bash
# 1. Navigate to your project root
cd /path/to/your/project

# 2. Create the standard Agent Skills directory
mkdir -p .agents/skills

# 3. Copy the specific skill folder
cp -r /path/to/ultimate-ai-development-skills/.agents/skills/application-security .agents/skills/
```

### Option B: Install the Complete Library into a Project Workspace
```bash
# From your project root:
mkdir -p .agents/skills
cp -r /path/to/ultimate-ai-development-skills/.agents/skills/* .agents/skills/
```

---

## 3. Environment-Specific Instructions

### Google Antigravity

Google Antigravity natively discovers skills located in `.agents/skills/` within your workspace as well as global skills configured in your user profile.

#### A. Workspace Installation
Place skills in `<project-root>/.agents/skills/<skill-name>/`. Antigravity immediately indexes the `SKILL.md` frontmatter.

#### B. Global Installation (Standalone IDE)
Place skills into the documented global configuration directory:
- **Windows:** `%USERPROFILE%\.gemini\config\skills\<skill-name>\` (e.g. `C:\Users\<username>\.gemini\config\skills\<skill-name>\`)
- **macOS / Linux:** `~/.gemini/config/skills/<skill-name>/`

To install all validated skills globally on your machine:
```bash
# Copy all skills into the global Antigravity discovery path
mkdir -p ~/.gemini/config/skills
cp -r .agents/skills/* ~/.gemini/config/skills/
```

To verify your global installation:
```bash
node scripts/verify-global-installation.js
```

---

### Claude Code

Claude Code supports project-level instructions via `CLAUDE.md` or dedicated skill directories.

#### Workspace Installation:
Place skills into `.claude/skills/` or maintain them under `.agents/skills/`:
```bash
mkdir -p .claude/skills
cp -r .agents/skills/<skill-name> .claude/skills/
```

Or reference the skill directly in your `CLAUDE.md`:
```markdown
# Architectural Guidelines
When working on backend architecture, refer to `.agents/skills/senior-fullstack-engineer/SKILL.md`.
When reviewing security and authentication, refer to `.agents/skills/application-security/SKILL.md`.
```

---

### Cursor

Cursor reads contextual instructions from `.cursor/rules/` (`.mdc` format) or `.cursorrules`.

#### Workspace Installation:
1. Copy the skill into `.cursor/skills/<skill-name>` or `.agents/skills/<skill-name>`.
2. Create `.cursor/rules/<skill-name>.mdc` with frontmatter:
   ```yaml
   ---
   description: Imports the <skill-name> Agent Skill
   globs: *
   ---
   ```
   And include or reference the instructions from `.agents/skills/<skill-name>/SKILL.md`.

---

### Windsurf (Cascade)

Windsurf references instructions defined in `.windsurfrules`.

#### Workspace Installation:
1. Keep the skills in `.agents/skills/<skill-name>/`.
2. Add reference rules to `.windsurfrules`:
   ```markdown
   Refer to `.agents/skills/<skill-name>/SKILL.md` when performing tasks related to [domain].
   ```

---

### Roo Code / Cline

Roo Code and Cline support custom system instructions and room/role configurations.

#### Workspace Installation:
Copy skills into `.clinerules/`:
```bash
mkdir -p .clinerules
cp .agents/skills/<skill-name>/SKILL.md .clinerules/<skill-name>.md
```

---

### GitHub Copilot

Reference the skill directly in Copilot Chat:
```text
#file:.agents/skills/<skill-name>/SKILL.md Please apply these engineering standards to refactor the current file.
```

---

## 4. Validating Your Installation

Run the automated quality audit suite to verify that your installed skills are structurally sound and have passing practical testbeds:

```bash
# Validate workspace skills
node scripts/validate-library.js

# Verify global installation
node scripts/verify-global-installation.js
```

---

## 5. Updating Skills

To update your installed skills to the latest version:
1. Pull the latest release from the repository:
   ```bash
   git pull origin main
   ```
2. Re-copy the updated skill directory to your workspace or global folder.
3. Check for breaking changes in [CHANGELOG.md](../CHANGELOG.md).
