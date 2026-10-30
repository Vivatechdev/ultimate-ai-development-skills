---
name: ui-ux-design-mastery
description: Elevates AI-assisted frontend interfaces to the caliber of senior product designers and creative directors. Eliminates generic AI aesthetics, establishes deliberate typography and color systems, crafts distinctive responsive layouts, and enforces WCAG 2.2 AA accessibility.
---

# UI/UX Design Mastery

This skill transforms AI coding agents from mechanical code generators into disciplined product designers, visual artists, and creative directors. It enforces intentional visual hierarchy, industry-appropriate aesthetic directions, mathematical typography and color systems, and eliminates the telltale clichés of synthetic "AI slop" interfaces.

---

## 1. Purpose and Scope

### Scope
- Conceptualizing, architecting, and implementing world-class web and mobile user interfaces.
- Selecting and executing distinct visual archetypes (Editorial, Swiss, Product-Led, Minimalist, Corporate, Luxury, Data-Dense, Neo-Brutalist).
- Formulating semantic design tokens (typography scales, optical letter-spacing, color hierarchies, elevation, borders).
- Crafting responsive, accessible components with complete interactive states (hover, active, focus-visible, loading, disabled, error, empty).
- Conducting visual QA, responsive audits, and anti-cliché reviews.

### Out of Scope
- Backend database schema design and server-side business logic (see `senior-fullstack-engineer`).
- Deployment infrastructure and CI/CD pipelines (see `devops-deployment`).
- Native mobile binary compilation (see `android-cli` or Flutter skills).

---

## 2. When to Activate the Skill

### Primary Triggers
Activate this skill whenever the task involves:
- Designing a new web page, landing page, SaaS application, dashboard, or mobile interface.
- Redesigning or modernizing an existing user interface to look professional, polished, and human-crafted.
- Creating or refining design systems, UI components, typography scales, or color palettes.
- Reviewing UI code for visual polish, aesthetic quality, accessibility, or visual hierarchy.
- The user requests: *"make this look professional"*, *"improve the UI/UX"*, *"design a modern landing page"*, *"make it look less like generic AI"*, or *"create a high-end dashboard"*.

### When Not to Activate
- Pure backend tasks (writing SQL queries, optimizing API endpoints, configuring Redis).
- Low-level algorithm debugging or headless CLI utility development.

---

## 3. Required Inputs & Initial Assessment

Before writing any UI code, gather and assess the following four parameters:

```text
┌────────────────────────────────────────────────────────┐
│               INITIAL DESIGN ASSESSMENT                │
├────────────────────┬───────────────────────────────────┤
│ 1. Product Domain  │ Industry, audience, user intent   │
│ 2. Visual Tone     │ Serious, technical, playful, etc. │
│ 3. Target Stack    │ Tailwind, CSS Modules, React, etc │
│ 4. Key Artifacts   │ Brand colors, logos, copy, data   │
└────────────────────┴───────────────────────────────────┘
```

1. **Product Domain & Market:** What is the product, who uses it, and what are their expectations? (e.g., Enterprise B2B compliance officer vs. Gen-Z creative director).
2. **Visual Direction Archetype:** Choose one of the 12 proven archetypes from [references/design-archetypes.md](references/design-archetypes.md).
3. **Existing Technical Stack:** Identify CSS framework (Tailwind CSS, Vanilla CSS, Styled Components), component libraries (Radix, Shadcn UI, headless UI), and icon systems (Lucide, Heroicons).
4. **Content & Brand Assets:** Identify available copy, logos, photography, or data structures. *Never rely on meaningless "Lorem Ipsum" filler when realistic industry copy can be written.*

---

## 4. Step-by-Step Workflow

Execute the design process across seven disciplined phases:

```
[ Phase 1: Domain Discovery ] 
       │
[ Phase 2: Archetype Selection ]
       │
[ Phase 3: Token Architecture ]
       │
[ Phase 4: Composition & Layout ]
       │
[ Phase 5: Component & State Crafting ]
       │
[ Phase 6: Responsive Adaptation ]
       │
[ Phase 7: Mandatory Visual Inspection & Anti-AI Audit ]
```

### Phase 1: Domain Discovery & Reference Grounding
- Determine the emotional tone: Authoritative? Utilitarian? Warm? Futuristic?
- Identify real-world benchmark references from curated directories (Awwwards, Godly, Land-book, Mobbin). 
- Extract key design decisions that make those references successful (spacing rhythm, grid asymmetry, typography personality).

### Phase 2: Visual Archetype Selection
- Select the archetype best suited for the product. Consult [references/design-archetypes.md](references/design-archetypes.md).
- Do not default to "modern SaaS" for every project. A law firm requires Editorial or Corporate; a cloud CLI requires Product-Led Swiss; a boutique coffee brand requires Editorial Luxury or Playful.

### Phase 3: Token Architecture & Foundations
- Define a 60-30-10 color hierarchy using semantic variables. Consult [references/typography-and-color-systems.md](references/typography-and-color-systems.md).
- Select a deliberate font pairing with optical tracking and line-height formulas.
- Choose a consistent spatial scale based on a 4px / 8px grid (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).
- Set an intentional border radius scale: sharp (`0px`-`2px`), restrained (`4px`-`8px`), or organic (`12px`-`16px`).

### Phase 4: Composition & Layout
- Avoid the "Centered Everything" hero section trap.
- Use intentional asymmetric grids (e.g., 5-col narrative / 7-col interactive preview).
- Provide visual breath with purposeful whitespace.
- Structure sections to tell a cohesive story: Value Lead $\rightarrow$ Concrete Evidence $\rightarrow$ Deep Dive Mechanics $\rightarrow$ Social Trust $\rightarrow$ Frictionless Action.

### Phase 5: Component & State Crafting
- Implement every component with all 8 operational states: Default, Hover, Active, Focus-Visible, Loading, Disabled, Error, and Empty. Consult [references/component-states-and-interactions.md](references/component-states-and-interactions.md).
- Build accessible form controls with explicit labels, helper text, and clear error messaging.
- Add micro-transitions (150ms-200ms) on interactive elements using hardware-accelerated properties (`transform`, `opacity`).

### Phase 6: Responsive Adaptation
- Design independently across three primary breakpoints: Mobile (<640px), Tablet (640px-1024px), and Desktop (>1024px).
- Restructure layouts rather than merely stacking elements:
  - Complex tables become structured card feeds or horizontal scrolling panes with sticky column indicators.
  - Desktop multi-column navigation collapses into a dedicated, accessible slide-over drawer or sheet.
  - Enforce touch-target sizes (minimum 44x44px) on mobile viewports.

### Phase 7: Mandatory Visual Inspection & Anti-AI Audit
- Run the full [references/anti-ai-design-checklist.md](references/anti-ai-design-checklist.md).
- Check contrast ratios against WCAG 2.2 AA (4.5:1 text, 3:1 controls).
- Open or preview the rendered interface in a browser. Inspect actual pixel alignments and typography rendering. Never mark a design complete without verifying the rendered result.

---

## 5. Professional Standards & Best Practices

1. **The 60-30-10 Color Distribution:**
   - 60% neutral canvas/surface.
   - 30% structural contrast (typography, borders, icons).
   - 10% high-intent accent for calls to action.
2. **Typography Mechanics:**
   - Always apply negative tracking (`-0.02em` to `-0.035em`) on titles larger than 24px.
   - Always apply positive tracking (`+0.05em` to `+0.1em`) on uppercase micro-labels (<13px).
   - Constrain long-form prose to 65-75 characters per line (`max-w-prose`).
3. **Accessibility (WCAG 2.2 AA):**
   - High-contrast `:focus-visible` rings with offset on all interactive elements.
   - Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
   - All interactive controls have accessible names (`aria-label` or visible text).
   - Colors must not be the sole conveyor of information (use icons and explicit text alongside colors).
4. **Touch Target Size:**
   - Minimum tap target of **44 × 44 CSS pixels** on touch-enabled interfaces.

---

## 6. Decision-Making Guidelines

```text
Is the product technical / developer-focused?
├─ YES ──> Archetype: Product-Led / Swiss. Dark canvas or crisp slate. Monospace accents.
└─ NO
   ├─ Is it long-form, institutional, or narrative-driven?
   │  ├─ YES ──> Archetype: Editorial. Serif display titles, warm ivory canvas, hairline dividers.
   │  └─ NO
   │     ├─ Is it an enterprise B2B workflow or compliance tool?
   │     │  ├─ YES ──> Archetype: Contemporary Corporate. Navy/slate, high density, structured cards.
   │     │  └─ NO
   │     │     ├─ Is it consumer-facing, educational, or creative?
   │     │     │  ├─ YES ──> Archetype: Playful & Human. Warm pastels, friendly curves, tactile micro-feedback.
   │     │     │  └─ NO  ──> Archetype: Minimalist & Essential. Strict monochromatic discipline, negative space.
```

---

## 7. Common Mistakes & Anti-Patterns to Avoid

| Prohibited Anti-Pattern | Correct Senior Design Approach |
| :--- | :--- |
| **Purple/Indigo-to-Cyan Gradients on Everything** | Use deliberate brand palettes (e.g. charcoal + amber, forest green + stone, deep navy + cobalt). |
| **Meaningless Glassmorphism & Diffuse Blurs** | Solid, opaque surfaces with crisp 1px borders (`border-neutral-200` / `border-neutral-800`). |
| **Floating Gradient Blobs & Floating Geometry** | Intentional negative space, grid lines, and real product screenshots or photography. |
| **Repetitive 3-Column Feature Cards** | Asymmetrical layouts: 2-column feature breakdowns, interactive tabs, step-by-step flows. |
| **Centered Everything (Hero Section Cliché)** | Grounded, left-aligned typography with an adjacent interactive artifact or visual showcase. |
| **Emojis as Feature Bullet Points (`🚀 Fast`, `🔒 Secure`)** | Refined typography, crisp semantic SVG icons, and concrete data metrics. |
| **Over-Rounding (`rounded-3xl` on corporate tools)** | Radius matched to tone: `0px`-`2px` (Swiss/Editorial), `4px`-`8px` (SaaS/B2B). |
| **Missing Interactive States (Static Clickables)** | Explicit styling for `:hover`, `:active`, `:focus-visible`, and `:disabled`. |

---

## 8. Practical Implementation Examples

### Example: High-End Asymmetric Hero (Editorial / Product-Led)

```html
<section class="relative bg-stone-50 border-b border-stone-200 py-20 px-6 sm:px-12 lg:px-16">
  <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    <!-- Left Column: Editorial Content (7 cols) -->
    <div class="lg:col-span-7 space-y-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/60 border border-stone-300 text-stone-800 text-xs font-mono uppercase tracking-wider">
        <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
        v4.2 Architecture Engine
      </div>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.08]">
        Engineering clarity for complex distributed systems.
      </h1>
      <p class="text-stone-600 text-lg leading-relaxed max-w-xl">
        Automate telemetry pipelines, isolate latent regressions, and inspect microservice topologies with deterministic visual modeling.
      </p>
      <div class="flex flex-wrap items-center gap-4 pt-2">
        <a href="#deploy" class="px-5 py-3 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.98] rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2">
          Start Deployment
        </a>
        <a href="#docs" class="px-5 py-3 text-sm font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2">
          Read Whitepaper
        </a>
      </div>
    </div>
    <!-- Right Column: Structured Product Artifact (5 cols) -->
    <div class="lg:col-span-5 bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-4">
      <div class="flex items-center justify-between border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-rose-400"></div>
          <div class="w-3 h-3 rounded-full bg-amber-400"></div>
          <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
        </div>
        <span class="text-xs font-mono text-stone-400">cluster-us-east.cfg</span>
      </div>
      <div class="space-y-2 font-mono text-xs text-stone-700">
        <div class="flex justify-between py-1 border-b border-stone-50">
          <span class="text-stone-400">Node Ingress:</span>
          <span class="font-semibold text-emerald-700">99.98% Healthy</span>
        </div>
        <div class="flex justify-between py-1 border-b border-stone-50">
          <span class="text-stone-400">Latency P99:</span>
          <span>4.2 ms</span>
        </div>
        <div class="flex justify-between py-1">
          <span class="text-stone-400">Active Shards:</span>
          <span>256 / 256</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 9. Quality Assurance Checklist

Verify every deliverable against this checklist:
- [ ] **No Generic AI Slop:** No purple/indigo gradient backgrounds, no random floating glowing orbs, no emojis in feature bullets.
- [ ] **Definite Visual Archetype:** Has a recognizable identity (Editorial, Swiss, Product-Led, etc.) appropriate to the product domain.
- [ ] **Typography Scale & Tracking:** Display headings have tight negative tracking; uppercase micro-tags have positive tracking; body line-lengths are restricted to 65-75 characters.
- [ ] **60-30-10 Color Hierarchy:** 60% neutral surface, 30% structural borders/text, 10% intentional accent.
- [ ] **State Completeness:** All interactive elements feature distinct `:hover`, `:active`, `:focus-visible`, and `:disabled` styles.
- [ ] **Responsive Integrity:** Tested across mobile (<640px), tablet (768px), and desktop (1280px+). No horizontal overflow; all tap targets >= 44x44px.
- [ ] **WCAG 2.2 AA Contrast:** All text meets at least 4.5:1 contrast against adjacent backgrounds (3:1 for large display headers and form borders).
- [ ] **Semantic Markup:** Clean HTML structure with appropriate `<nav>`, `<main>`, `<section>`, and `<button>` elements.

---

## 10. Completion Criteria

A design task guided by this skill is complete when:
1. The rendered interface matches the selected visual archetype with clear brand identity.
2. All items in the Quality Assurance Checklist are verified.
3. Actual visual rendering in a browser or preview container has been inspected for alignment, typographic balance, and responsive stability.
4. Zero visual clichés or unhandled component states remain.
