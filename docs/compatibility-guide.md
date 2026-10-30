# Compatibility Guide

The **Ultimate AI Development Skills** library is built upon the open **Agent Skills** standard to ensure maximum portability across diverse AI coding environments. 

However, AI agents differ in how they discover, parse, and apply contextual instructions. This guide details the compatibility status, supported features, and recommended configuration patterns for each environment.

---

## 1. Feature Compatibility Matrix

| Environment / Agent | Standard Discovery (`.agents/skills/`) | YAML Frontmatter Parsing | Relative Reference Traversal | Dynamic Script Execution | Interactive Sidecars / UI Plugins |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Google Antigravity** | ✅ Native | ✅ Native | ✅ Native | ✅ Supported | ✅ Supported |
| **Claude Code** | 🔄 Configurable | 🔄 Partial | ✅ Native | ✅ Supported | ⚠️ Not Applicable |
| **Cursor** | 🔄 Via `.cursor/rules` | 🔄 Via `.mdc` | ✅ Native | ⚠️ Manual via Terminal | ⚠️ Not Applicable |
| **Windsurf (Cascade)**| 🔄 Via `.windsurfrules` | 🔄 Partial | ✅ Native | ⚠️ Manual via Terminal | ⚠️ Not Applicable |
| **Roo Code / Cline** | 🔄 Via `.clinerules` | 🔄 Partial | ✅ Native | ✅ Supported | ⚠️ Not Applicable |
| **Aider / OpenDevin** | 🔄 Context file flag | ❌ Ignored | ✅ Native | ✅ Supported | ⚠️ Not Applicable |

**Legend:**
- ✅ **Native:** Automatically supported out of the box with zero additional configuration.
- 🔄 **Configurable / Partial:** Supported when referenced in the agent's root instruction configuration.
- ⚠️ **Manual / Not Applicable:** The agent relies on standard shell execution or does not have specialized UI extension panels.
- ❌ **Ignored:** Frontmatter is ignored or passed as raw text.

---

## 2. Portable Design Decisions

To ensure skills operate seamlessly across environments with varying capabilities, this repository follows strict design principles:

### 2.1 Progressive Enhancement
- **Core Workflow:** The primary `SKILL.md` operates strictly using standard markdown instructions, terminal commands, and source code edits that any agent capable of file reading and editing can execute.
- **Enhanced Capabilities:** Where advanced tools (such as MCP servers, browser automation, or interactive viewers) provide superior capabilities, they are documented as **optional enhancements** with clear fallback instructions (e.g. using standard CLI tools).

### 2.2 Relative File Linking
All inter-file references within a skill use standard POSIX relative paths:
```markdown
See [Security Checklist](references/owasp-checklist.md) for detailed verification criteria.
```
Agents that support file reading tools can follow these links deterministically without requiring platform-specific path resolution.

### 2.3 Deterministic Scripts
When a skill includes helper scripts in `scripts/`:
- Scripts are written in widely available, cross-platform languages (Python 3.10+ or standard POSIX / Bash / PowerShell).
- Scripts must not assume fixed absolute directories.
- Core skills remain actionable even if an environment restricts automated script execution; the agent can perform the equivalent manual inspection steps.

---

## 3. Graceful Fallbacks

If an agent does not automatically index the YAML frontmatter:
1. Provide the direct path to `SKILL.md` in your prompt:
   > *"Follow the workflow in `.agents/skills/testing-and-debugging/SKILL.md` to debug this failing test."*
2. Or link the skill from your repository's primary AI instruction file (`CLAUDE.md`, `.cursorrules`, or `.windsurfrules`).
