---
name: erp_forms
description: Standards for creating high-density, functional, and consistent forms within the Artifact ERP admin panel.
---

# ERP Forms Skill

This skill ensures that all administrative forms in the Artist ERP follow a unified pattern for data entry, validation, and layout.

## Core Principles
1. **High Density**: ERP users value seeing more information at once. Use compact layouts, small/medium sizing for inputs, and grid systems (2-4 columns).
2. **Immediate Validation**: Use Zod schemas with React Hook Form. Display errors inline and prevent submission if invalid.
3. **Smart Defaults**: Pre-fill common values (e.g., current date for sales, default warehouse).
4. **Keyboard Friendly**: Ensure logical tab order and support "Enter" for submission in single-action forms.
5. **Clear State**: Show loading indicators during submission and clear success/error feedback via toasts.

## Component Selection
- **Inputs**: Use `Input` from `shadcn/ui`. Use icons for units (e.g., "$", "kg").
- **Selects**: Use `Select` for fixed lists (Status, Category). Use `ComboBox` for large lists (Customers, Products) to allow searching.
- **Dates**: Use `DatePicker` or standard `date` input for simplicity in high-speed entry.
- **Numbers**: Always align right for easier comparison. Use numeric pads on mobile.

## Standard Form Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Form Fields */}
</div>
```

## Checklist
* [ ] Are all fields required properly marked?
* [ ] Does the form have a "Clear" or "Cancel" option?
* [ ] Is the primary action (Save/Create) prominent?
* [ ] Are numeric fields formatted correctly (Currency/Decimals)?
