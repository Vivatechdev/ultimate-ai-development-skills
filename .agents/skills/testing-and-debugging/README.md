# Testing & Debugging Specialist

[![Agent Skills: Compatible](https://img.shields.io/badge/Agent%20Skills-Compliant-blue.svg)](../../docs/skill-development-guide.md)
[![Status: Verified](https://img.shields.io/badge/Status-Verified-brightgreen.svg)](examples/calculator-and-bug-reproduction/test-runner.js)

Architect and execute comprehensive test suites, deterministic bug reproduction, and systematic root-cause analysis (RCA). Enforces the testing pyramid, contract-safe test doubles, flaky test elimination, and regression prevention.

---

## Quick Links
- **Primary Instructions:** [SKILL.md](SKILL.md)
- **Testing References:**
  - [Testing Pyramid & Test Doubles](references/testing-pyramid-and-test-doubles.md)
  - [Root-Cause Debugging (RCA) Playbook](references/root-cause-debugging-playbook.md)
  - [Flaky Test Remediation Guide](references/flaky-test-remediation.md)
- **Reproduction Harness:** [reproduction-test.js](examples/calculator-and-bug-reproduction/reproduction-test.js)
- **Production-Hardened Engine:** [fixed-cart.js](examples/calculator-and-bug-reproduction/fixed-cart.js)
- **Automated Regression Suite:** [test-runner.js](examples/calculator-and-bug-reproduction/test-runner.js)

---

## When to Activate
- Writing or refactoring unit, integration, or end-to-end test suites.
- Debugging intermittent, flaky, or failing automated tests.
- Investigating production defects, calculation discrepancies, or race conditions.
- Performing Root Cause Analysis (RCA) and creating Minimal Reproducible Examples (MREs).

---

## Verification
Run the deterministic reproduction and regression test suite:
```bash
node examples/calculator-and-bug-reproduction/test-runner.js
```

