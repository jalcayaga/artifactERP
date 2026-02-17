---
name: multi_tenant_patterns
description: Conventions and strategies for managing tenant-aware data, authentication, and routing in the Artifact ERP ecosystem.
---

# Multi-Tenant Patterns Skill

This skill ensures that multi-tenancy is handled securely and transparently across the entire codebase.

## Tenant Isolation Strategies
1. **Database Level**: Every key table must have a `tenant_id` or `tenant_slug` column. All queries MUST include a tenant filter.
2. **Backend Context**: Use the `x-tenant-slug` header in API requests to resolve the tenant context in NestJS interceptors.
3. **Frontend Resolution**: Resolve tenant from the subdomain (e.g., `client1.artifact.cl`). 
   - Reserved subdomains (`app`, `admin`, `www`, `api`) default to `artifactspa`.

## Tenant-Aware API Calls
All API client calls must include the tenant header:
```typescript
const response = await fetch(`${API_URL}/products`, {
  headers: {
    'x-tenant-slug': tenantSlug,
    'Authorization': `Bearer ${token}`
  }
});
```

## UI Branding
- Allow tenants to customize basic brand elements (Logo, Primary Color).
- Storefront app handles tenant-specific settings via the `Settings` entity in the database.

## Security Rules
- Never leak data between tenants. 
- Supabase RLS (Row Level Security) should be the last line of defense.
- Validate that the user belongs to the tenant they are trying to access.

## Checklist
* [ ] Is the `x-tenant-slug` header included in all API calls?
* [ ] Does the database query include a tenant filter?
* [ ] Is the subdomain resolution logic handling reserved words?
* [ ] Are tenant settings (Logo/Color) applied to the UI?
