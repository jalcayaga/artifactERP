---
name: ui_ux_refinement
description: Principles for premium dark-mode UI/UX design including glassmorphism, high-density layouts, and micro-interactions.
---

# UI/UX Refinement Skill

This skill provides the design philosophy and technical guidelines for the "Premium Edition" aesthetic of Artifact ERP. It focuses on creating high-fidelity, immersive dark-mode interfaces.

## When to use
- Perfecting the visual appeal of existing components.
- Designing new high-impact views (POS, Dashboards, Landing Pages).
- Scaling interfaces for power users (High-Density layouts).

## Design Philosophy: "Premium Deep-Sea"
The aesthetic is based on depth, motion, and clarity.

### 1. Depth & Layers (Glassmorphism)
- **Backgrounds**: Use deep dark gradients (`slate-950` to `slate-900`) instead of flat black.
- **Surface**: Use semi-transparent backgrounds with blurs.
  - Class: `bg-[#0b1120]/60 backdrop-blur-xl border border-white/5`
- **Glows**: Use subtle pulsing glows for active states or focal points.
  - Class: `bg-blue-400/20 rounded-full blur-xl animate-pulse`

### 2. High-Density Layouts
When scaling for "Compact Mode":
- **Efficiency**: Prioritize fitting more data over white space.
- **Typography**: Scale down to 8pt-9pt for metadata, but keep it bold (`font-black` or `font-extrabold`) and capitalized for readability.
- **Gaps**: Use `gap-2` to `gap-4` for compact grids; avoid the default `gap-8` in high-density views.

### 3. Micro-Interactions
Every action must feel "alive":
- **Hover**: Subtle translation (`hover:-translate-y-1`) and shadow expansion.
- **Active**: Scale reduction (`active:scale-95`) to simulate physical pressure.
- **Animations**: Use `duration-500` for general transitions and `duration-700` for image transforms to make them feel "heavy" and premium.

### 4. Color Palette (Premium Accents)
- **Primary**: Blue-600 to Indigo-700 gradients for buttons.
- **Success**: Emerald/Green with glowing shadow (`shadow-[0_0_15px_rgba(34,197,94,0.3)]`).
- **Danger**: Red/Rose with soft backgrounds (`bg-red-500/5`).
- **Placeholder**: Slate-500/60 for inputs in dark mode.

## Implementation Rules
- **No Overlapping Labels**: Ensure `Select` or `Input` labels don't overlap borders in compact modes. Use external labels for 8pt-9pt typography.
- **Contrast**: Use high-contrast colors (White/Cyan/Gold) for primary data points like prices and totals.
- **Refinement**: Always add a "Visual Top Accent" (thin 1px colored line) to important sidebars or cart panels.

## Checklist for Review
- [ ] Does it use `backdrop-blur`?
- [ ] Are borders low-contrast (`border-white/5` or `border-white/10`)?
- [ ] Is the active state physically interactive (scale/glow)?
- [ ] Is typography hierarchy clear even at small sizes?
