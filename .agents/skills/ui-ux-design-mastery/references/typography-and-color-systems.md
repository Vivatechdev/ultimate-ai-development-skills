# Typography & Color Architecture

A professional interface relies on rigorous mathematical foundations for typography and color. This reference provides concrete systems, modular scales, and accessibility formulas.

---

## 1. Typography Hierarchy & Modular Scales

### 1.1 The Golden Rules of Digital Typography
1. **Never use default tracking on large headings:** Heading sizes (>24px / 1.5rem) have too much default letter-spacing in digital fonts. Apply tight tracking (`-0.02em` to `-0.035em` or Tailwind `tracking-tight` / `tracking-tighter`).
2. **Always track out uppercase micro-copy:** Small labels, badges, or eyebrow tags (<13px uppercase) require positive letter spacing (`0.05em` to `0.1em` or Tailwind `tracking-wider` / `tracking-widest`) to maintain legibility.
3. **Inversely scale line-height with font-size:**
   - Giant display titles (48px+): Line-height `1.05` to `1.15`.
   - Section headers (24px - 36px): Line-height `1.2` to `1.3`.
   - Body copy (14px - 18px): Line-height `1.5` to `1.65`.
   - Compact table/caption text (11px - 13px): Line-height `1.35` to `1.45`.
4. **Enforce optimal line length (measure):** Body text paragraphs must never exceed 65-75 characters per line (`max-w-prose` or ~640px). Wide single-column paragraphs fatigue the eye.

### 1.2 Recommended Modular Scale (Major Second 1.125 for Dashboards / Minor Third 1.2 for Content)

| Level | Size (px / rem) | Line Height | Tracking | Recommended Weight | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 2XL** | 64px / 4.0rem | 1.05 | -0.035em | Bold / SemiBold (700/600) | Editorial hero title, landing page lead |
| **Display XL** | 48px / 3.0rem | 1.12 | -0.025em | Bold / SemiBold (700/600) | Major section lead |
| **Heading 1** | 36px / 2.25rem | 1.20 | -0.02em | SemiBold (600) | Page titles, primary card heroes |
| **Heading 2** | 24px / 1.5rem | 1.28 | -0.015em | SemiBold / Medium (600/500) | Modal headers, widget section titles |
| **Heading 3** | 20px / 1.25rem | 1.35 | -0.01em | SemiBold / Medium (600/500) | Card titles, nested sub-sections |
| **Body Large** | 18px / 1.125rem | 1.55 | 0 | Regular / Medium (400/500) | Intro / summary paragraphs, article lead |
| **Body Base** | 15px-16px / 1.0rem | 1.60 | 0 | Regular (400) | Primary body text, descriptions |
| **Body Small** | 13px-14px / 0.875rem | 1.50 | 0 | Regular / Medium (400/500) | Form helper text, table cells, comments |
| **Caption / Tag**| 11px-12px / 0.75rem | 1.40 | +0.05em | Medium / SemiBold (500/600) | Eyebrow badges, timestamps, data keys |

### 1.3 Production-Tested Free & Open Font Pairings

| Aesthetic / Persona | Primary Display / Headings | Primary Body | Monospace / Accents |
| :--- | :--- | :--- | :--- |
| **Modern Engineering / Dev** | `Geist` or `Inter` | `Geist` or `Inter` | `Geist Mono` or `JetBrains Mono` |
| **High-End Editorial** | `Newsreader` or `Fraunces` | `Plus Jakarta Sans` or `Inter` | `Space Mono` |
| **Swiss / Modern Architecture** | `Space Grotesk` or `Switzer` | `Inter` or `Geist` | `JetBrains Mono` |
| **Enterprise B2B SaaS** | `Plus Jakarta Sans` | `Inter` | `Roboto Mono` |
| **Human & Approachable** | `Outfit` or `Manrope` | `Public Sans` or `Inter` | `DM Mono` |
| **Luxury / Modern Heritage** | `Cormorant Garamond` | `Montserrat` (light, tracked) | N/A |
| **Neo-Brutalist** | `Syne` or `Archivo Black` | `DM Sans` | `Space Mono` |

---

## 2. Color System Architecture

Avoid random hex codes scattered across CSS or HTML. Define structured semantic tokens.

### 2.1 The 60-30-10 Rule in Digital UI
- **60% Dominant Neutral:** Backgrounds, canvas, main cards, whitespace (`surface`, `background`, `canvas`).
- **30% Structural Secondary:** Typography, structural borders, card headers, icons, secondary controls (`text-primary`, `text-secondary`, `border-subtle`).
- **10% Intentional Accent:** Primary interactive trigger, active state, focused highlight (`primary`, `accent`).
*Never create interfaces where saturated primary colors coat 50% of the screen.*

### 2.2 Semantic Color Hierarchy Tokens

```css
:root {
  /* Surface & Canvas */
  --bg-canvas: #FAFAFA;          /* Page background */
  --bg-surface: #FFFFFF;         /* Card / container surface */
  --bg-surface-elevated: #FFFFFF;/* Popover / modal surface */
  --bg-surface-hover: #F4F4F5;   /* Interactive item hover state */
  
  /* Text & Content */
  --text-primary: #09090B;       /* Primary headlines, values, buttons */
  --text-secondary: #52525B;     /* Subtitles, labels, navigation items */
  --text-tertiary: #71717A;      /* Timestamps, disabled text, hints */
  --text-inverse: #FFFFFF;       /* Text on primary accent or dark surface */

  /* Borders & Dividers */
  --border-subtle: #F4F4F5;      /* Inset dividers, table row lines */
  --border-default: #E4E4E7;     /* Standard card, input, and panel borders */
  --border-strong: #A1A1AA;      /* Active state borders, input focus */

  /* Brand & Functional Accents */
  --accent-primary: #18181B;     /* Neutral high-contrast primary or brand hex */
  --accent-primary-hover: #27272A;
  --accent-secondary: #0284C7;   /* Complementary functional action */

  /* Semantic Feedback Status */
  --status-success: #15803D;     /* Confirmed, active, healthy */
  --status-success-bg: #F0FDF4;
  --status-warning: #B45309;     /* Caution, pending */
  --status-warning-bg: #FFFBEB;
  --status-danger: #B91C1C;      /* Error, destructive, critical */
  --status-danger-bg: #FEF2F2;
  --status-info: #0369A1;        /* Notice, informative */
  --status-info-bg: #F0F9FF;
}
```

### 2.3 Strict WCAG 2.2 Contrast Standards
- **Normal Body Text (<18px / <14px bold):** Minimum contrast ratio **4.5:1** against the background.
- **Large Text (>=18px / >=14px bold):** Minimum contrast ratio **3.0:1** against the background.
- **UI Components & Graphical Objects:** Interactive controls, form boundaries, checkboxes, and icons must have at least **3.0:1** contrast against adjacent background colors.
- **Focus Rings:** Must be clearly visible (minimum 2px thickness with at least 3.0:1 contrast against both the button and the surrounding background).
