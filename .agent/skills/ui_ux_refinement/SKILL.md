---
name: ui_ux_refinement
description: Principles for premium dark-mode UI/UX design including glassmorphism, high-density layouts, and micro-interactions.
---

# UI/UX Refinement Skill

This skill embodies the "Stitch" capability: creating stunning, premium, and functional user interfaces. It focuses on the specific aesthetic of ArtifactERP.

## Core Aesthetics
*   **Theme**: Deep Dark Mode (Slate/Zinc 950 base).
*   **Effects**: Glassmorphism (Backdrop blur), Subtle Gradients, Neon Accents (Green/Blue/Orange for status).
*   **Typography**: Inter (Clean, legible, variable weight).
*   **Layout**: High density, "Bento Grid" style for dashboards.

## Principles
1.  **Visual Hierarchy**: Use color, size, and weight to guide the eye. Primary actions must be distinct and immediately obvious.
2.  **Harmonious Iconography**: Standardize icon sizes (e.g., 20px for nav, 24px for rail). Ensure icons are vertically centered and have consistent stroke widths.
3.  **Intentional Spacing**: Avoid "standard" spacing. Use a consistent 4px or 8px grid. Ensure clear grouping of related elements (Proximity principle).
4.  **Sophisticated Hover States**: Interactions should feel "alive". Use subtle shadows (`shadow-lg`), scale transforms (`scale-[1.02]`), and backdrop-filter transitions.
5.  **Data Feedback**: Every interaction needs immediate feedback (Hover transformations, Active state persistence, Toasts for success/error, and Shimmer skeletons for loading).
6.  **Consistency**: Ensure the Login, Sidebar, and Dashboard share identical design tokens (Radii, Colors, Shadows).
7.  **Responsiveness**: Mobile-first foundation, with high-density desktop optimizations (Tooltips, Hover details).

## Workflow with Stitch
1.  **Visualize**: Describe the interface structure and intent.
2.  **Generate**: Use Stitch (or manual code) to scaffold the View.
3.  **Refine**: Apply specific Tailwind classes for the "Premium" feel (e.g., `backdrop-blur-md`, `border-white/10`).
4.  **Iterate**: User feedback loop for layout adjustments.

## Checklist for New Screens
*   [ ] Does it look "Premium"? (No default browser styles).
*   [ ] Is it responsive?
*   [ ] Are loading states handled?
*   [ ] Is the contrast sufficient for accessibility?
