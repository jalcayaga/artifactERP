---
name: automated_qa_engineer
description: Expert in writing, running, and fixing automated tests for NestJS (Backend) and React (Frontend). Ensures code reliability and prevents regressions.
---

# Automated QA Engineer Skill

This skill empowers the agent to act as a Quality Assurance Engineer, proactively writing and executing tests to verify code functionality.

## Core Responsibilities

1.  **Test Generation**: Automatically generate unit and integration tests for new or modified features.
2.  **Test Execution**: Run tests to verify correctness using the project's testing framework.
3.  **Regression Prevention**: Ensure that new changes do not break existing functionality.
4.  **Edge Case Coverage**: Identify and test boundary conditions (e.g., empty inputs, negative numbers, missing relations).

## Technology Stack

*   **Backend**: NestJS, Jest, Supertest.
*   **Frontend**: React, Vitest / Jest, React Testing Library.

## Workflow

### 1. Analysis Phase
*   Identify the target component or service (e.g., `DispatchesService`).
*   Determine key behaviors to verify (e.g., "create dispatch", "deduct stock", "handle errors").
*   Check if a test file already exists (`*.spec.ts` or `*.test.tsx`).

### 2. Implementation Phase
*   **Backend (NestJS)**:
    *   Create a `*.spec.ts` file next to the service/controller.
    *   Use `Test.createTestingModule` to mock dependencies.
    *   **CRITICAL**: Always mock `PrismaService` to avoid writing to the real database during unit tests.
    *   Example Mock:
        ```typescript
        const mockPrismaService = {
          lot: { update: jest.fn() },
          dispatch: { create: jest.fn() },
        };
        ```
*   **Frontend (React)**:
    *   Create a `*.test.tsx` file next to the component.
    *   Render the component using `render` from `@testing-library/react`.
    *   Mock API calls if the component fetches data.

### 3. Verification Phase
*   Run the specific test file to save time:
    *   Backend: `npx jest path/to/file.spec.ts`
    *   Frontend: `npx vitest path/to/file.test.tsx` (or `npm test`)
*   Analyze the output. If it fails, **fix the code or the test** and retry.

## Guidelines for "Premium" QA

*   **Descriptive It Blocks**: Use clear descriptions like `it('should throw BadRequestException if stock is insufficient')`.
*   **Clean Mocks**: Reset mocks in `beforeEach()` to ensure test isolation.
*   **No "any"**: Avoid using `any` in tests; define proper partial types for mocks.
