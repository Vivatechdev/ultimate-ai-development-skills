# AI-Assisted Engineering Discipline

[![Agent Skills: Compatible](https://img.shields.io/badge/Agent%20Skills-Compliant-blue.svg)](../../docs/skill-development-guide.md)
[![Status: Verified](https://img.shields.io/badge/Status-Verified-brightgreen.svg)](examples/decision-records/test-discipline.js)

Metacognitive engineering discipline for AI-assisted software development. Enforces verification gates, architectural decision records (ADRs), anti-hallucination protocols, and structured knowledge transfer to build independent developer capabilities.

---

## Quick Links
- **Primary Instructions:** [SKILL.md](SKILL.md)
- **Discipline References:**
  - [Architectural Decision Record (ADR) Template](references/engineering-decision-record-template.md)
  - [AI Verification & Anti-Hallucination Protocols](references/ai-verification-and-anti-hallucination.md)
  - [Knowledge Transfer Heuristics & Cognitive Load](references/knowledge-transfer-heuristics.md)
- **Production Decision Record:** [ADR-001-caching-strategy.md](examples/decision-records/ADR-001-caching-strategy.md)
- **Walkthrough Workflow:** [example-workflow.md](examples/decision-records/example-workflow.md)
- **Verification Suite:** [test-discipline.js](examples/decision-records/test-discipline.js)

---

## When to Activate
- Starting non-trivial architectural or system implementations.
- Authoring Architectural Decision Records (ADRs) to document technical trade-offs.
- Auditing AI-generated code against hallucinated packages or imaginary APIs.
- Pair programming where knowledge transfer and engineering mastery are prioritized alongside code delivery.

---

## Verification
Run the engineering discipline compliance suite:
```bash
node examples/decision-records/test-discipline.js
```

