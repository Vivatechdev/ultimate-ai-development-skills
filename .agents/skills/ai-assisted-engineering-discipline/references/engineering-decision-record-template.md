# Architectural Decision Record (ADR) Specification

An Architectural Decision Record (ADR) captures significant technical choices, rationale, trade-offs, and consequences. Maintaining ADRs preserves organizational knowledge, prevents cyclic debates, and empowers developers to understand *why* a codebase is shaped the way it is.

---

## Standard Lightweight ADR Template

```markdown
# [ADR-000] [Title of Decision: Active Verb + Subject]

- **Status:** Proposed | Accepted | Deprecated | Superseded by [ADR-XXX]
- **Date:** YYYY-MM-DD
- **Deciders:** [Author / Team Members]
- **Technical Domain:** [e.g., Caching, Database Schema, Authentication, State Management]

---

## 1. Context & Problem Statement
Describe the technical context and the specific constraint or problem being solved. What forces are at play (latency, scale, cost, developer ergonomics, security)?

## 2. Considered Architectural Options
Enumerate at least 2–3 viable options. Avoid strawman comparisons:

### Option A: [Description]
- **Pros:** [Benefits]
- **Cons:** [Drawbacks, latency risks, operational complexity]

### Option B: [Description]
- **Pros:** [Benefits]
- **Cons:** [Drawbacks]

## 3. Decision Outcome
State the chosen option clearly:
> **Chosen Option:** [Option X], because [primary justification tied to constraints].

## 4. Consequences & Trade-Offs
Every architectural decision has trade-offs. Be explicit:
- **Positive Impacts:** What becomes easier or faster?
- **Negative Impacts / Costs:** What operational overhead or complexity is introduced?
- **Residual Risks & Mitigation:** What edge cases or failure modes exist, and how will we monitor them?

## 5. Maintenance & Debugging Playbook
Provide concrete instructions for future maintainers:
- **Where the code lives:** File paths, entry points, configuration tokens.
- **How to debug failure modes:** Log messages to look for, diagnostic metrics.
- **Under what conditions this decision should be revisited:** Thresholds (e.g., "Revisit if cache memory exceeds 2GB or hit rate drops below 85%").
```
