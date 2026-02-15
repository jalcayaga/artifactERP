# Production Mode Skill

This skill acts as a quality control layer to ensure that any feature or UI change is "Production Ready" before being presented to the user.

## When to use
Activate this skill after completing the initial implementation of a task and before calling `notify_user`.

## Polish Checklist

### 1. Visual Consistency
- [ ] Does the color palette match `admin_branding`?
- [ ] Are borders consistent (`border-blue-gray-100/5`)?
- [ ] Is there proper spacing between elements (no cramped UI)?

### 2. States & Interactivity
- [ ] **Loading States**: Are spinners or skeletons present during data fetching?
- [ ] **Empty States**: What happens if there is no data? Is there a clear message?
- [ ] **Hover Effects**: Do interactive elements (buttons, rows) respond to mouse hover?
- [ ] **Transitions**: Are changes sudden or animated smoothly (`fade-in`, `transition-colors`)?

### 3. Functional Health
- [ ] **Responsive Design**: Does it break on mobile? (Check for horizontal scroll or overlapping elements).
- [ ] **Error Handling**: Are try/catch blocks present for async operations?
- [ ] **Console Hygiene**: Are there unnecessary `console.log` statements?

### 4. Code Quality
- [ ] **Imports**: Are imports clean and from the correct libraries (e.g., Lucide vs Heroicons)?
- [ ] **Types**: Are there any `any` types that could be replaced with proper interfaces?
- [ ] **Refactoring**: Are there duplicated code blocks that can be extracted?

## Output
If any item in the checklist fails, fix it immediately. If everything passes, accompany the completion report with a "Production Verification" summary.
