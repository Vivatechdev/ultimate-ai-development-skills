# Component Interaction & State Architecture

Great UI design lives in the details of interactive states. AI-generated interfaces frequently fail by delivering "flat mockups" that break when clicked, hovered, or loaded with missing data.

Every interactive component designed under this skill must account for all operational states.

---

## 1. The 8 Mandatory Component States

Never ship an interactive component without defining these states:

```
[ Default ] ──> [ Hover ] ──> [ Active / Pressed ]
     │               │
     ├──> [ Focus-Visible ] (Keyboard navigation)
     ├──> [ Loading / Pending ] (Async trigger)
     ├──> [ Disabled / Inactive ] (Permission / validation lock)
     ├──> [ Error / Invalid ] (Form validation)
     └──> [ Empty State ] (Zero data items)
```

| State | Purpose | Required Visual Indicators |
| :--- | :--- | :--- |
| **Default** | Resting appearance | Clear affordance that the item is interactive; standard contrast. |
| **Hover** | Cursor proximity | Subtle brightness shift (5-8%), slight surface tint, or elevation lift (1px). Never radically change dimensions or cause layout shifts. |
| **Active / Pressed** | Momentary click/touch | Tactile downward compression (`scale(0.98)` or `translate-y-px`) and deeper surface shade. |
| **Focus-Visible** | Keyboard accessibility | High-contrast 2px outline or ring with offset (`ring-2 ring-primary ring-offset-2`). Must not appear on mouse clicks if using `:focus-visible`. |
| **Loading** | Action in flight | Maintain button dimensions (`min-w`), replace text or icon with a non-jarring spinner, disable pointer events, set `aria-busy="true"`. |
| **Disabled** | Action unavailable | `opacity-50`, `cursor-not-allowed`, removed hover/active styles, `aria-disabled="true"`. |
| **Error** | Invalid input | Red/crimson hairline border, explicit descriptive text below the field (never just color alone), `aria-invalid="true"`. |
| **Empty State** | Zero data loaded | Friendly, helpful illustration or icon, concise explanation, and a clear call-to-action (CTA) to populate data. |

---

## 2. Motion & Micro-Interactions Standards

### 2.1 Physics & Durations
- **Micro-transitions (buttons, links, inputs, icons):** `150ms` - `200ms` using `ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)`. Anything slower feels sluggish.
- **Surface transitions (modals, dropdown menus, drawers):** `200ms` - `300ms` using an authentic spring or decelerate curve.
- **Large page transitions:** Keep minimal; avoid blocking user interaction.

### 2.2 Hardware-Accelerated Properties Only
Animate **only** composite properties:
- `transform` (`translate`, `scale`, `rotate`)
- `opacity`

**Never animate:** `width`, `height`, `margin`, `padding`, `top`, `left`, `right`, `bottom`. Animating layout properties triggers costly browser reflows and stutters.

### 2.3 Reduced Motion Compliance
Always respect users who have requested reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 3. Core Component Recipes

### 3.1 Primary & Secondary Buttons
```html
<!-- Primary Button -->
<button class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150">
  <span>Create Project</span>
</button>

<!-- Secondary / Outline Button -->
<button class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-800 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150">
  <span>View Documentation</span>
</button>
```

### 3.2 Form Input with Full State Support
```html
<div class="space-y-1.5">
  <label for="workspace-name" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
    Workspace Identifier <span class="text-rose-600">*</span>
  </label>
  <div class="relative">
    <input
      type="text"
      id="workspace-name"
      name="workspace-name"
      placeholder="e.g. acme-corp"
      class="w-full px-3.5 py-2 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-md placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors duration-150"
      aria-describedby="workspace-hint"
    />
  </div>
  <p id="workspace-hint" class="text-xs text-neutral-500">
    Used to generate your secure tenant URL. Letters, numbers, and hyphens only.
  </p>
</div>
```

### 3.4 Accessible Tabbed Information Architecture (WAI-ARIA Pattern)
```html
<div class="space-y-4">
  <!-- Tab List -->
  <div role="tablist" aria-label="System Metrics" class="flex gap-2 border-b border-neutral-200">
    <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1" class="px-4 py-2 text-sm font-medium border-b-2 border-neutral-900 text-neutral-900 -mb-px">
      Active Nodes
    </button>
    <button role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" class="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-neutral-500 hover:text-neutral-800 -mb-px">
      Throughput History
    </button>
  </div>

  <!-- Tab Panels -->
  <div id="panel-1" role="tabpanel" aria-labelledby="tab-1" class="p-4 bg-white border border-neutral-200 rounded-md">
    <p class="text-sm text-neutral-700">Cluster node status...</p>
  </div>
  <div id="panel-2" role="tabpanel" aria-labelledby="tab-2" class="hidden p-4 bg-white border border-neutral-200 rounded-md">
    <p class="text-sm text-neutral-700">Throughput charts and telemetry...</p>
  </div>
</div>

### 3.5 Data Table with Optical Balance
- Table headers should be compact, uppercase, with positive letter spacing (`tracking-wider`), and secondary text tone (`text-neutral-500`).
- Numerical columns must be right-aligned and use `font-variant-numeric: tabular-nums`.
- Rows should have a subtle hover highlight (`hover:bg-neutral-50/75`).
- Separate rows with crisp hairline dividers (`divide-y divide-neutral-200`).
```
