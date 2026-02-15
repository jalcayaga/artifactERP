---
name: security_quality_auditor
description: Expert in code security, static analysis, and best practices. Audits code for vulnerabilities and quality issues.
---

# Security & Quality Auditor Skill

This skill empowers the agent to act as a Security and Quality Auditor, performing static analysis and enforcing best practices similar to tools like Snyk or SonarQube.

## Core Responsibilities

1.  **Vulnerability Scanning**: Identify potential security risks (SQL injection, XSS, hardcoded secrets, weak cryptography).
2.  **Code Quality Review**: Enforce clean code principles (DRY, SOLID) and project-specific standards.
3.  **Dependency Auditing**: Check for insecure usage of libraries or deprecated packages.
4.  **Configuration Security**: Validate that sensitive configuration (env vars) is handled correctly.

## Audit Checklist

### 🔒 Security
*   [ ] **Secrets**: No hardcoded passwords, API keys, or tokens in git-tracked files.
*   [ ] **Validation**: All user inputs (DTOs) must have `class-validator` decorators.
*   [ ] **Authorization**: Endpoints must have `@UseGuards(JwtAuthGuard)` unless explicitly public.
*   [ ] **Database**: No raw SQL queries with concatenated strings (use Prisma or parameterized queries).
*   [ ] **Output**: No sensitive data (passwords, hashes) returned in API responses (use `ClassSerializerInterceptor`).

### 💎 Quality
*   [ ] **Typing**: No `any` types in TypeScript. Use strict interfaces/DTOs.
*   [ ] **Error Handling**: Use the "Catch and Categorize" pattern. Avoid empty catch blocks. Map errors to appropriate status codes.
*   [ ] **Functional Patterns**: For operations that might fail, consider `Maybe<T>` or `Result<T, E>` patterns to avoid null pointers.
*   [ ] **Centralized Logging**: Ensure errors are logged through a centralized service (including context like userId, original event, and stack trace).
*   [ ] **Clean Code**: Enforce DRY and SOLID. Modules should have a single responsibility.

## Workflow

1.  **Scan**: Read the target file(s).
2.  **Analyze**: Compare against the Audit Checklist.
3.  **Report**: Generate a brief report of issues found.
4.  **Fix**: If authorized, apply fixes automatically.

## Example Usage

"Auditor, check `apps/backend/src/users/users.controller.ts` for security issues."

Result:
> ⚠️ **Security Warning**: Endpoint `@Post()` is missing `@UseGuards()`.
> 💎 **Quality Issue**: Method `findAll` returns `any`.
