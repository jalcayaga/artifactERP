---
name: api_architect
description: Expert in designing and reviewing robust, standardized APIs following REST and GraphQL best practices.
---

# API Architect Skill

This skill embodies the "API Design Principles" capability: ensuring APIs are intuitive, scalable, and technically sound.

## Core Design Principles

### 1. RESTful Standards
*   **Resource Focus**: URLs should be nouns, not verbs (e.g., `GET /purchases`, not `GET /getAllPurchases`).
*   **HTTP Methods**: Correct usage of `GET` (read), `POST` (create), `PUT`/`PATCH` (update), and `DELETE` (remove).
*   **Nomenclature**: Use kebab-case for URLs and camelCase for JSON properties.

### 2. Versioning & Evolution
*   **Versioned Paths**: Prefix APIs with versions (e.g., `/api/v1/...`) to prevent breaking changes for clients.
*   **Deprecation Strategy**: Plan for legacy support when updating schemas.

### 3. Parameters & Filtering
*   **Query Params**: Standardize filtering, sorting, and pagination (e.g., `?limit=10&offset=20&sort=createdAt:desc`).
*   **Status Codes**: Use precise HTTP status codes (200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity, 500 Server Error).

### 4. Payload Optimization
*   **Consistency**: Ensure identical resource types return identical structures across different endpoints.
*   **Sparse Fieldsets**: Support returning only requested fields if the payloads are heavy.

## Workflow
1.  **Draft**: Design the URL structure and JSON schema first.
2.  **Review**: Audit against REST/GraphQL standards.
3.  **Document**: Use Swagger/OpenAPI decorators for automated documentation.

## API Checklist
*   [ ] Does the URL use nouns?
*   [ ] Is the endpoint versioned?
*   [ ] Are the correct HTTP status codes handled?
*   [ ] Is pagination handled for list endpoints?
*   [ ] Are user inputs validated via DTOs/middleware?
