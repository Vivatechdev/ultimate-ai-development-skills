# Viewport Testing Matrix & Breakpoint Guidelines

This document details the operational requirements, failure modes, and verification methods across the five standard viewport widths.

---

## 1. Viewport Specification Table

| Viewport Width | Typical Height | Device Class / Reference | Primary Architecture Target | Input Mode |
| :--- | :--- | :--- | :--- | :--- |
| **375px** | 667px - 812px | Compact Mobile (iPhone SE, iPhone 8, Galaxy A) | Single-column, vertical stacking, collapsed navigation drawer, sticky primary CTA | Touch (44x44px min hit targets) |
| **390px** | 844px - 852px | Modern Standard Mobile (iPhone 12/13/14/15/16) | Single-column, generous vertical thumb zone, full-width cards, edge-to-edge media | Touch (44x44px min hit targets) |
| **768px** | 1024px | Tablet Portrait (iPad Mini, iPad 10th Gen) | 2-column grids, hybrid navigation, scrollable tables, adaptive split panes | Mixed (Touch + Pointer) |
| **1280px** | 800px | Compact Desktop / Laptop (MacBook Air 13") | 3-to-4 column grids, horizontal navigation bar, persistent sidebars, modal dialogs | Pointer (Hover + Focus rings) |
| **1440px** | 900px | Standard Widescreen (Desktop Monitors, iMac) | Contained container (`max-w-7xl`), multi-pane operational dashboards, wide data tables | Pointer (Hover + Focus rings) |

---

## 2. Breakpoint Failure Modes & Inspection Rules

### 2.1 The 375px Boundary (Compact Mobile Stress Test)
- **Top Failure Modes:**
  1. *Horizontal Overflow:* Fixed-width elements (e.g., `w-[400px]`, unconstrained code blocks, large tables) force horizontal scrollbars.
  2. *Heading Truncation / Collisions:* Large font sizes (e.g., `text-5xl` or >36px) wrap into single-character lines or collide with adjacent badges.
  3. *Unreachable Controls:* Sticky headers or cookie banners consume more than 40% of the visible viewport height.
- **Verification Rule:** Execute the overflow detection script. Confirm that `document.documentElement.scrollWidth === 375`.

### 2.2 The 390px Boundary (Modern Mobile Standard)
- **Top Failure Modes:**
  1. *Sub-44px Tap Targets:* Icon buttons or inline text links spaced too closely, leading to accidental touch triggers.
  2. *Thumb-Zone Inaccessibility:* Critical actions positioned exclusively in the top-right corner without mobile sticky alternatives.
- **Verification Rule:** Measure computed bounding client rects of all interactive elements: `rect.width >= 44 && rect.height >= 44`.

### 2.3 The 768px Boundary (Tablet Transition Zone)
- **Top Failure Modes:**
  1. *Awkward 2-Column Stacking:* 3-column desktop grids awkwardly collapsed into 2 columns with an orphan card centered on the second row.
  2. *Premature Desktop Menu:* Showing the full desktop navigation menu before there is sufficient horizontal clearance, causing links to wrap onto a second line.
- **Verification Rule:** Verify navigation bar at exactly 768px width. Confirm menu items do not collide with search inputs or CTA buttons.

### 2.4 The 1280px Boundary (Compact Laptop)
- **Top Failure Modes:**
  1. *Sidebar Collapse / Overcrowding:* Multi-pane applications leaving insufficient room for primary content area.
  2. *Vertical Clipping in Modals:* Fixed-height dialogs clipping buttons or content on 800px screen heights.
- **Verification Rule:** Check modal dialogs and drawers with sample data to ensure content remains scrollable within the dialog body.

### 2.5 The 1440px Boundary (Widescreen Balance)
- **Top Failure Modes:**
  1. *Unconstrained Stretching:* Content spanning the full 1440px without a `max-w` constraint, resulting in unreadable 180-character line lengths.
  2. *Awkward Centering Gaps:* Hero sections floating detached with massive, unintended negative margins on either side.
- **Verification Rule:** Verify that main content containers apply `max-w-6xl`, `max-w-7xl`, or equivalent responsive boundaries with `mx-auto`.

