# Admin Branding Skill

This skill ensures that all Admin UI components and pages adhere to the "Artifact ERP" design system, which is based on a "Deep Blue" dark theme and Material Tailwind components.

## When to use
Use this skill whenever you are:
- Creating a new page in `apps/admin`.
- Adding new components or widgets.
- Refactoring existing UI to match the premium aesthetic.

## Design Tokens

### Colors (Dark Theme)
- **Base Background**: `#0f172a` (Slate 900) - Use for the main app shell and sidebar rail.
- **Card/Surface Background**: `#1e293b` (Slate 800) - Use for all content containers, dashboard widgets, and submenu panels.
- **Border Color**: `border-blue-gray-100/5` or `rgba(var(--border-color), 0.1)`.
- **Text Primary**: White / Gray 100.
- **Text Secondary**: `text-blue-gray-200` / Gray 400.
- **Brand Accent**: Blue-500 or Cyan-500 (use sparingly for primary actions).

### Typography
- **Font**: Inter (imported in `globals.css`).
- **Styles**: Use Material Tailwind `<Typography>` component with appropriate `variant` (h1-h6, small, paragraph).

## Component Patterns

### 1. The "Standard Card" Container
Every main page section should be wrapped in a Material Tailwind `<Card>`:
```tsx
<Card className="h-full w-full bg-[#1e293b] shadow-none border border-blue-gray-100/5">
  <CardHeader floated={false} shadow={false} className="rounded-none bg-transparent px-6 pt-6 pb-2">
    {/* Page Title & Search/Actions */}
  </CardHeader>
  <CardBody className="px-0">
    {/* Table or Content */}
  </CardBody>
</Card>
```

### 2. Standard Table
Use the shared `Table` component which should now be styled to be `bg-transparent`.
- Headers: Bold, uppercase, `text-blue-gray-200 opacity-70`.
- Rows: `hover:bg-white/5`, transition-colors.

### 3. Inputs & Buttons
- **Inputs**: Use Material Tailwind `<Input color="white">`.
- **Buttons**: Use Material Tailwind `<Button className="bg-blue-500">` for primary actions. Use `<IconButton variant="text">` for row actions.
- **Switches**: Custom styling for "Green active" state (see `IntegrationsPage` for reference).

## Rules
- **NEVER** use plain white backgrounds in the Admin section.
- **NEVER** use `container` class with `mx-auto` for main content; all views must be fluid to follow the Floating Header.
- **ALWAYS** ensure transitions are smooth (`duration-300`).
