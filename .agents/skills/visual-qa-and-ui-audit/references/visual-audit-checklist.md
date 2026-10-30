# Comprehensive Visual QA & UI Audit Checklist

Every web application or page must pass this rigorous 14-point audit across all 5 mandatory target viewport widths prior to deployment.

---

## The 5 Mandatory Viewport Breakpoints

| Viewport Width | Device Archetype | Key Inspection Focus |
| :--- | :--- | :--- |
| **375px** | Compact Mobile (iPhone SE, Galaxy A-series) | Critical width: horizontal overflow, text wrapping, minimum 44px tap targets, modal/drawer fit. |
| **390px** | Standard Modern Mobile (iPhone 12-16) | Standard mobile layout: navigation drawer, card padding, form input usability, sticky bottom bars. |
| **768px** | Tablet Portrait (iPad Mini, iPad 10th Gen) | Multi-column collapses, tablet navigation switches, grid re-alignments, table horizontal scroll. |
| **1280px** | Compact Desktop / Ultrabook (MacBook Air 13") | Desktop navigation, full grid display, sidebar layout, whitespace balance. |
| **1440px** | Standard Desktop / Widescreen Monitor | Max-width constraints (`max-w-7xl`), center alignment, visual balance on wide viewports. |

---

## 14-Point Category Audit Matrix

### 1. Layout Consistency & Structural Integrity
- [ ] Content containers respect max-width boundaries (`max-w-screen-*` or fixed grid boundaries) on wide viewports (1440px+).
- [ ] Columns break and stack cleanly without erratic heights or orphan elements.
- [ ] Sticky headers, sidebars, or floating action bars do not obscure critical content or form controls.
- [ ] Z-index stacking hierarchy is deterministic (Modals: 50+, Drawers: 40+, Sticky headers: 30+, Dropdowns: 20+, Canvas: 0).

### 2. Typography & Text Rendering
- [ ] Display titles wrap gracefully without hyphenating awkwardly or leaving single-letter orphan words on new lines.
- [ ] Text line-heights prevent ascender/descender collisions when headings wrap to multiple lines.
- [ ] No text clipping or unexpected ellipsis (`text-ellipsis`) truncating essential information.
- [ ] Web fonts load without jarring Cumulative Layout Shifts (CLS); fallback fonts have matching metric overrides.
- [ ] Long-form body paragraphs do not exceed 75 characters per line on desktop.

### 3. Spacing & Spatial Rhythm
- [ ] Margins and paddings follow a consistent 4px / 8px spatial grid.
- [ ] Section-to-section vertical rhythm is balanced (e.g. 64px - 96px on desktop, 40px - 48px on mobile).
- [ ] Sibling cards or grid tiles share identical vertical and horizontal padding.
- [ ] No unintended negative margins causing accidental overlaps or clipping.

### 4. Precision Alignment
- [ ] Inline icons align vertically to the optical center of adjacent text labels (`items-center` or flex baseline alignment).
- [ ] Form labels align precisely with their corresponding inputs.
- [ ] Grid items maintain crisp vertical alignment lines across the entire page layout.
- [ ] Number columns in data tables are right-aligned; text columns are left-aligned.

### 5. Image & Media Fidelity
- [ ] Images maintain their natural aspect ratio without stretching, squishing, or distortion (`object-cover` or `object-contain`).
- [ ] High-DPI / Retina displays render sharp raster assets; SVGs are used for logos, icons, and diagrams.
- [ ] Responsive `<picture>` or `srcset` rules deliver appropriate image resolutions per viewport width.
- [ ] Broken image fallback triggers a clean placeholder container rather than a broken icon graphic.

### 6. Colour Contrast (WCAG 2.2 AA)
- [ ] Normal body text (<18px / <14px bold) achieves at least **4.5:1** contrast against its background.
- [ ] Large headings (>=18px / >=14px bold) achieve at least **3.0:1** contrast.
- [ ] Interactive UI components (borders, icons, checkboxes, switches) achieve at least **3.0:1** contrast against adjacent surfaces.
- [ ] Placeholder text in form inputs remains legible (minimum **3.0:1** contrast) without being mistaken for filled input.

### 7. Navigation Architecture
- [ ] Mobile navigation hamburger toggles smoothly; drawer traps keyboard focus while open.
- [ ] Closing the mobile navigation drawer restores focus to the toggle button.
- [ ] Sticky headers remain stable upon scroll without jitter or backdrop-filter flickering.
- [ ] Active navigation links have explicit, unambiguous visual indicators (underline, pill background, or high-contrast font weight).

### 8. Responsive Adaptability & Breakpoints
- [ ] No layout breaks or overlapping text at transition widths (between 640px-768px and 1024px-1280px).
- [ ] Multi-column tables collapse into responsive cards or provide explicit horizontal scroll affordance with sticky primary columns.
- [ ] Modals and dialogs adjust their maximum width and padding to fit comfortably on 375px screens.

### 9. Forms & Validation States
- [ ] Every form field has an explicitly linked `<label for="id">` or `aria-label`.
- [ ] Required fields are visibly flagged with an asterisk or text badge.
- [ ] Error messages appear directly below the offending input with descriptive guidance (never color alone).
- [ ] Field borders transition cleanly to an error token (crimson/red) and set `aria-invalid="true"`.
- [ ] Form submission disables the submit button and renders an inline spinner to prevent duplicate requests.

### 10. Buttons & Interactive Controls
- [ ] All clickable and touchable targets meet the minimum **44 × 44 CSS pixel** touch target requirement on touch viewports (375px/390px/768px).
- [ ] Hover states provide subtle brightness or surface feedback without shifting layout dimensions.
- [ ] Active/pressed states provide tactile physical feedback (`translate-y-px` or slight scale down).
- [ ] Every interactive control displays a high-contrast 2px `:focus-visible` ring with offset when navigated via keyboard.

### 11. Loading States & Feedback
- [ ] Async actions trigger explicit loading indicators (spinners, skeletons, progress bars).
- [ ] Skeletons mimic the exact dimensions and layout of the incoming data to eliminate Cumulative Layout Shift (CLS).
- [ ] Buttons in flight show disabled styling (`cursor-not-allowed`, `opacity-60`) and prevent repeat clicks.

### 12. Error States & Fault Tolerance
- [ ] Server/network disconnects render a clear, non-technical error container with an actionable "Retry" button.
- [ ] Form-level error alerts summarize errors with focus shift to the summary container.
- [ ] 404 and unhandled boundary errors provide breadcrumb paths back to safe application views.

### 13. Empty States & Zero-Data Views
- [ ] Empty tables, search results, or inbox feeds render an intentional empty state.
- [ ] Empty state includes a helpful icon/illustration, a clear explanation of why no data is present, and a primary CTA to create or seed data.

### 14. Horizontal Overflow Prevention
- [ ] `document.documentElement.scrollWidth <= window.innerWidth` across all 5 target viewports.
- [ ] Zero accidental horizontal scrollbars on mobile viewports.
- [ ] Unbounded preformatted code blocks, data tables, or long URLs use `overflow-x-auto` or `break-words`.

