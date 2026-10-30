# Visual & Interaction Defect Severity Matrix

Systematic visual QA requires standard triage rubrics to prioritize fixes and manage engineering risk. When inspecting an interface, classify every discovered defect into one of four severity tiers.

---

## 1. Defect Severity Classification Rubric

| Severity Level | Definition & User Impact | Examples | Remediation SLA |
| :--- | :--- | :--- | :--- |
| **P0 — Blocker** | Completely breaks user journey, blocks core functionality, or causes severe data/security exposure. The release is blocked. | - Horizontal overflow breaking entire mobile page layout (page scrolls sideways).<br>- Primary checkout or sign-up submit button obscured or unclickable.<br>- Mobile menu toggle fails to open or cannot be closed, trapping user.<br>- Critical contrast failure rendering text invisible (e.g. white text on white background). | **Immediate.** Must be fixed before any further testing or release. |
| **P1 — Critical** | Major visual corruption, unhandled error states, severe WCAG failure, or key interactive component broken. | - Broken image or missing asset in primary hero section.<br>- Form validation error message clipped or hidden off-screen.<br>- Interactive element hit target <24px on mobile.<br>- Modal cannot be dismissed via keyboard (Escape or focus trap leak).<br>- Heading text severely overlapping body text on 375px viewport. | **Fix in current cycle.** Blocks production deployment. |
| **P2 — Major** | Visually jarring inconsistency, layout misalignment, or minor interaction degradation that does not block core task completion. | - Section padding erratic between sibling pages (e.g. 16px on one, 64px on another).<br>- Missing active state on current navigation link.<br>- Table numbers left-aligned instead of tabular right-aligned.<br>- Hover state missing on secondary interactive buttons.<br>- Contrast ratio slightly below 4.5:1 (e.g. 3.8:1 on secondary metadata). | **Fix before general release.** High priority backlog. |
| **P3 — Minor** | Subtle cosmetic polish issue, minor spacing defect, or micro-interaction imperfection. | - 1px misalignment on icon optical baseline.<br>- Transition duration slightly too fast or abrupt.<br>- Inconsistent border radius (4px on one card vs 6px on another).<br>- Missing subtle empty state illustration when text explanation is already present. | **Fix during polish phase.** Does not block deployment. |

---

## 2. Standard Defect Reporting Template

When documenting defects, use this deterministic structure:

```markdown
### [DEFECT-ID] [Severity: P0/P1/P2/P3] Title of Defect

- **Category:** (e.g., Horizontal Overflow, Typography, Contrast, Forms)
- **Target Viewport(s):** (e.g., 375px, 390px, 768px, 1280px, 1440px)
- **Affected URL / Component:** (e.g., `HeroSection.tsx` or `/dashboard/settings`)
- **Observed Behavior:** What went wrong (include screenshot or exact measurement).
- **Expected Behavior:** What the specification or design system mandates.
- **Root Cause Analysis:** CSS or DOM mechanism causing the defect (e.g. `min-w-[600px]` on table container without wrapper `overflow-x-auto`).
- **Remediation Plan:** Concrete code diff or CSS adjustment to resolve the issue without regressions.
```

---

## 3. Remediation & Regression Protocol

A visual QA engineer does not merely file reports; when authorized, you remediate the defect directly:
1. **Isolate Root Cause:** Inspect computed styles, parent box models, flex/grid constraints, or missing media queries.
2. **Apply Minimal Targeted Fix:** Change only the rules necessary to resolve the defect. Avoid shotgun styling (`!important` or wrapping everything in `overflow-hidden`).
3. **Reinspect Affected Viewports:** Re-run the inspection on the specific viewport where the defect was reported.
4. **Execute Multi-Viewport Regression Check:** Verify that the fix did not inadvertently break the layout on the other 4 standard viewports (375px, 390px, 768px, 1280px, 1440px).

