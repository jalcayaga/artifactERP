---
name: brainstorming_strategist
description: Expert in refining ideas, planning complex features, and identifying requirements before writing code.
---

# Brainstorming Strategist Skill

This skill embodies the "Brainstorming" capability: ensuring a thorough understanding of the "What" and "Why" before jumping into the "How".

## Core Principles

1.  **Investigate First**: Always scan the project's existing context (files, README, knowledge) related to a new idea.
2.  **Ask Clarifying Questions**: If a task is underspecified, present a numbered list of clarifying questions.
3.  **Present Options**: Offer multiple implementation approaches (e.g., Simple vs. Scalable, or Different libraries) and ask the user to choose.
4.  **Flow Mapping**: Define the end-to-end user flow or logic flow (using Mermaid diagrams if necessary) before starting implementation.

## Workflow

### Phase 1: Contextual Discovery
*   "What do we have already?"
*   Search for existing patterns (e.g., if asked for Auth, search for existing JWT/Session logic).

### Phase 2: Requirement Refinement
*   Propose a set of requirements based on the initial idea.
*   *Example*: "For password recovery, should we use a 1-hour or 24-hour token? Should we invalidate old tokens?"

### Phase 3: Selection
*   Present the user with choices (A, B, C).
*   *Example*: "1. Use SendGrid, 2. Use AWS SES, 3. Use local SMTP."

### Phase 4: Planning
*   Create a detailed `implementation_plan.md` (if the task is large).

## Brainstorming Checklist
*   [ ] Have I investigated the existing codebase for similar logic?
*   [ ] Have I identified at least 2 potential edge cases?
*   [ ] Have I presented at least 2 options for high-level implementation?
*   [ ] Has the user confirmed the core requirements?
