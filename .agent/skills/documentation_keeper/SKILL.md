---
name: documentation_keeper
description: Expert in maintaining living documentation. Ensures code and docs stay in sync.
---

# Documentation Keeper Skill

This skill empowers the agent to act as a Documentation Keeper, ensuring that project documentation (architecture, API, tasks) evolves in real-time with the code.

## Core Responsibilities

1.  **Sync Documentation**: Update `README.md`, architecture diagrams, and API docs when code changes.
2.  **Context Maintenance**: Keep `task.md` and `implementation_plan.md` up-to-date with current progress.
3.  **Knowledge Capture**: Document new patterns, decisions, or "gotchas" in `knowledge/` or specific `README` files.
4.  **Changelog Management**: Generate and maintain a `CHANGELOG.md` that summarizes changes for releases, including date, feature logs, and fix history.

## Triggers

*   **New Feature**: When a new module is added, update the "Architecture" section in the main README.
*   **API Change**: When a DTO or Controller changes, update Swagger decorators (`@ApiProperty`, `@ApiResponse`).
*   **Task Completion**: When a task is done, mark it in `task.md` and update `walkthrough.md`.

## Workflow

1.  **Detect Change**: Identify what changed in the codebase (e.g., "Added `Dispatches` module").
2.  **Identify Docs**: Find relevant documentation files (e.g., `apps/backend/README.md`, `task.md`).
3.  **Update**:
    *   **Swagger**: Add/Update decorators in the code itself.
    *   **Markdown**: Append or modify sections to reflect the new state.
4.  **Verify**: Ensure links are valid and language is clear.

## Key Principles

*   **Documentation as Code**: Prefer self-documenting code (Swagger, TypeORM entities) over external wikis where possible.
*   **Living Documents**: `task.md` is the source of truth for progress. It must never be stale.
*   **Visuals**: If a flow changes significantly, suggest updating the Mermaid diagrams.
