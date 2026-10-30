# Design System Inspection, Extension & Governance

Introducing a design system into an existing application requires deep restraint. Never wipe out existing styling or force a wholesale rewrite without an explicit mandate.

---

## 1. Pre-Flight Inspection Protocol

Before authoring a single token or component, audit the host project:

### 1.1 CSS Architecture Discovery
- **Tailwind CSS:** Inspect `tailwind.config.{js,ts,mjs}`. Are there existing color extensions, font families, or custom plugins?
- **CSS Custom Properties:** Scan root stylesheets (`globals.css`, `index.css`, `variables.css`) for existing `:root` variables.
- **Component Libraries:** Check `package.json` for Radix UI, Shadcn UI, Headless UI, Mantine, Chakra, MUI, or Bootstrap.
- **Icon Libraries:** Identify installed icon suites (Lucide, Heroicons, Phosphor, FontAwesome). Do not install a second icon library if one already exists.

### 1.2 The Conflict Prevention Matrix

| Scenario | What Junior Engineers Do (Anti-Pattern) | What Senior Architects Do |
| :--- | :--- | :--- |
| **Existing Tailwind Config** | Overwrite `theme.extend` with a brand-new incompatible palette, breaking existing pages. | Map design system tokens into existing theme aliases additively, or namespace new tokens (`--ds-surface-canvas`). |
| **Inconsistent Hex Codes in Codebase** | Refactor all 200 files immediately in a giant, breaking pull request. | Introduce semantic tokens in new/refactored components while maintaining legacy aliases as backwards-compatible shims. |
| **Multiple Font Families in Use** | Delete fonts and install Google Fonts links without verifying licensing or bundle size. | Document primary and fallback font stacks; consolidate font declarations through central CSS variables. |

---

## 2. Additive Extension Guidelines

When extending an established design system, observe these four rules:

1. **Principle of Non-Destructive Addition:** Adding a new component, variant, or token must never change the default appearance of existing instances.
   - *Example:* Adding an `outline` button variant must not modify the default `primary` variant styles or padding.
2. **Explicit Fallbacks:** When introducing a new semantic token, provide a fallback to an established primitive token:
   ```css
   color: var(--ds-text-brand-subtle, var(--ds-color-neutral-600));
   ```
3. **Compound Token Evolution:** If an existing token proves too coarse, subdivide it additively:
   - Existing: `--space-card: 24px`
   - Extended: `--space-card-compact: 16px`, `--space-card-relaxed: 32px` (keep `--space-card: 24px` as an alias).

---

## 3. Deprecation & Migration Lifecycle

When phasing out legacy components or deprecated tokens, follow the 4-phase deprecation cycle:

```
[ Phase 1: Deprecate & Document ]
Mark with JSDoc @deprecated tag. Provide explicit migration target.
               │
               ▼
[ Phase 2: Non-Breaking Warning ]
Console warning in development mode (dev-only flag).
               │
               ▼
[ Phase 3: Automated Codemod / Migration ]
Provide find-and-replace script or codemod for project teams.
               │
               ▼
[ Phase 4: Final Removal ]
Remove only in the next major semantic version (X.0.0).
```

### Deprecation JSDoc Template:
```typescript
/**
 * @deprecated Use `<Button variant="secondary" />` instead.
 * `FlatButton` will be removed in version 2.0.0.
 * @see https://design.example.com/components/button
 */
export function FlatButton(props: ButtonProps) {
  return <Button variant="secondary" {...props} />;
}
```

