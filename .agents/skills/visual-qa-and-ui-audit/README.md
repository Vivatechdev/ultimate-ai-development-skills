# Visual QA & UI Audit Specialist

[![Agent Skills: Compatible](https://img.shields.io/badge/Agent%20Skills-Compliant-blue.svg)](../../docs/skill-development-guide.md)
[![Status: Verified](https://img.shields.io/badge/Status-Verified-brightgreen.svg)](examples/testbed/run-audit-test.js)

Systematic visual quality assurance, layout defect detection, and automated interface inspection across standard viewport widths (375px, 390px, 768px, 1280px, 1440px). Detects horizontal overflows, tap targets below 44px, and WCAG contrast failures.

---

## Quick Links
- **Primary Instructions:** [SKILL.md](SKILL.md)
- **QA References:**
  - [Responsive Viewports & Edge Cases](references/responsive-viewports-and-edge-cases.md)
  - [Visual Defect Taxonomy & Remediation](references/visual-defect-taxonomy-and-remediation.md)
  - [Automated Audit Script Guide](references/automated-audit-script-guide.md)
- **Detector Script:** [overflow-and-qa-detector.js](scripts/overflow-and-qa-detector.js)
- **Practical Testbed:** [run-audit-test.js](examples/testbed/run-audit-test.js)

---

## When to Activate
- Performing visual quality assurance or responsive audits across multiple viewport sizes.
- Diagnosing horizontal scrollbars or unwanted overflows on mobile.
- Auditing tap-target dimensions (< 44px) or typography clipping.
- Verifying WCAG 2.2 AA color contrast compliance.

---

## Verification
Run the automated visual QA audit testbed:
```bash
node examples/testbed/run-audit-test.js
```
