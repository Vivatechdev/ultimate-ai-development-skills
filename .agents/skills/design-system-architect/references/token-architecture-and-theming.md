# Design Token Architecture & Theming Specification

A scalable design system decouples decisions from implementation through a structured, multi-tier token taxonomy conforming to the W3C Design Tokens Community Group (DTCG) specification.

---

## 1. The Three-Tier Token Architecture

Never map raw hex values directly to UI components. Organize tokens into three disciplined layers:

```
[ Tier 1: Global / Primitive Tokens ]
  Raw values: scales for color, spacing, fonts, radii
  (e.g., color.blue.600: #2563EB, space.4: 16px)
               │
               ▼
[ Tier 2: Semantic / Alias Tokens ]
  Contextual meaning: purpose, role, state
  (e.g., color.surface.primary: {color.blue.600}, color.text.body: {color.neutral.900})
               │
               ▼
[ Tier 3: Component-Scoped Tokens ]
  Bound to specific component interfaces
  (e.g., button.primary.background: {color.surface.primary})
```

### Tier 1: Global / Primitive Tokens
- Immutable, raw values representing the total design palette.
- Agnostic to purpose, theme, or component context.
- Example:
  ```json
  {
    "color": {
      "neutral": {
        "0": { "value": "#FFFFFF" },
        "50": { "value": "#F9FAFB" },
        "100": { "value": "#F3F4F6" },
        "200": { "value": "#E5E7EB" },
        "800": { "value": "#1F2937" },
        "900": { "value": "#111827" }
      },
      "blue": {
        "500": { "value": "#3B82F6" },
        "600": { "value": "#2563EB" },
        "700": { "value": "#1D4ED8" }
      }
    },
    "space": {
      "1": { "value": "4px" },
      "2": { "value": "8px" },
      "3": { "value": "12px" },
      "4": { "value": "16px" },
      "6": { "value": "24px" },
      "8": { "value": "32px" }
    }
  }
  ```

### Tier 2: Semantic / Alias Tokens
- Express intent, role, and UX purpose.
- Enable instantaneous theme switching (Light vs. Dark mode) without altering component definitions.
- Example:
  ```css
  :root {
    /* Light Theme Semantics */
    --surface-canvas: var(--color-neutral-50);
    --surface-card: var(--color-neutral-0);
    --surface-elevated: var(--color-neutral-0);
    
    --text-primary: var(--color-neutral-900);
    --text-muted: var(--color-neutral-600);
    --text-subtle: var(--color-neutral-400);

    --border-subtle: var(--color-neutral-200);
    --border-strong: var(--color-neutral-400);

    --interactive-primary: var(--color-blue-600);
    --interactive-primary-hover: var(--color-blue-700);
  }

  [data-theme="dark"] {
    /* Dark Theme Semantics (Alias Swap) */
    --surface-canvas: #0B0C0E;
    --surface-card: #121316;
    --surface-elevated: #18191E;

    --text-primary: #F9FAFB;
    --text-muted: #9CA3AF;
    --text-subtle: #6B7280;

    --border-subtle: #1F2228;
    --border-strong: #374151;

    --interactive-primary: #3B82F6;
    --interactive-primary-hover: #60A5FA;
  }
  ```

### Tier 3: Component Tokens (Use When Necessary)
- Protect high-reuse components from unexpected cascading global changes.
- Example: `--btn-padding-y: var(--space-2); --btn-radius: var(--radius-md);`

---

## 2. Spacing & Spatial Layout Grid

Standardize on an **8pt Base Grid** with a **4pt half-step sub-grid** for compact controls:

| Token Name | Rem Value | Pixel Value | Intended Usage |
| :--- | :--- | :--- | :--- |
| `--space-0-5` | 0.125rem | 2px | Micro-hairline offsets, badge internal padding |
| `--space-1` | 0.25rem | 4px | Compact gap between icon and label, inline badges |
| `--space-2` | 0.5rem | 8px | Button vertical padding (dense), input horizontal padding |
| `--space-3` | 0.75rem | 12px | Standard input vertical padding, card inner gutter |
| `--space-4` | 1.0rem | 16px | Base container padding, table cell vertical padding |
| `--space-6` | 1.5rem | 24px | Card internal padding, form row spacing |
| `--space-8` | 2.0rem | 32px | Section sub-headings, modal inner padding |
| `--space-12` | 3.0rem | 48px | Section vertical spacing (mobile) |
| `--space-16` | 4.0rem | 64px | Major section vertical rhythm (desktop) |

---

## 3. Elevation & Z-Index Architecture

Avoid ad-hoc `z-[9999]` or arbitrary `z-50` declarations across templates. Enforce a standardized scale:

```css
:root {
  /* Z-Index Hierarchy */
  --z-canvas: 0;
  --z-card: 1;
  --z-dropdown: 100;
  --z-sticky-header: 200;
  --z-drawer: 300;
  --z-modal-backdrop: 400;
  --z-modal-dialog: 410;
  --z-popover: 500;
  --z-toast: 600;
  --z-tooltip: 700;

  /* Elevation Shadows (Layered for Natural Depth) */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
}
```

---

## 4. Dark Theme Architecture & Inversion Traps

Avoid merely running an automated color invert filter. Senior systems engineers design dark modes deliberately:

1. **Never use `#000000` (Pure Black) for body canvas:** Pitch black creates harsh eye strain. Use charcoal, deep obsidian, or tinted slate (`#0B0C0E` or `#0F172A`).
2. **Elevate surfaces via lightness, not heavy drop shadows:**
   - On light mode: Cards use drop shadows to indicate elevation above the canvas.
   - On dark mode: Drop shadows are invisible against dark canvas. Instead, make the card background **lighter** as elevation increases:
     - Level 0 (Canvas): `#0B0C0E`
     - Level 1 (Card): `#131418`
     - Level 2 (Modal / Popover): `#1B1C22`
3. **Desaturate Accent Colors:** Highly saturated primary accents (e.g. vivid cobalt or crimson) vibrate painfully on dark backgrounds. Lighten and desaturate accents by 5–10% in dark mode to preserve readability and WCAG contrast.
4. **Hairline Border Contrast:** In dark mode, borders (`border-subtle`) must maintain subtle definition (`rgba(255, 255, 255, 0.08)` to `0.12`).

