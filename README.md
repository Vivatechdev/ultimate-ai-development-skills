# Ultimate AI Development Skills Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Specification: Agent Skills](https://img.shields.io/badge/Spec-Agent%20Skills-blue.svg)](docs/skill-development-guide.md)
[![Status: Alpha](https://img.shields.io/badge/Status-In%20Development-orange.svg)](#roadmap)

A curated, professional, vendor-neutral library of specialized skills designed for AI coding agents. 

Built on the open **Agent Skills** specification, this library equips AI coding assistants (Google Antigravity, Claude Code, Cursor, Windsurf, Roo Code / Cline, and others) with the domain expertise, engineering discipline, and rigorous workflows expected of senior software engineers and architects.

---

## 🎯 Mission & Philosophy

Most AI coding assistants possess broad knowledge but default to generic suggestions, shallow prototypes, or brittle code unless guided by strict contextual instructions. 

This library bridges the gap between raw LLM capabilities and production-grade engineering by providing:
- **Pragmatic Workflows:** Step-by-step methodologies tested on real-world engineering tasks.
- **Portability:** Strict compliance with the open Agent Skills specification (`SKILL.md` with YAML frontmatter) without proprietary vendor lock-in.
- **Engineering Rigor:** Built-in verification steps, security checks, accessibility standards, and clean architecture principles.
- **Modularity:** Focused, self-contained skills that work harmoniously without bloated prompts or redundant dependencies.

---

## 📂 Repository Structure

```text
Antigravity-Skills/
├── .agents/
│   └── skills/
│       ├── ui-ux-design-mastery/              # High-end UX/UI design and micro-interactions
│       ├── visual-qa-and-ui-audit/            # Systematic UI verification and layout QA
│       ├── design-system-architect/           # Scalable tokens, component libraries & theming
│       ├── senior-fullstack-engineer/         # Production architectural patterns & best practices
│       ├── application-security/              # Threat modeling, OWASP verification & safe coding
│       ├── testing-and-debugging/             # Comprehensive testing, RCA & regression prevention
│       ├── saas-product-architect/            # Multi-tenancy, billing logic & data modeling
│       ├── devops-deployment/                 # CI/CD, containerization & cloud infrastructure
│       ├── api-and-payment-integration/       # Resilient REST/GraphQL APIs, webhooks & Stripe/Paddle
│       └── ai-assisted-engineering-discipline/# Structured prompt workflows, validation & pair programming
├── docs/
│   ├── skill-development-guide.md             # Standards, YAML schema, and authoring guidelines
│   ├── installation-guide.md                  # Setup instructions across diverse AI agents
│   └── compatibility-guide.md                 # Agent feature matrix and compatibility details
├── CHANGELOG.md                               # Release history and milestone tracking
├── CONTRIBUTING.md                            # Contribution workflows and PR standards
├── LICENSE                                    # MIT License
└── README.md                                  # Repository overview and quick start
```

---

## 🛠️ Planned Skills Catalog

| Skill Name | Focus Area | Status | Description |
| :--- | :--- | :---: | :--- |
| **`ui-ux-design-mastery`** | UI/UX & Interaction | ✅ Verified | Crafting visually polished, intuitive interfaces with balanced typography, hierarchy, and micro-interactions. Eliminates generic AI aesthetics. |
| **`visual-qa-and-ui-audit`** | Quality Assurance | ✅ Verified | Rigorous automated & visual inspection of responsive layouts, viewport edge cases (375px–1440px), defect triage, and code remediation. |
| **`design-system-architect`** | Design Systems | ⏳ Planned | Structuring design tokens, headless accessible components, theming layers, and semantic primitives. |
| **`senior-fullstack-engineer`** | Architecture | ⏳ Planned | Idiomatic application architecture, state management, API design, caching, and clean separation of concerns. |
| **`application-security`** | DevSecOps & Security | ⏳ Planned | Vulnerability remediation (OWASP Top 10), authentication flows, input validation, and credential security. |
| **`testing-and-debugging`** | Testing & Diagnostics | ⏳ Planned | Unit, integration, and E2E test strategy, systematic root-cause analysis (RCA), and deterministic bug reproduction. |
| **`saas-product-architect`** | Product Engineering | ⏳ Planned | Tenant isolation, subscription lifecycle, feature flags, audit logging, and scalable schema design. |
| **`devops-deployment`** | Operations | ⏳ Planned | Docker, modern CI/CD pipelines, zero-downtime deployments, observability, and container security. |
| **`api-and-payment-integration`** | Integrations | ⏳ Planned | Reliable 3rd-party integrations, webhook handling, idempotency, retry mechanisms, and payment platforms. |
| **`ai-assisted-engineering-discipline`** | AI Engineering | ⏳ Planned | Meta-skill enforcing verification gates, preventing hallucinated dependencies, and systematic agent execution. |

---

## 🚀 Quick Start & Installation

Each skill adheres to the Agent Skills standard and is packaged with a primary `SKILL.md` entry point.

### Using with Google Antigravity
Link or copy desired skills into your workspace's `.agents/skills/` directory:
```bash
# Example: Install ui-ux-design-mastery into your project
mkdir -p .agents/skills
cp -r path/to/ultimate-ai-development-skills/.agents/skills/ui-ux-design-mastery .agents/skills/
```

### Using with Other Agents
For detailed instructions covering Claude Code, Cursor, Windsurf, Roo Code, and other systems, refer to the [Installation Guide](docs/installation-guide.md) and [Compatibility Guide](docs/compatibility-guide.md).

---

## 📖 Skill Authoring Standards

All skills in this repository must meet the following criteria:
1. **YAML Frontmatter:** Valid `name` and `description` headers.
2. **Explicit Activation Criteria:** Clearly specified triggers defining when the skill should activate.
3. **Actionable Workflows:** Prescriptive, step-by-step methodologies rather than generic high-level advice.
4. **Zero Proprietary Lock-In:** Core instructions remain agent-agnostic; agent-specific enhancements (e.g. MCP tooling) are marked optional.
5. **Verified Quality:** No skill is marked complete without end-to-end practical validation.

Review the [Skill Development Guide](docs/skill-development-guide.md) for full authoring conventions.

---

## 🤝 Contributing

We welcome community contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting an issue or pull request.

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).

