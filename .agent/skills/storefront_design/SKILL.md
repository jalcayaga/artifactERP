# Skill: Storefront Design Standards 🛍️

Expert in maintaining and evolving the premium visual identity of the Artifact ERP Storefront. Focuses on a high-end, dark-mode e-commerce experience.

## Core Design Tokens

### Colors
- **Background**: `bg-black` (#000000). Total darkness for high contrast.
- **Brand Primary**: `#00E074` (Neon Green). Used for CTAs, highlights, and active states.
- **Brand Glow**: `rgba(0, 224, 116, 0.1)` to `0.3`. Used for subtle radial backgrounds.
- **Surface**: `bg-white/5` (Glassmorphism). Used for cards and sections over the black background.

### Typography
- **Headings**: `font-space-grotesk` (Space Grotesk). Tech-forward, geometric feel.
- **Body**: `font-inter` (Inter). Clean, readable at small sizes.

## UI Patterns

### 1. The "Glow" Effect
Every page should have subtle fixed backgrounds to avoid a "flat" black look:
```tsx
<div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,224,116,0.03),transparent_70%)]" />
```

### 2. Premium CTAs
Buttons should feel alive. Use `brand` colors with subtle shadows:
- **Variant**: `bg-brand hover:bg-brand/90 text-black font-bold`.
- **Interchange**: Use `scale-95` on click and `-translate-y-0.5` on hover.

### 3. Glassmorphism Cards
- **Border**: `border border-white/10`.
- **Blur**: `backdrop-blur-xl`.
- **Background**: `bg-black/60`.

## Interactive Standards
- **Micro-animations**: Use `animate-fade-in` for new content.
- **Hover States**: Always provide visual feedback (opacity changes or slight color shifts).
- **Loading**: Use `Loader2` from `lucide-react` with `text-brand`.

## Best Practices
1. **Never use pure white text for long body copy**: Use `text-neutral-400` or `text-slate-400`.
2. **Prioritize Mobile**: The storefront is likely to be viewed on mobile devices first.
3. **Optimized Images**: Always use `Next.js Image` for product assets.
