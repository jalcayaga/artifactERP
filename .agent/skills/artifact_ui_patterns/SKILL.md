---
name: artifact_ui_patterns
description: Specific UI design tokens, components, and animations that define the premium "Artifact" aesthetic.
---

# Artifact UI Patterns Skill

This skill defines the specific visual language of Artifact ERP, extending the base `ui_ux_refinement` skill with project-specific details.

## Design Tokens
1. **Colors**:
   - Background: `bg-slate-950` (Primary), `bg-slate-900` (Secondary cards).
   - Border: `border-white/10` (Glassmorphism borders).
   - Brand Green (ERP): `text-emerald-500`, `bg-emerald-600/20`.
   - Brand Blue (Storefront): `text-sky-500`, `bg-sky-600/20`.
2. **Radius**:
   - Cards: `rounded-xl`.
   - Buttons: `rounded-lg`.
3. **Blur**:
   - Panels: `backdrop-blur-md`.

## Signature Components
1. **Glass Card**: 
   ```tsx
   <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl">
     {children}
   </div>
   ```
2. **Animated Backgrounds**:
   - Admin Login: `SpaceInvadersBackground` or static dark gradients.
   - Storefront Login: Animated mesh gradients with orbit animations.
3. **Status Badges**:
   - Use semi-transparent backgrounds with vibrant text (e.g., `bg-yellow-500/10 text-yellow-500`).

## Navigation Patterns
- **ERP Sidebar**: Rail-style navigation that expands on icon hover or click.
- **Storefront Header**: Sticky glassmorphism header with consistent "Ingresar" button placement.

## Checklist
* [ ] Does the component use `white/10` borders for the glass effect?
* [ ] Are the correct brand colors used for the current app (Green for Admin, Blue for Storefront)?
* [ ] Are transitions smooth (usually `duration-200`)?
* [ ] Does the card have `backdrop-blur`?
