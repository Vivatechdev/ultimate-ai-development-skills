# Component Composition & Architectural Patterns

High-quality design systems prioritize compositional flexibility, accessibility primitives, and strict encapsulation. Avoid monolithic mega-components with dozens of boolean flags (e.g. `<Button isSmall hasIcon isSubmit isBlueWithBorder />`).

---

## 1. The Headless Primitive Pattern

Decouple **behavior and accessibility** from **visual presentation**:

```text
┌────────────────────────────────────────────────────────┐
│               COMPONENT ARCHITECTURE                   │
├────────────────────────────────────────────────────────┤
│  Layer 3: Styled Presentational Component              │
│  (Design tokens, variants, Tailwind / CSS modules)     │
│                         ▲                              │
│  Layer 2: Compound Composition Pattern                 │
│  (Dialog.Trigger, Dialog.Portal, Dialog.Content)       │
│                         ▲                              │
│  Layer 1: Headless Behavioral Primitive                │
│  (Keyboard traps, WAI-ARIA states, focus management)   │
└────────────────────────────────────────────────────────┘
```

- **Layer 1 (Behavior):** Manages key events (Enter, Space, Escape, Arrow keys), ARIA roles, focus restoration, and screen-reader announcements.
- **Layer 2 (Composition):** Assembles slots and sub-components via context without prop-drilling.
- **Layer 3 (Presentation):** Applies tokens, variant classes, responsive styles, and animations.

---

## 2. Variant Architecture with Class Variance Authority (CVA)

When authoring components in React, Vue, or modern frontend stacks, manage variants cleanly through a matrix:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  // Base styles: applied to all variants
  'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-interactive-primary text-text-inverse hover:bg-interactive-primary-hover focus-visible:ring-interactive-primary',
        secondary: 'bg-surface-card text-text-primary border border-border-default hover:bg-surface-canvas focus-visible:ring-border-strong',
        ghost: 'bg-transparent text-text-muted hover:bg-surface-canvas hover:text-text-primary focus-visible:ring-border-strong',
        destructive: 'bg-status-danger text-text-inverse hover:bg-red-700 focus-visible:ring-status-danger'
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2.5'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);
```

---

## 3. Accessible Form Control Anatomy

Every form field in the design system must follow this compound structure:

```html
<!-- Form Field Group -->
<div class="form-field space-y-1.5" data-state="idle">
  <!-- 1. Explicit Label with Required Indicator -->
  <label for="tenant-slug" class="block text-xs font-semibold uppercase tracking-wider text-text-muted">
    Organization Identifier <span class="text-status-danger" aria-hidden="true">*</span>
  </label>

  <!-- 2. Interactive Input Control Container (for adornments/icons) -->
  <div class="relative flex items-center">
    <input
      id="tenant-slug"
      name="tenant-slug"
      type="text"
      required
      aria-describedby="tenant-slug-desc tenant-slug-error"
      aria-invalid="false"
      class="w-full h-10 px-3.5 text-sm bg-surface-card border border-border-default text-text-primary rounded-md placeholder:text-text-subtle focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-border-strong transition-colors"
      placeholder="e.g. acme-logistics"
    />
  </div>

  <!-- 3. Contextual Description / Hint -->
  <p id="tenant-slug-desc" class="text-xs text-text-muted">
    This unique handle will form your custom sub-domain URL.
  </p>

  <!-- 4. Dynamic Validation Error Notice (Accessible by screen readers) -->
  <p id="tenant-slug-error" class="hidden text-xs font-medium text-status-danger" role="alert">
    Identifier must contain lowercase alphanumeric characters only.
  </p>
</div>
```

---

## 4. Modal & Overlay Architecture

Modals, drawers, and popovers require robust portal and focus lifecycle management:

1. **DOM Portal:** Always render overlays in a container outside the main app root (`document.body`) to prevent parent CSS clipping (`overflow-hidden`) and z-index fighting.
2. **Focus Trapping:** When the overlay mounts, trap Tab/Shift+Tab focus cycling strictly inside the dialog.
3. **Focus Restoration:** When the overlay dismisses, return keyboard focus to the triggering element.
4. **Escape Dismissal:** Pressing `Escape` must close the top-most active dialog immediately.
5. **Scroll Locking:** Lock background body scroll (`overflow: hidden` on `document.body`) while the overlay is mounted to prevent dual-scrolling artifacts.

