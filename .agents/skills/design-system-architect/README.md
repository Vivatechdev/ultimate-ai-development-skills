# Design System Architect

[![Agent Skills: Compatible](https://img.shields.io/badge/Agent%20Skills-Compliant-blue.svg)](../../docs/skill-development-guide.md)
[![Status: Verified](https://img.shields.io/badge/Status-Verified-brightgreen.svg)](examples/design-system-testbed/test-runner.js)

Guides the end-to-end architecture, implementation, and governance of scalable design systems. Enforces 3-tier Design Tokens Community Group (DTCG) hierarchies, mathematical typography/spacing scales, accessible headless components, dark/light themes, and non-destructive integration.

---

## Quick Links
- **Primary Instructions:** [SKILL.md](SKILL.md)
- **Architecture References:**
  - [3-Tier Token Architecture](references/three-tier-token-architecture.md)
  - [Headless Accessible Components](references/headless-accessible-components.md)
  - [Design System Governance](references/design-system-governance.md)
- **Living Testbed:** [tokens.css](examples/design-system-testbed/tokens.css) & [index.html](examples/design-system-testbed/index.html)
- **Token Verification Suite:** [test-runner.js](examples/design-system-testbed/test-runner.js)

---

## When to Activate
- Architecting a new design system, token schema, or UI library.
- Migrating hardcoded hex colors and pixel values to semantic tokens.
- Building accessible headless components with complete ARIA states.
- Implementing robust light/dark/high-contrast theming.

---

## Verification
Run the design system token and component test suite:
```bash
node examples/design-system-testbed/test-runner.js
```

