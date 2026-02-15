# Supabase Auth Migration Guide

## Overview

This guide explains how to migrate from the old JWT authentication system to the new Supabase Auth system.

---

## For Backend Developers

### Using Supabase Auth in Controllers

#### Before (Old JWT Auth)
```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.productsService.findAll();
  }
}
```

#### After (New Supabase Auth)
```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from './auth/guards/supabase-auth.guard';
import { SupabaseRolesGuard } from './auth/guards/supabase-roles.guard';
import { Roles } from './auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  @Get()
  @UseGuards(SupabaseAuthGuard)
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(SupabaseAuthGuard, SupabaseRolesGuard)
  @Roles('admin', 'staff')
  create() {
    return this.productsService.create();
  }
}
```

### Accessing User Data

#### Before
```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
getProfile(@Request() req) {
  // req.user from Prisma database
  return {
    id: req.user.id,
    email: req.user.email,
    roles: req.user.roles, // Array of role objects
  };
}
```

#### After
```typescript
@Get('me')
@UseGuards(SupabaseAuthGuard)
getProfile(@Request() req) {
  // req.user from Supabase JWT
  return {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role, // Single role string from metadata
    tenantId: req.user.tenantId,
    hasErpAccess: req.user.hasErpAccess,
  };
}
```

---

## For Frontend Developers

### Storefront (Already using Supabase)

No changes needed! The storefront is already using Supabase Auth.

### Admin App (Needs Migration)

#### Before (Old Custom Auth)
```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
const { access_token } = await response.json();
localStorage.setItem('token', access_token);
```

#### After (Supabase Auth)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Token is automatically managed by Supabase
```

#### Making API Calls

Before:
```typescript
const token = localStorage.getItem('token');
const response = await fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

After:
```typescript
const { data: { session } } = await supabase.auth.getSession();
const response = await fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${session?.access_token}`,
  },
});
```

---

## User Metadata Structure

All user information is stored in Supabase `user_metadata`:

```typescript
interface UserMetadata {
  // Tenant info
  tenantId: string;
  tenantSlug: string;
  
  // Access control
  hasErpAccess: boolean;
  role: 'superadmin' | 'admin' | 'staff' | 'customer';
  
  // Profile
  firstName?: string;
  lastName?: string;
  phone?: string;
  rut?: string;
}
```

### Setting User Metadata

When creating a user:
```typescript
const { data, error } = await supabase.auth.admin.createUser({
  email: 'user@example.com',
  password: 'secure-password',
  email_confirm: true,
  user_metadata: {
    tenantId: 'artifact',
    tenantSlug: 'artifact',
    hasErpAccess: true,
    role: 'admin',
    firstName: 'John',
    lastName: 'Doe',
  },
});
```

### Updating User Metadata

```typescript
const { data, error } = await supabase.auth.admin.updateUserById(
  userId,
  {
    user_metadata: {
      hasErpAccess: true,
      role: 'staff',
    },
  }
);
```

---

## Environment Variables

### Backend (.env)
```bash
# Supabase Auth Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_JWT_SECRET="your-jwt-secret"
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

---

## Testing

### Test Supabase Auth Endpoint

```bash
# 1. Login via Storefront or Admin
# 2. Get the access token from browser DevTools → Application → Local Storage
# 3. Test the endpoint

curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3333/example/protected
```

Expected response:
```json
{
  "message": "This is protected data",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

---

## Migration Checklist

### Phase 1: Backend
- [x] Install @supabase/supabase-js
- [x] Create Supabase strategy
- [x] Create Supabase guards
- [x] Update auth module
- [x] Add environment variables
- [ ] Update all controllers to use SupabaseAuthGuard
- [ ] Test all endpoints

### Phase 2: Admin App
- [ ] Install @supabase/supabase-js
- [ ] Create Supabase auth context
- [ ] Update login page
- [ ] Update API client
- [ ] Test login flow

### Phase 3: User Sync
- [ ] Add supabaseId to Prisma User model
- [ ] Create migration
- [ ] Create sync service
- [ ] Set up webhooks

---

## Troubleshooting

### "Invalid token" error

**Problem:** Backend returns 401 Unauthorized

**Solutions:**
1. Check that `SUPABASE_JWT_SECRET` matches your Supabase project
2. Verify token is being sent in `Authorization: Bearer TOKEN` header
3. Check token hasn't expired (default: 1 hour)

### "User role does not have permission" error

**Problem:** User can't access admin endpoints

**Solutions:**
1. Check user metadata in Supabase Dashboard
2. Verify `role` field is set correctly
3. Check `@Roles()` decorator matches user's role

### Token not refreshing

**Problem:** User gets logged out after 1 hour

**Solution:**
```typescript
// Set up automatic token refresh
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
});
```

---

## Best Practices

1. **Always use guards:** Never trust client-side role checks
2. **Validate metadata:** Check user metadata exists before using
3. **Handle errors:** Provide clear error messages
4. **Log auth events:** Track login/logout for security
5. **Refresh tokens:** Implement automatic token refresh
6. **Test permissions:** Verify role-based access works correctly

---

## Support

For questions or issues:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Review implementation plan
3. Check example controller for usage patterns
