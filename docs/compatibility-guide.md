# Compatibility Guide

The **Ultimate AI Development Skills** library is built upon the open **Agent Skills** standard to ensure maximum portability across diverse AI coding environments. 

However, AI coding agents differ in how they discover, parse, and apply contextual instructions. This guide documents verified compatibility, configuration patterns, and graceful fallbacks across major AI agents.

---

## 1. Feature Compatibility Matrix

All skills in this repository are engineered to be vendor-neutral. The table below outlines empirical testing and support levels:

| Environment / Agent | Standard Discovery (`.agents/skills/`) | YAML Frontmatter Parsing | Relative Reference Traversal | Dynamic Script Execution | Interactive Sidecars / UI Plugins | Verified Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Google Antigravity** | ✅ Native | ✅ Native | ✅ Native | ✅ Supported | ✅ Supported | **Tested & Verified** |
| **Claude Code** | 🔄 Configurable | 🔄 Partial | ✅ Native | ✅ Supported | ⚠️ Not Applicable | **Tested & Verified** |
| **Cursor** | 🔄 Via `.cursor/rules` | 🔄 Via `.mdc` | ✅ Native | ⚠️ Manual via Terminal | ⚠️ Not Applicable | **Verified via Rules** |
| **Windsurf (Cascade)**| 🔄 Via `.windsurfrules` | 🔄 Partial | ✅ Native | ⚠️ Manual via Terminal | ⚠️ Not Applicable | **Verified via Rules** |
| **Roo Code / Cline** | 🔄 Via `.clinerules` | 🔄 Partial | ✅ Native | ✅ Supported | ⚠️ Not Applicable | **Verified via Rules** |
| **GitHub Copilot** | 🔄 Via `#file` | ❌ Ignored | ✅ Native | ⚠️ Manual via Terminal | ⚠️ Not Applicable | **Verified via Context** |
| **Aider / OpenDevin** | 🔄 Context file flag | ❌ Ignored | ✅ Native | ✅ Supported | ⚠️ Not Applicable | **Compatible** |

### Legend:
- ✅ **Native:** Automatically discovered out of the box without manual configuration.
- 🔄 **Configurable / Partial:** Supported when referenced in the agent's workspace configuration (e.g. `CLAUDE.md`, `.cursorrules`, `.windsurfrules`).
- ⚠️ **Manual / Not Applicable:** The agent relies on standard shell execution or does not have specialized UI extension panes.
- ❌ **Ignored:** Frontmatter is passed as raw markdown text rather than parsed metadata.

> [!IMPORTANT]
> **No Universal Compatibility Assumption:** We do not claim universal out-of-the-box compatibility without explicit testing. If an agent does not support automatic frontmatter parsing, use the documented fallback patterns below.

---

## 2. Portable Design Decisions

To ensure skills operate consistently across environments with varying capabilities, this repository follows strict portability standards:

### 2.1 Progressive Enhancement
- **Core Workflow:** The primary `SKILL.md` operates strictly using standard markdown instructions, terminal commands, and source code edits that any agent capable of file reading and editing can execute.
- **Enhanced Capabilities:** Where advanced tools (such as MCP servers, Chrome DevTools, or interactive sidecar viewers) provide superior visualization, they are documented as **optional enhancements** with clear fallback instructions (e.g. using standard CLI tools).

### 2.2 Relative POSIX File Linking
All inter-file references within a skill use standard POSIX relative paths:
```markdown
See [Security Remediation Guide](references/vulnerability-remediation-guide.md) for implementation recipes.
```
Agents that support file reading tools can follow these links deterministically without platform-specific path resolution.

### 2.3 Deterministic Scripts
When a skill includes helper scripts (e.g. `scripts/overflow-and-qa-detector.js` or `test-runner.js`):
- Scripts are written using the Node.js standard library (Node.js 18+) with zero external dependencies.
- Scripts execute cross-platform across Windows (PowerShell/CMD), macOS (zsh), and Linux (bash).
- Scripts avoid machine-specific assumptions or hardcoded absolute directories.
- Core skills remain fully actionable even if an environment restricts automated script execution; the agent can perform the equivalent manual inspection steps.

---

## 3. Fallback Strategies for Unsupported Agents

If your AI coding agent does not automatically index YAML frontmatter:

1. **Explicit Prompting:**
   Point the agent directly to the target `SKILL.md` file:
   > *"Follow the workflow and standards in `.agents/skills/senior-fullstack-engineer/SKILL.md` to design this API service."*

2. **Root Workspace Rules:**
   Link or summarize the skills in your repository's primary AI instruction file:
   - For Claude Code: `CLAUDE.md`
   - For Cursor: `.cursorrules` or `.cursor/rules/`
   - For Windsurf: `.windsurfrules`
   - For Cline: `.clinerules`

---

## 4. Minimum Runtime Requirements

- **Node.js:** v18.0.0 or higher (for running validation scripts and practical testbeds).
- **Git:** v2.30.0 or higher (for version control and submodule support).
- **Operating Systems:** Windows 10/11, macOS Monterey (12)+, Linux (Ubuntu 20.04+, Debian 11+, Fedora 36+).
