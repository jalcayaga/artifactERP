---
name: printable_documents
description: Standards for creating printer-friendly views for invoices, dispatch guides, and reports.
---

# Printable Documents Skill

This skill ensures that ERP documents (Invoices, Guides, Reports) are printed perfectly on physical paper, separating the "Screen Experience" (Dark/Premium) from the "Paper Experience" (Clean/Formal).

## Core Principles

### 1. Hiding UI Elements
- Navigation, Sidebars, Buttons, and Toasts must be hidden.
- Use Tailwind's `print:hidden` utility.

### 2. Ink Saving & Legibility
- **Backgrounds**: Force white background (`print:bg-white`) to avoid printing dark mode colors.
- **Text**: Force high-contrast black text (`print:text-black`).
- **Decorations**: Remove shadows, glows, and gradients (`print:shadow-none`, `print:drop-shadow-none`).

### 3. Page Layout & Sizing
- **Container**: Ensure the content fits standard paper sizes (A4/Letter).
- **Margins**: Reset browser margins if necessary.
- **Break handling**: Use `print:break-inside-avoid` to prevent tables or sections from being cut in half.

### 4. Example Pattern
```tsx
<div className="
  // Screen Styling (Premium Dark Mode)
  bg-slate-900 text-white p-6
  
  // Print Styling (Formal Document)
  print:bg-white print:text-black print:p-0 print:m-0
">
  <div className="print:hidden">
    <!-- Close Button / Actions -->
  </div>

  <div className="max-w-4xl mx-auto print:max-w-none">
     <!-- Document Content -->
  </div>
</div>
```

## When to use
- Dispatch Guides
- Invoices / Receipts
- Inventory Reports
-Picking Lists
