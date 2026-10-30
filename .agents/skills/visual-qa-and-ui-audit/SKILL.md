---
name: visual-qa-and-ui-audit
description: Rigorous visual quality assurance and interface inspection workflow. Identifies and remediates layout defects, typography flaws, horizontal overflow, sub-44px tap targets, and WCAG contrast failures across 5 standard viewport widths (375px, 390px, 768px, 1280px, 1440px).
---

# Visual QA and UI Audit

This skill governs the visual quality assurance, layout verification, and defect remediation workflow for modern web applications. Operating like a seasoned visual QA engineer, the agent verifies rendered interfaces across five standard viewport dimensions, catches regressions before deployment, and resolves defects directly in the codebase.

---

## 1. Purpose and Scope

### Scope
- Inspecting rendered user interfaces across five mandatory viewport widths: **375px**, **390px**, **768px**, **1280px**, and **1440px**.
- Auditing the 14 core visual and interaction categories: layout consistency, typography, spacing, alignment, media sizing, color contrast, navigation, responsive adaptation, forms/validation, button hit targets, loading states, error states, empty states, and horizontal overflow.
- Triaging discovered defects into P0 (Blocker), P1 (Critical), P2 (Major), and P3 (Minor) tiers.
- Applying surgical code fixes to resolve identified visual defects and executing multi-viewport regression tests.

### Out of Scope
- Backend performance benchmarking, database indexing, and server-side profiling (see `senior-fullstack-engineer`).
- Penetration testing and OWASP vulnerability auditing (see `application-security`).
- Establishing initial brand archetypes or creating design systems from scratch (see `ui-ux-design-mastery` and `design-system-architect`).

---

## 2. When to Activate the Skill

### Primary Triggers
Activate this skill whenever:
- Preparing an interface, page, or component for production release or design review.
- Auditing an existing website or web app for visual bugs, broken layouts, or mobile usability defects.
- The user reports mobile layout breakage: *"the page scrolls sideways"*, *"elements are overlapping on my phone"*, or *"the layout breaks on iPad"*.
- Testing new components or pages across responsive breakpoints.
- The user requests: *"perform a visual QA audit"*, *"inspect UI for defects"*, *"check mobile responsiveness"*, or *"verify WCAG contrast and tap targets"*.

### Anti-Triggers
- Headless API debugging with no browser UI.
- Backend database schema migrations.

---

## 3. Required Inputs & Initial Assessment

Before running an audit, establish the inspection baseline:

```text
┌────────────────────────────────────────────────────────┐
│               VISUAL QA INTAKE BASELINE                │
├────────────────────┬───────────────────────────────────┤
│ 1. Target URL/Path │ Local dev server or HTML file path│
│ 2. Viewport Suite  │ 375px, 390px, 768px, 1280px, 1440px│
│ 3. Key Journeys    │ Primary pages, modals, form flows │
│ 4. Tooling Mode    │ Headless browser, DevTools, or CLI│
└────────────────────┴───────────────────────────────────┘
```

1. **Target Artifact / Application URL:** A running local dev server (e.g., `http://localhost:3000`), staging URL, or static HTML file on disk.
2. **Key User Journeys & Critical Views:** Identify all core pages, dialogs, drawers, and form validation states that must be exercised.
3. **Available Inspection Tooling:** Determine whether browser automation (Playwright, Puppeteer, Chrome DevTools MCP) or static analysis scripts (`scripts/overflow-and-qa-detector.js`) are available.

---

## 4. Step-by-Step Testing Procedure

Execute visual QA through an eight-step remediation cycle:

```
[ Step 1: Open Application ] 
       │
[ Step 2: Multi-Viewport Inspection (375, 390, 768, 1280, 1440) ]
       │
[ Step 3: Capture Visual Evidence & DOM Telemetry ]
       │
[ Step 4: Isolate Defects & Conduct Root Cause Analysis ]
       │
[ Step 5: Triage & Classify by Severity (P0, P1, P2, P3) ]
       │
[ Step 6: Code Remediation (Fix the Underlying Code) ]
       │
[ Step 7: Reinspect Affected Pages & Viewports ]
       │
[ Step 8: Multi-Viewport Regression Check ]
```

### Step 1: Open the Actual Application
- Start the local development server or open the target file.
- Confirm the application renders without fatal JavaScript runtime errors or unhandled network exceptions.
- **Rule of Integrity:** Never invent test results or claim that an untested page passed.

### Step 2: Multi-Viewport Inspection
Inspect every critical view across all five required viewport widths. Refer to [references/viewport-testing-matrix.md](references/viewport-testing-matrix.md):
- **375px (Compact Mobile):** Horizontal overflow stress test, text collision check, compact drawer inspection.
- **390px (Standard Mobile):** 44x44px touch targets, mobile thumb-zone layout, form inputs.
- **768px (Tablet Portrait):** 2-column grid transitions, tablet menu behavior, table scrolling.
- **1280px (Compact Desktop):** Full desktop navigation, sidebar layout, modal vertical bounds.
- **1440px (Widescreen):** Max-width constraints (`max-w-7xl`), whitespace balance, container centering.

### Step 3: Capture Visual Evidence & DOM Telemetry
- Take screenshots or capture bounding box metrics for any visual distortion.
- Execute [scripts/overflow-and-qa-detector.js](scripts/overflow-and-qa-detector.js) to catch hidden overflow elements (`scrollWidth > clientWidth`) and sub-44px interactive targets.

### Step 4: Isolate Defects & Conduct Root Cause Analysis
For each visual failure, identify the exact CSS or HTML trigger:
- Is a container fixed-width (`w-[500px]`) instead of responsive (`max-w-full` or `w-full`)?
- Is an image lacking `object-fit: cover` or explicit aspect-ratio constraints?
- Is a text color token failing WCAG 4.5:1 contrast against a dynamic background?

### Step 5: Classify Defects by Severity
Tag defects using the rubric in [references/defect-severity-matrix.md](references/defect-severity-matrix.md):
- **P0 (Blocker):** Horizontal overflow, unclickable primary CTAs, broken navigation drawers.
- **P1 (Critical):** Broken images, clipped error messages, touch targets <24px, keyboard traps.
- **P2 (Major):** Inconsistent padding, missing link hover/active states, left-aligned table numbers.
- **P3 (Minor):** 1px icon baseline alignment, minor transition jitter, slight border-radius mismatch.

### Step 6: Code Remediation
*Do not stop after filing a report.* When authorized to edit code:
- Apply targeted, surgical fixes directly to CSS/Tailwind classes or component markup.
- **Prohibited Workaround:** Never apply `overflow-x: hidden` to the `<body>` tag to hide horizontal overflow without fixing the rogue child element that caused it.

### Step 7: Re-inspect the Affected Pages
- Re-render the modified component at the exact viewport width where the defect occurred.
- Verify that the defect is completely resolved and visually verified.

### Step 8: Multi-Viewport Regression Checks
- Re-test the modified page across the remaining four viewport widths to guarantee the fix did not introduce secondary regressions.

---

## 5. Professional Standards & Best Practices

Verify all 14 categories from [references/visual-audit-checklist.md](references/visual-audit-checklist.md):

1. **Zero Horizontal Overflow:** `document.documentElement.scrollWidth === window.innerWidth` across all viewports.
2. **Touch Target Dimensions:** All clickable elements must measure at least **44 × 44 CSS pixels** on viewports $\le 768\text{px}$.
3. **Contrast Ratios (WCAG 2.2 AA):**
   - Body text: $\ge 4.5:1$.
   - Large display text ($\ge 18\text{px}$ regular or $\ge 14\text{px}$ bold): $\ge 3.0:1$.
   - Form field borders and functional icons: $\ge 3.0:1$.
4. **Typography & Line Length:** Body text constrained to 65–75 characters per line (`max-w-prose`); zero orphan words in headings.
5. **State Completeness:** Form inputs must render distinct styling for default, hover, focus-visible, error, and disabled states.
6. **Focus Ring Visibility:** All interactive elements must show a high-contrast 2px focus ring when navigated by keyboard.

---

## 6. Decision-Making Guidelines

```text
Defect Discovered During Audit
├─ Does it break navigation, cause mobile horizontal scroll, or prevent task completion?
│  ├─ YES ──> Classify as P0/P1. Fix immediately before proceeding.
│  └─ NO
│     ├─ Is it a layout inconsistency or missing interactive state?
│     │  ├─ YES ──> Classify as P2. Apply targeted fix in current session.
│     │  └─ NO  ──> Classify as P3. Document or polish if time permits.
```

### Remediation vs. Overhaul
- If a component has 1–2 localized CSS bugs (e.g. padding offset, missing `overflow-x-auto`), apply a minimal code diff.
- If a component fails across 4+ categories and lacks responsive structure entirely, refactor the component using `ui-ux-design-mastery` principles.

---

## 7. Common Mistakes & Anti-Patterns to Avoid

| Prohibited Anti-Pattern | Correct Senior QA Engineering Approach |
| :--- | :--- |
| **"Hallucinated Passes"** | Claiming a page looks great without running browser previews, headless audits, or checking computed styles. |
| **Desktop-Only Testing (1920px bias)** | Testing only on wide monitors and assuming mobile works automatically. |
| **The `overflow-x: hidden` on Body Trap** | Slapping `overflow-x: hidden` on `<body>` masks symptoms while clipping dropdowns and sticky headers. Find and fix the child element with excessive width. |
| **Ignoring Interactive States** | Auditing only static resting states and missing unstyled `:focus-visible`, broken `:active`, or missing loading spinners. |
| **Fixing One Breakpoint, Breaking Another** | Changing a class globally to fix mobile (375px) without using responsive prefixes (`sm:`, `md:`, `lg:`), breaking desktop. |

---

## 8. Practical Implementation Examples

### Example 1: Resolving Horizontal Overflow on Mobile Tables

```diff
- <!-- BAD: Table container forces 700px width on a 375px mobile screen -->
- <div class="w-[700px]">
-   <table>...</table>
- </div>

+ <!-- GOOD: Fully responsive container with explicit horizontal scroll and hairline border -->
+ <div class="w-full overflow-x-auto border border-neutral-200 rounded-sm">
+   <table class="w-full min-w-[640px] text-left font-mono text-xs">...</table>
+ </div>
```

### Example 2: Resolving Sub-44px Touch Targets on Mobile Navigation

```diff
- <!-- BAD: 24x24px icon button impossible to tap reliably on mobile -->
- <button class="p-1 text-neutral-600">
-   <svg class="w-4 h-4">...</svg>
- </button>

+ <!-- GOOD: Minimum 44x44px touch target area with optically centered icon -->
+ <button class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 text-neutral-600 hover:text-neutral-900 rounded-sm focus-visible:ring-2 focus-visible:ring-neutral-900">
+   <svg class="w-5 h-5">...</svg>
+ </button>
```

---

## 9. Quality Assurance Sign-Off Checklist

Before certifying an application as audited and verified:
- [ ] Tested at **375px** with zero horizontal overflow.
- [ ] Tested at **390px** with all tap targets $\ge 44\times 44\text{px}$.
- [ ] Tested at **768px** with clean column transitions and navigation stability.
- [ ] Tested at **1280px** with balanced multi-column grid alignment.
- [ ] Tested at **1440px** with proper container max-width constraints.
- [ ] All text passes WCAG 2.2 AA contrast checks ($\ge 4.5:1$ body, $\ge 3.0:1$ large).
- [ ] Every form control has an explicit `<label for="...">` or `aria-label`.
- [ ] All interactive elements feature visible `:focus-visible` rings.
- [ ] Every P0 and P1 defect has been fixed, reinspected, and regression-tested.

---

## 10. Completion Criteria

A visual QA audit session is complete when:
1. All critical pages have been inspected across all five mandatory viewports.
2. Discovered defects are cataloged, root causes isolated, and prioritized.
3. All authorized fixes are implemented, re-tested, and verified to cause zero regressions.
4. The final sign-off checklist is fully satisfied with verified evidence.

