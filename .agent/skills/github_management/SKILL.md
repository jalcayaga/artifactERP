# GitHub Management Skill

This skill defines the Git workflow and conventions for the Artifact ERP project. It ensures a clean, searchable, and professional repository history.

## When to use
Use this skill when you need to:
- Make a commit (save changes).
- Create or switch branches.
- Handle pull requests or merges.
- Synchronize with the remote repository.

## Automated Commits (AI-Powered)
I can perform automated commits autonomously. When you ask me to "commit my changes" or "save progress to git", I will:
1.  **Analyze changes**: Run `git status` and `git diff` to understand what was modified.
2.  **Verify build**: Ensure the project is in a working state.
3.  **Semantic Message**: Automatically generate a commit message following the conventions (`feat`, `fix`, etc.) based on the actual code changes.
4.  **Execute**: Run `git add` and `git commit` for you.

## Commit Conventions
We follow the **Conventional Commits** standard:

- `feat:` for new features (e.g., `feat: integrate master premium table`)
- `fix:` for bug fixes (e.g., `fix: missing use client in CompanyView`)
- `refactor:` for code changes that neither fix a bug nor add a feature
- `style:` for changes that do not affect the meaning of the code (whitespace, formatting)
- `docs:` for documentation updates
- `chore:` for recurring tasks (dependencies, build system)

## Workflow Steps

### 1. Verification
Before committing, ensure the code builds and follows the project's design standards.
```bash
npx turbo run build
```

### 2. Staging
Add only relevant files to the stage. Avoid committing temporary files or artifacts unless requested.
```bash
git add [files]
```

### 3. Committing
Craft a clear and concise commit message in Spanish or English (follow project preference).
```bash
git commit -m "type: description"
```

### 4. Branching
Always create a descriptive branch for new features.
```bash
git checkout -b feature/name-of-feature
```

## What to Avoid
- Avoid "mega-commits" with hundreds of unrelated changes.
- Do not commit secrets or environment variables (.env).
- Do not commit the `.agent/` folder unless it represents a significant update to the agent's logic/memory.
