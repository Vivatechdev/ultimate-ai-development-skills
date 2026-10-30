---
name: design-system-architect
description: Guides the end-to-end architecture, implementation, and governance of scalable design systems. Enforces 3-tier token hierarchies, mathematical typography/spacing scales, accessible headless components, dark/light themes, and non-destructive project integration.
---

# Design System Architect

This skill governs the methodology for creating, scaling, and maintaining coherent, accessible, and enterprise-grade design systems. Operating as a senior design systems engineer, the agent establishes robust 3-tier design tokens, accessible component composition patterns, fluid spatial layouts, dark/light themes, and non-destructive integration protocols for existing codebases.

---

## 1. Purpose and Scope

### Scope
- Architecting scalable design systems spanning 15 core pillars: design tokens, color systems, typography scales, spacing systems, responsive breakpoints, layout grids, component libraries, buttons/forms, navigation patterns, tables/data viz, modals/overlays, interaction states, accessibility standards, dark/light theming, and system documentation.
- Auditing existing codebases prior to token introduction to prevent style collisions and unnecessary rewrites.
- Establishing headless behavioral primitives paired with composable, variant-driven presentational components.
- Governing non-destructive system extensions and deprecation lifecycles.

### Out of Scope
- Backend database schema design and API route handlers (see `senior-fullstack-engineer`).
- Visual QA viewport audits and defect remediation (see `visual-qa-and-ui-audit`).
- Pure brand identity brainstorming or raw marketing copywriting (see `ui-ux-design-mastery`).

---

## 2. When to Activate the Skill

### Primary Triggers
Activate this skill whenever:
- Creating a new design system, component library, or token architecture from scratch.
- Standardizing disparate styles, inconsistent colors, and hardcoded values across an existing application.
- Building reusable UI component primitives (Buttons, Inputs, Modals, Tables, Navigation bars).
- Implementing robust Dark Mode and Light Mode theming without contrast regressions.
- The user requests: *"create a design system"*, *"organize our design tokens"*, *"build a reusable button/input component library"*, *"add dark mode support"*, or *"document our UI components"*.

### Anti-Triggers
- One-off micro-adjustments to a single isolated page without design system implications.
- Headless backend script writing or server infrastructure configuration.

---

## 3. Required Inputs & Initial Assessment

Before introducing any new design system artifacts, execute a pre-flight inspection of the host project:

```text
┌────────────────────────────────────────────────────────┐
│             DESIGN SYSTEM PRE-FLIGHT AUDIT             │
├────────────────────┬───────────────────────────────────┤
│ 1. CSS Engine      │ Tailwind, CSS Modules, SCSS, etc. │
│ 2. Existing Tokens │ Scan :root CSS variables & theme  │
│ 3. UI Primitives   │ Check package.json (Radix, Shadcn)│
│ 4. Icon Suites     │ Lucide, Heroicons, Phosphor, etc. │
└────────────────────┴───────────────────────────────────┘
```

1. **CSS Engine & Framework:** Check for `tailwind.config.*`, CSS modules, or vanilla CSS.
2. **Existing Variable Footprint:** Inspect root stylesheets (`globals.css`, `variables.css`) to catalog existing custom properties and avoid naming collisions.
3. **Existing Component Infrastructure:** Check `package.json` for headless libraries (Radix UI, React Aria, Headless UI, Ark UI) or pre-existing UI kits.
4. **Brand Requirements & Theme Context:** Identify required color modes (light-only, dark-only, or dynamic user/system toggling).

---

## 4. Step-by-Step Architecture Workflow

Execute design system development across seven sequential phases:

```
[ Phase 1: Pre-Flight Audit & Style Discovery ]
                       │
[ Phase 2: 3-Tier Design Token Taxonomy ]
                       │
[ Phase 3: Spatial, Typography & Breakpoint Grids ]
                       │
[ Phase 4: Headless Core Primitives & Components ]
                       │
[ Phase 5: Complete 8-State Matrix & Theme Engine ]
                       │
[ Phase 6: Accessibility Verification & WCAG 2.2 AA ]
                       │
[ Phase 7: Non-Destructive Codebase Integration ]
```

### Phase 1: Pre-Flight Audit & Style Discovery
- Follow [references/system-inspection-and-extension.md](references/system-inspection-and-extension.md) to discover existing styling patterns.
- Do not introduce conflicting tokens. If the project already defines `--primary`, integrate with it or use an explicit namespace prefix (e.g., `--ds-color-primary`).

### Phase 2: 3-Tier Design Token Taxonomy
- Structure tokens following [references/token-architecture-and-theming.md](references/token-architecture-and-theming.md):
  - **Tier 1 (Global/Primitives):** Raw color scales (`neutral-50` to `neutral-900`, `blue-500` to `blue-700`), raw spatial units (`4px`, `8px`, `16px`).
  - **Tier 2 (Semantic/Alias):** Contextual meaning (`surface-canvas`, `text-primary`, `border-subtle`, `interactive-primary`).
  - **Tier 3 (Component-Scoped):** Component-specific bindings (`btn-primary-bg: var(--interactive-primary)`).

### Phase 3: Spatial, Typography & Breakpoint Foundations
- Establish the **8pt base grid** with a 4pt half-step for micro-elements.
- Enforce optical typography tracking: tight negative tracking on display titles ($>24\text{px}$), positive tracking on uppercase micro-labels ($<13\text{px}$).
- Standardize responsive breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1440px`.

### Phase 4: Headless Core Primitives & Components
- Implement component primitives using the compound pattern from [references/component-composition-patterns.md](references/component-composition-patterns.md):
  - **Buttons:** Primary, Secondary, Ghost, Destructive, with sizes `sm`, `md`, `lg`.
  - **Form Controls:** Compound `FormField` (Label + Control + Description + Error Alert).
  - **Navigation:** Header bar, breadcrumbs, responsive drawer, active link indicators.
  - **Tables & Visualizations:** Tabular numeric alignment, sticky header rows, cell padding density.
  - **Overlays & Modals:** Portal rendering, focus trapping, Escape dismissal, and body scroll locking.

### Phase 5: Complete 8-State Matrix & Theme Engine
- Every interactive component must define styles for all 8 states: Default, Hover, Active, Focus-Visible, Loading, Disabled, Error, and Empty.
- Implement dark mode using semantic token swapping at the root or `[data-theme="dark"]` selector.
- Avoid the "pure black" dark mode trap; elevate surfaces through lightness rather than heavy drop shadows.

### Phase 6: Accessibility Verification & WCAG 2.2 AA
- Verify contrast ratios: $\ge 4.5:1$ for normal text, $\ge 3.0:1$ for large headings and UI borders.
- Ensure all interactive elements feature visible, high-contrast `:focus-visible` rings with offset.
- All touch targets on mobile viewports must meet the minimum **44 × 44 CSS pixels**.

### Phase 7: Non-Destructive Codebase Integration
- Provide backward-compatible shims for legacy classes or variables.
- Document components with clear prop specifications, usage examples, and accessibility guidelines.

---

## 5. The 15 Core System Pillars

1. **Design Tokens:** 3-tier DTCG-compliant taxonomy separating raw values from semantic context.
2. **Colour Systems:** 60-30-10 distribution; functional semantic tokens (success, warning, danger, info).
3. **Typography Scales:** Modular ratio scale; inverse line-height scaling; max-line length constrained to 65–75 chars.
4. **Spacing Systems:** Strict 8pt spatial grid with 4pt half-steps; consistent padding scales.
5. **Responsive Breakpoints:** 5 standard breakpoints (640px, 768px, 1024px, 1280px, 1440px) plus container queries.
6. **Layout Grids:** 12-column responsive grid; content max-width constraints (`max-w-7xl mx-auto`).
7. **Component Libraries:** Composable, variant-driven architectures (CVA) avoiding multi-boolean prop bloat.
8. **Buttons & Form Controls:** Complete form field anatomy with label, input, description, and error alert.
9. **Navigation Patterns:** Responsive desktop bar and mobile slide-over drawer with focus trap.
10. **Tables & Data Visualisation:** `tabular-nums` right-alignment for metrics; sticky headers; hover row feedback.
11. **Modals & Overlays:** Portal rendering, focus restoration, backdrop scrim, and z-index hierarchy.
12. **Interaction States:** Full 8-state coverage (default, hover, active, focus-visible, loading, disabled, error, empty).
13. **Accessibility Standards:** WCAG 2.2 AA contrast, keyboard navigation, semantic ARIA roles.
14. **Dark & Light Themes:** Semantic token aliases swapped at `:root` / `[data-theme="dark"]`; surface elevation via lightness.
15. **Design Documentation:** Prop tables, accessibility notes, do's & don'ts, live code examples.

---

## 6. Decision-Making Guidelines

```text
Selecting Component Implementation Strategy
├─ Does the project already have a headless library (Radix, React Aria, Headless UI)?
│  ├─ YES ──> Build styled wrappers on top of existing headless primitives.
│  └─ NO
│     ├─ Is it a pure HTML/Tailwind or lightweight stack?
│     │  ├─ YES ──> Build accessible native semantic components with custom CSS variables.
│     │  └─ NO  ──> Author modular CVA components with strict WAI-ARIA attributes.
```

---

## 7. Common Mistakes & Anti-Patterns to Avoid

| Prohibited Anti-Pattern | Correct Senior Design System Practice |
| :--- | :--- |
| **Breaking Existing Project Styles** | Pre-flight audit existing CSS/Tailwind configs; namespace new tokens additively (`--ds-*`). |
| **Hardcoding Hex Values in Templates (`#3b82f6`)** | Reference semantic tokens exclusively (`var(--interactive-primary)` or `bg-interactive-primary`). |
| **Pure Black (`#000000`) Dark Mode Canvas** | Use deep neutral charcoals or tinted slates (`#0B0C0E` / `#0F172A`) to reduce eye strain. |
| **Monolithic "Mega-Components" with 30 Props** | Decompose into compound components (`Field.Label`, `Field.Input`, `Field.Error`). |
| **Arbitrary `z-[9999]` Declared Everywhere** | Enforce a unified elevation & z-index scale (Canvas: 0, Sticky: 200, Modal: 410, Tooltip: 700). |
| **Missing Tap Target Margins on Mobile** | Guarantee minimum **44 × 44 CSS pixels** on touch controls. |

---

## 8. Practical Implementation Examples

### Complete Design Token Foundation (CSS Custom Properties)

```css
:root {
  /* Tier 1: Global Primitives */
  --ds-color-slate-50: #F8FAFC;
  --ds-color-slate-100: #F1F5F9;
  --ds-color-slate-200: #E2E8F0;
  --ds-color-slate-700: #334155;
  --ds-color-slate-900: #0F172A;
  --ds-color-blue-600: #2563EB;
  --ds-color-blue-700: #1D4ED8;
  --ds-color-red-600: #DC2626;

  /* Tier 2: Semantic Aliases (Light Theme) */
  --ds-surface-canvas: var(--ds-color-slate-50);
  --ds-surface-card: #FFFFFF;
  --ds-surface-elevated: #FFFFFF;
  --ds-text-primary: var(--ds-color-slate-900);
  --ds-text-muted: var(--ds-color-slate-700);
  --ds-border-default: var(--ds-color-slate-200);
  --ds-interactive-primary: var(--ds-color-blue-600);
  --ds-interactive-primary-hover: var(--ds-color-blue-700);
  --ds-status-danger: var(--ds-color-red-600);
}

[data-theme="dark"] {
  /* Tier 2: Semantic Aliases (Dark Theme Swapped) */
  --ds-surface-canvas: #0B0C0E;
  --ds-surface-card: #131418;
  --ds-surface-elevated: #1B1C22;
  --ds-text-primary: #F8FAFC;
  --ds-text-muted: #94A3B8;
  --ds-border-default: #1E222B;
  --ds-interactive-primary: #3B82F6;
  --ds-interactive-primary-hover: #60A5FA;
  --ds-status-danger: #EF4444;
}
```

---

## 9. Quality Assurance Checklist

Verify every design system implementation against this checklist:
- [ ] **Pre-Flight Audit Executed:** Checked existing styles, Tailwind configs, and token names to prevent collisions.
- [ ] **3-Tier Token Architecture:** Clear separation between primitives, semantic aliases, and component tokens.
- [ ] **Dual-Theme Verification:** Tested both Light Mode and Dark Mode; verified no pure black body canvas and no invisible borders.
- [ ] **Typography Scale & Tracking:** Tight negative tracking on display headings; positive tracking on uppercase micro-labels.
- [ ] **Spatial Grid Compliance:** All margins, paddings, and gaps align to the 4pt/8pt scale.
- [ ] **Complete 8-State Coverage:** Components render distinct styles for default, hover, active, focus-visible, loading, disabled, error, and empty.
- [ ] **WCAG 2.2 AA Contrast:** All text achieves at least 4.5:1 contrast against adjacent backgrounds.
- [ ] **Accessible Touch Targets:** Minimum 44×44px hit targets on interactive controls.
- [ ] **Non-Destructive Integration:** System extension does not break existing application layouts.

---

## 10. Completion Criteria

A design system architecture engagement is complete when:
1. All 15 core system pillars are defined and documented.
2. Semantic design tokens are operational with seamless dark/light theme switching.
3. Component primitives are implemented with complete interaction states and accessible ARIA markup.
4. Pre-flight audit confirms zero naming collisions with existing styles.
5. All items on the Quality Assurance Checklist are verified through an interactive testbed.

