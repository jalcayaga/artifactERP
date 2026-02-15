---
name: react_performance_master
description: Expert in React and Next.js best practices, focusing on performance, data fetching, and efficient rendering.
---

# React Performance Master Skill

This skill embodies the "Vercel React Best Practices" capability: ensuring code is efficient, modern, and high-performing.

## Core Best Practices

### 1. Data Fetching
*   **Parallelization**: Use `Promise.all()` when fetching multiple independent resources to avoid waterfalls.
*   **Libraries**: Prefer `SWR` or `React Query` for caching, revalidation, and optimistic updates.
*   **Server Components**: Leverage Next.js Server Components (RSC) to fetch data closer to the source and reduce bundle size.

### 2. Rendering Optimization
*   **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` strategically to prevent expensive re-renders (only where complexity warrants it).
*   **Lazy Loading**: Use `next/dynamic` or `React.lazy` for large components (e.g., Charts, Rich Text Editors) to improve Initial Page Load.
*   **Conditional Rendering**: Ensure efficient ternary or logical operators that don't churn the DOM.

### 3. User Experience
*   **Loading States**: Always implement `Suspense` with Shimmer Skeletons.
*   **Image Optimization**: Use `next/image` with proper `priority`, `placeholder="blur"`, and `sizes`.
*   **Font Loading**: Use `next/font` to eliminate Layout Shift (CLS).

## Workflow
1.  **Analyze**: Audit component structure for potential waterfalls or heavy renders.
2.  **Optimize**: Apply dynamic imports, memoization, or parallel fetches.
3.  **Validate**: Check bundle size and Network tab for waterfall patterns.

## Performance Checklist
*   [ ] Are multiple fetches parallelized with `Promise.all`?
*   [ ] Can heavy components be dynamically imported?
*   [ ] Are images using `next/image` optimizing correctly?
*   [ ] Is `useMemo`/`useCallback` used correctly for stable dependencies?
*   [ ] Are SWR/React Query being used for Client-side state?
