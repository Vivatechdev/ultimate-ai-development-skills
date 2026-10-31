# Ultimate AI Development Skills Library

[![Specification: Agent Skills](https://img.shields.io/badge/Spec-Agent%20Skills-blue.svg)](docs/skill-development-guide.md)
[![Status: 10/10 Verified](https://img.shields.io/badge/Status-10%2F10%20Skills%20Verified-brightgreen.svg)](#available-skills-directory)
[![Validation: Passing](https://img.shields.io/badge/Quality%20Audit-Passing-success.svg)](scripts/validate-library.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A curated, vendor-neutral library of production-grade engineering skills designed for AI coding agents.

Built on the open **Agent Skills** specification, this library equips AI coding assistants (**Google Antigravity**, **Claude Code**, **Cursor**, **Windsurf**, **Roo Code / Cline**, **GitHub Copilot**, and others) with the domain expertise, architectural discipline, and rigorous workflows of senior software engineers and systems architects.

---

## 📖 Table of Contents
- [What Is This Project?](#what-is-this-project)
- [Why It Exists & Problems It Solves](#why-it-exists--problems-it-solves)
- [Available Skills Directory](#available-skills-directory)
- [Installation Guide](#installation-guide)
  - [Installing Individual Skills](#installing-individual-skills)
  - [Installing the Complete Library](#installing-the-complete-library)
- [How to Use Skills in Google Antigravity](#how-to-use-skills-in-google-antigravity)
- [Adapting Skills for Other AI Agents](#adapting-skills-for-other-ai-agents)
- [Quality Assurance & Local Validation](#quality-assurance--local-validation)
- [Project Governance & Maintenance](#project-governance--maintenance)
- [How to Report Issues](#how-to-report-issues)
- [How to Contribute](#how-to-contribute)
- [Future Development Plans (Roadmap)](#future-development-plans-roadmap)
- [License](#license)

---

## 💡 What Is This Project?

The **Ultimate AI Development Skills Library** is an open-source collection of reusable, self-contained development skills. Each skill packages:
- **`SKILL.md`**: Prescriptive guidelines following a standardized 10-section structure (activation criteria, workflows, implementation standards, decision trees, anti-patterns, and checklists).
- **`references/`**: Comprehensive architectural specifications, security checklists, and API playbooks.
- **`examples/`**: Practical working codebases and deterministic test runners.
- **`scripts/`**: Cross-platform automation tools for visual audits and validation.

Each skill operates independently and requires **zero proprietary dependencies**.

---

## 🎯 Why It Exists & Problems It Solves

Modern LLMs possess broad programming knowledge but default to generic suggestions, shallow prototypes, or brittle code unless guided by strict contextual instructions.

| Problem with Vanilla AI Output | How This Library Solves It |
| :--- | :--- |
| **Generic "AI Slop" Aesthetics:** Overused purple gradients, centered card layouts, sub-44px tap targets, and poor visual hierarchy. | [`ui-ux-design-mastery`](.agents/skills/ui-ux-design-mastery/SKILL.md) and [`visual-qa-and-ui-audit`](.agents/skills/visual-qa-and-ui-audit/SKILL.md) enforce mathematical typography scales, optical spacing, and automated 5-viewport testing. |
| **Brittle Single-File Architectures:** Embedding database queries directly into route handlers with no separation of concerns. | [`senior-fullstack-engineer`](.agents/skills/senior-fullstack-engineer/SKILL.md) enforces a decoupled 3-tier architecture (Controller-Service-Repository) and zero-downtime DB migrations. |
| **Critical Security Blindspots:** Trusting client-side validation, raw SQL concatenation, insecure cookies, and missing webhook HMAC verification. | [`application-security`](.agents/skills/application-security/SKILL.md) and [`api-and-payment-integration`](.agents/skills/api-and-payment-integration/SKILL.md) enforce OWASP ASVS standards, constant-time HMAC validation, and server-side RBAC. |
| **Flaky Tests & Speculative Debugging:** Tests that rely on `sleep(500)` or unmocked wall clocks; trial-and-error symptom patching. | [`testing-and-debugging`](.agents/skills/testing-and-debugging/SKILL.md) enforces the testing pyramid, clock virtualization, and empirical Root Cause Analysis (RCA). |
| **Hallucinated Packages & Fragile Dependencies:** AI inventing imaginary npm packages or adding bloat for simple algorithms. | [`ai-assisted-engineering-discipline`](.agents/skills/ai-assisted-engineering-discipline/SKILL.md) establishes 5 verification gates and Lightweight Architectural Decision Records (ADRs). |
| **Expensive Overengineering:** Assuming simple startups need multi-region Kubernetes clusters or complex microservices. | [`saas-product-architect`](.agents/skills/saas-product-architect/SKILL.md) and [`devops-deployment`](.agents/skills/devops-deployment/SKILL.md) provide cost-appropriate hosting tiers and MoSCoW MVP scoping. |

---

## 📂 Available Skills Directory

The library currently features **10 fully verified, production-ready skills**:

| Skill Identifier | Focus Area | Status | Description |
| :--- | :--- | :---: | :--- |
| **[`ui-ux-design-mastery`](.agents/skills/ui-ux-design-mastery/SKILL.md)** | UI/UX & Interaction | ✅ Verified | Crafts distinctive, high-end interfaces with deliberate typography hierarchies, optical letter-spacing, and micro-interactions. Eliminates generic AI aesthetics. |
| **[`visual-qa-and-ui-audit`](.agents/skills/visual-qa-and-ui-audit/SKILL.md)** | Visual Quality Assurance | ✅ Verified | Automated and visual inspection of responsive layouts across 5 viewports (375px–1440px). Detects horizontal overflows, sub-44px tap targets, and WCAG contrast failures. |
| **[`design-system-architect`](.agents/skills/design-system-architect/SKILL.md)** | Design Systems | ✅ Verified | Structures 3-tier DTCG design tokens, accessible headless components, dark/light theming, and non-destructive legacy project integration. |
| **[`senior-fullstack-engineer`](.agents/skills/senior-fullstack-engineer/SKILL.md)** | Architecture & APIs | ✅ Verified | Idiomatic 3-tier architecture (Controller-Service-Repository), RESTful resource design, zero-downtime database migrations, and server-side RBAC. |
| **[`application-security`](.agents/skills/application-security/SKILL.md)** | DevSecOps & Security | ✅ Verified | Threat modeling (STRIDE), OWASP Top 10 / ASVS audits, parameterized SQL, constant-time HMAC comparison, and secure session cookies. |
| **[`testing-and-debugging`](.agents/skills/testing-and-debugging/SKILL.md)** | Testing & Diagnostics | ✅ Verified | Testing pyramid governance, Gerard Meszaros test double taxonomy, clock virtualization, flaky test elimination, and systematic RCA. |
| **[`saas-product-architect`](.agents/skills/saas-product-architect/SKILL.md)** | Product Strategy | ✅ Verified | Strategic PRD authoring, MoSCoW MVP scoping, multi-tenant PostgreSQL Row-Level Security (RLS), and recurring billing lifecycle management. |
| **[`devops-deployment`](.agents/skills/devops-deployment/SKILL.md)** | Cloud Infrastructure | ✅ Verified | Cost-appropriate infrastructure sizing (VPS vs PaaS vs K8s), hardened multi-stage Docker builds, zero-downtime CI/CD, and 8-point post-deploy smoke tests. |
| **[`api-and-payment-integration`](.agents/skills/api-and-payment-integration/SKILL.md)** | Integrations & Payments | ✅ Verified | Resilient third-party REST/GraphQL integration, Paystack, Flutterwave, Stripe, exponential backoff with jitter, idempotency keys, and webhook security. |
| **[`ai-assisted-engineering-discipline`](.agents/skills/ai-assisted-engineering-discipline/SKILL.md)** | AI Engineering Meta-Skill | ✅ Verified | 12 Core Principles of AI pair programming, anti-hallucination verification gates, Architectural Decision Records (ADRs), and cognitive load balancing. |

---

## 🚀 Installation Guide

Skills can be installed in **Workspace Scope** (project-level, committed to Git) or **Global Scope** (workstation-level, available across all projects).

### Installing Individual Skills

You do not need to install the whole library. You can cherry-pick only the skills you need:

```bash
# Example: Install 'application-security' into your existing project
cd /path/to/my-project
mkdir -p .agents/skills
cp -r /path/to/ultimate-ai-development-skills/.agents/skills/application-security .agents/skills/
```

### Installing the Complete Library

```bash
# Clone the repository
git clone https://github.com/username/ultimate-ai-development-skills.git

# Copy all skills into your project workspace
mkdir -p .agents/skills
cp -r ultimate-ai-development-skills/.agents/skills/* .agents/skills/
```

For complete instructions, refer to the [Installation Guide](docs/installation-guide.md).

---

## 🤖 How to Use Skills in Google Antigravity

Google Antigravity natively indexes skills located in `.agents/skills/` (workspace) and `~/.gemini/config/skills/` (global).

### 1. Implicit Activation (Natural Prompting)
Antigravity automatically reads skill descriptions and activates relevant skills when matching your prompt:
> *"Audit this Express checkout route. We are accepting Stripe webhooks and I need to make sure our signature verification and database transactions are safe."*  
> *(Activates `application-security` and `api-and-payment-integration`)*

### 2. Explicit Activation
To enforce a specific skill workflow, reference it by name:
> *"Using the senior-fullstack-engineer skill, refactor this monolithic route handler into a clean Controller-Service-Repository architecture with unit tests."*

### 3. Global Installation for Antigravity
To make all skills available across all your Antigravity workspaces:
```bash
# Standalone Antigravity IDE global discovery directory:
mkdir -p ~/.gemini/config/skills
cp -r .agents/skills/* ~/.gemini/config/skills/

# Verify discovery
node scripts/verify-global-installation.js
```

---

## 🔌 Adapting Skills for Other AI Agents

Because all skills adhere to standard Markdown and the open Agent Skills specification, adapting them to other agents requires minimal effort:

- **Claude Code:** Reference skills in your project's `CLAUDE.md`:
  ```markdown
  When designing backend architectures, follow `.agents/skills/senior-fullstack-engineer/SKILL.md`.
  ```
- **Cursor:** Create `.cursor/rules/<skill-name>.mdc` with frontmatter referencing the skill.
- **Windsurf (Cascade):** Add reference paths to `.windsurfrules`.
- **Roo Code / Cline:** Copy `SKILL.md` into `.clinerules/<skill-name>.md`.
- **GitHub Copilot:** Use `#file:.agents/skills/<skill-name>/SKILL.md` in Copilot Chat.

Read the [Usage Guide](docs/usage-guide.md) and [Compatibility Guide](docs/compatibility-guide.md) for full configurations.

---

## 🧪 Quality Assurance & Local Validation

This repository includes a programmatic test suite that verifies directory structure, YAML frontmatter validity, link integrity, and executes every practical testbed:

```bash
# Run the master quality audit
node scripts/validate-library.js
```

Continuous Integration automatically executes this suite across Node.js 18.x, 20.x, and 22.x on every push and pull request via GitHub Actions.

---

## 🛡️ Project Governance & Maintenance

This repository follows strict, long-term engineering governance documented in the [Maintenance Guide](docs/maintenance-guide.md):
- **De-duplication Check:** Every new skill proposal is evaluated against existing skills to avoid overlap.
- **Official Documentation Tracking:** Instructions are periodically cross-checked against official upstream vendor standards.
- **Preservation of Validated Code:** Validated skills are protected from arbitrary rewrites; changes must be sealed with regression tests.

---

## 🐛 How to Report Issues

Found a bug in a workflow, an outdated best practice, or flakiness in a test runner?
1. Check the [Issue Tracker](https://github.com/username/ultimate-ai-development-skills/issues) to avoid duplicates.
2. Open an issue using the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).
3. For security vulnerabilities, review our [Security Disclosure Policy](CONTRIBUTING.md#security-vulnerabilities).

---

## 🤝 How to Contribute

We welcome contributions from the developer and AI engineering community!
1. Read the [Contributing Guide](CONTRIBUTING.md) and [Skill Development Guide](docs/skill-development-guide.md).
2. To propose a new skill, open a [Skill Proposal Issue](.github/ISSUE_TEMPLATE/skill_proposal.md).
3. Ensure all skills have passing test runners and 0 broken links by running `node scripts/validate-library.js`.
4. Submit a Pull Request against `main`.

---

## 🗺️ Future Development Plans (Roadmap)

Planned skills and enhancements for upcoming minor releases:

- [ ] **`performance-optimization`**: Frontend Core Web Vitals (LCP, INP, CLS), database indexing strategies, memory profiling, and server-side response caching.
- [ ] **`mobile-engineering`**: Cross-platform Flutter and React Native architecture, state management (Bloc / Riverpod / Zustand), offline-first synchronization, and mobile accessibility.
- [ ] **`graphql-federation-architect`**: Apollo Federation / GraphQL Mesh schemas, subgraph isolation, dataloader batching, and N+1 query elimination.
- [ ] **`rag-and-eval-engineering`**: Retrieval-Augmented Generation architectures, chunking strategies, vector embeddings, synthetic evaluation datasets, and LLM hallucination scoring.
- [ ] **`cloud-finops`**: Cloud infrastructure cost monitoring, auto-scaling thresholds, serverless cold-start optimization, and egress reduction.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
