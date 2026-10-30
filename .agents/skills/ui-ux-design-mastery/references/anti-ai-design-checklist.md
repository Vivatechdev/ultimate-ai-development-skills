# Anti-AI Design & Cliché Elimination Checklist

AI-generated interfaces suffer from an easily recognizable "AI Slop" aesthetic: predictable color ramps, floating glass cards, meaningless blobs, and repetitive layout blocks. Use this checklist as a rigorous gate during design planning and before finalizing any interface.

---

## 1. Visual Clichés to Eliminate

| Cliché Pattern | Why AI Agents Default to It | What Senior Designers Do Instead |
| :--- | :--- | :--- |
| **Purple / Indigo / Cyan Gradient Ramp** | Over-represented in synthetic training datasets and generic landing page templates. | Establish a deliberate, brand-specific palette rooted in the product's industry, mood, and target audience (e.g., deep obsidian with warm amber, editorial forest green with stone neutrals, or crisp monochromatic Swiss typography). |
| **Pervasive Glassmorphism** | Agents apply `backdrop-blur` and semi-transparent white borders on everything to fake depth. | Use intentional layer hierarchy: clean solid surfaces, crisp 1px borders with precise contrast ratios (`border-neutral-200` / `border-neutral-800`), and restrained elevation shadows. |
| **Floating Gradient Blobs & Orbs** | Used as lazy background filler to distract from weak layout structure. | Build strong compositional geometry: purposeful grid dividers, editorial whitespace, asymmetrical typography, or authentic media/photography. |
| **Identical 3-Column Feature Cards** | The universal default layout for features, usually containing an icon inside a rounded square, a bold title, and two lines of filler text. | Vary information architecture based on content value: 2-column asymmetric hero features, editorial lists, interactive comparison tables, horizontal step-flows, or typographic callouts. |
| **Centered "Everything" Hero** | Eyebrow pill badge + centered H1 + generic paragraph + two pill buttons. | Ground the hero with an asymmetric composition: left-aligned editorial lead with structured right-hand product artifacts, contextual metadata panels, or typography-dominant headlines. |
| **Random Emojis & Decorative Icons in Features** | Emojis in feature titles (`🚀 Fast`, `🔒 Secure`, `💡 Smart`) or decorative icons in colored rounded squares with no semantic link. | Use icons strictly for unambiguous navigation and system status. Let typography, data metrics, and clear copy carry meaning. **Note:** Distinguish pictographic emojis (prohibited in feature titles) from authentic typographic and scientific symbols (`—`, `→`, `&mu;s`, `&plusmn;`, `&Delta;`), which enhance technical credibility when used appropriately. |
| **Excessive Soft Outer Shadows** | Diffuse `shadow-2xl` applied to flat cards on white backgrounds. | Use subtle, multi-layered elevation (e.g. ambient 1px rim + 2px soft drop) or crisp hairline borders without shadows. Reserve elevation for elevated interactive surfaces (dropdowns, dialogs, drawers). |
| **Unbounded Rounded Corners (`rounded-3xl` on everything)** | Over-rounding every card, container, and button removes visual discipline and makes corporate tools look like children's toys. | Match radius to design archetype: sharp (`0px` to `2px`) for Swiss/editorial/data-heavy; restrained (`4px` to `8px`) for modern SaaS; friendly (`10px` to `12px`) for consumer apps. Maintain proportional inner vs. outer radii. |
| **Unnecessary Animations on Every Scroll** | Fading up every element on viewport entry, causing lag and visual restlessness. | Animate only for feedback, state transitions, and user delight (micro-interactions on hover, modal entries, layout shifts). Page content should load instantly and legibly. |

---

## 2. Copy & Typography Clichés to Eliminate

- **Generic Buzzword Headlines:** Avoid *"Empower your workflow with AI-driven insights"*, *"Supercharge your team's productivity"*, *"The future of [X] is here"*.
- **The "Magic Pill" Eyebrow Badge:** Avoid the ubiquitous `✨ Introducing AI 2.0 ✨` badge floating above every header unless announcing a specific, genuine release.
- **Empty Metric Bragging:** Avoid three centered stat boxes saying *"99.9% Uptime"*, *"10k+ Users"*, *"5x Faster"* unless tied to verified case studies or interactive data.

---

## 3. Pre-Flight Anti-AI Slop Audit

Before approving any UI deliverable, ask:
1. **Could this template be used interchangeably for a crypto wallet, an HR platform, and a dental clinic?** If yes, the design lacks brand personality.
2. **Remove all gradients and glassmorphism. Does the design still hold up?** If the layout collapses into an unreadable mess, the underlying visual hierarchy is flawed.
3. **Are the fonts Inter or Roboto with zero letter-spacing adjustments?** Professional typography requires intentional scale, optical tracking, and deliberate pairing.
4. **Is every card identical in size and weight?** Great interfaces use varied scale to guide the eye toward primary actions and key insights.
