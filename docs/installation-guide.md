# Installation & Setup Guide

This guide explains how to install and activate skills from the **Ultimate AI Development Skills** library across various AI coding agents and development environments.

---

## 1. Directory Model: Workspace vs. Global

Agent skills can be installed in one of two scopes:
1. **Workspace Scope (Recommended):** Installed inside a specific project repository under `.agents/skills/`. The skills become available to any developer or agent operating within that repository and can be committed to version control.
2. **Global Scope:** Installed in the user's home or configuration directory, making skills available across all projects on the workstation.

---

## 2. Agent-Specific Instructions

### Google Antigravity

Google Antigravity natively discovers skills located in `.agents/skills/` within your workspace, as well as global skills configured in your Antigravity environment.

#### Workspace Installation:
Copy the desired skill directory into `.agents/skills/` in your repository root:
```bash
# From your project root:
mkdir -p .agents/skills
cp -r path/to/Antigravity-Skills/.agents/skills/<skill-name> .agents/skills/
```

#### Global Installation:
Place the skill into your Antigravity user configuration directory:
- **Windows:** `%USERPROFILE%\.gemini\antigravity\skills\<skill-name>`
- **macOS / Linux:** `~/.gemini/antigravity/skills/<skill-name>`

Antigravity will automatically index the `SKILL.md` frontmatter and activate the skill when matching tasks are prompted.

---

### Claude Code

Claude Code supports project-level instructions and tool definitions.

#### Workspace Installation:
Place skills into `.claude/skills/` or `.agents/skills/` if using the open agent runner:
```bash
mkdir -p .claude/skills
cp -r path/to/Antigravity-Skills/.agents/skills/<skill-name> .claude/skills/
```
Alternatively, you can reference the skill in `CLAUDE.md`:
```markdown
# Instructions
When working on architectural refactoring, refer to the guidelines in:
`.agents/skills/senior-fullstack-engineer/SKILL.md`
```

---

### Cursor

Cursor reads contextual instructions from `.cursorrules` or `.cursor/rules/`.

#### Workspace Installation:
1. Copy the skill into `.cursor/skills/<skill-name>` or `.agents/skills/<skill-name>`.
2. To ensure automatic rule attachment in Cursor:
   Create `.cursor/rules/<skill-name>.mdc` with frontmatter:
   ```yaml
   ---
   description: Imports the <skill-name> Agent Skill
   globs: *
   ---
   ```
   And reference or include the instructions from `.agents/skills/<skill-name>/SKILL.md`.

---

### Windsurf

Windsurf (Cascade) uses `.windsurfrules` or project workspace rule files.

#### Workspace Installation:
1. Keep the skills in `.agents/skills/<skill-name>/`.
2. Add an import or link in your `.windsurfrules`:
   ```markdown
   Refer to `.agents/skills/<skill-name>/SKILL.md` when performing tasks related to [domain].
   ```

---

### Roo Code / Cline

Roo Code / Cline supports custom system instructions and room/role modes.

#### Workspace Installation:
Copy skills into `.clinerules/` or `.agents/skills/`:
```bash
mkdir -p .clinerules
cp path/to/Antigravity-Skills/.agents/skills/<skill-name>/SKILL.md .clinerules/<skill-name>.md
```

---

## 3. Verifying Skill Activation

To verify that your AI agent has loaded a skill:
1. Open a session in your target project.
2. Provide a prompt aligned with the skill's triggers (e.g., for `application-security`, prompt: *"Perform a security audit of our authentication endpoints"*).
3. The agent should reference the skill's specific workflow, phases, and quality checklists in its reasoning and plan.
