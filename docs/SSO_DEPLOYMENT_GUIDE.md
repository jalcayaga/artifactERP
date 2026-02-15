# SSO Deployment Guide

## 📋 Changes Summary

All configuration files have been updated to enable SSO via path-based routing with Traefik.

### Files Modified

1. **`docker-compose.prod.yml`**
   - Admin: `app.artifact.cl` → `artifact.cl/admin`
   - Backend: `api.artifact.cl` → `artifact.cl/api`
   - Storefront: `artifact.cl` (with priority 1)
   - Added StripPrefix middlewares
   - Updated environment variables

2. **`apps/admin/next.config.js`**
   - Added `basePath: '/admin'`
   - Added `assetPrefix: '/admin'`

3. **`apps/admin/.env.local`** (development)
   - Updated API_URL to localhost:3333

4. **`apps/storefront/.env.local`** (development)
   - No changes needed (already correct)

---

## 🚀 Deployment Steps

### Step 1: Build New Docker Images

```bash
# Build admin with basePath
cd /home/astrodev/artifactERP
docker build -t ghcr.io/jalcayaga/artifacterp-admin:latest -f apps/admin/Dockerfile .
docker push ghcr.io/jalcayaga/artifacterp-admin:latest

# Build storefront (no changes, but rebuild for consistency)
docker build -t ghcr.io/jalcayaga/artifacterp-storefront:latest -f apps/storefront/Dockerfile .
docker push ghcr.io/jalcayaga/artifacterp-storefront:latest

# Build backend (no changes, but rebuild for consistency)
docker build -t ghcr.io/jalcayaga/artifacterp-backend:latest -f apps/backend/Dockerfile .
docker push ghcr.io/jalcayaga/artifacterp-backend:latest
```

### Step 2: Update Supabase Redirect URLs

1. Go to [Supabase Dashboard → Authentication → URL Configuration](https://supabase.com/dashboard/project/igscuchfztqvzwtehqag/auth/url-configuration)

2. **Add new redirect URLs:**
   ```
   https://artifact.cl/admin/auth/callback
   https://artifact.cl/auth/callback
   ```

3. **Remove old URLs** (after testing):
   ```
   https://app.artifact.cl/auth/callback
   https://api.artifact.cl/auth/callback
   ```

### Step 3: Deploy via Portainer

1. Open Portainer
2. Go to Stacks → artifact-erp
3. Update the stack with the new `docker-compose.prod.yml`
4. Click "Update the stack"
5. Wait for services to restart

### Step 4: Verify Deployment

```bash
# Check if services are running
curl https://artifact.cl/
curl https://artifact.cl/admin
curl https://artifact.cl/api/health
```

---

## 🧪 Testing SSO

### Test 1: Storefront → Admin

1. Open `https://artifact.cl/`
2. Login with Google OAuth
3. Go to `/account`
4. Click "Artifact ERP" card
5. **Expected:** Redirected to `https://artifact.cl/admin` and auto-logged in ✓

### Test 2: Admin → Storefront

1. Open `https://artifact.cl/admin` in incognito
2. Login with Google OAuth
3. Open new tab: `https://artifact.cl/`
4. **Expected:** Already logged in ✓

### Test 3: Logout Sync

1. Login in both apps
2. Logout from Storefront
3. Refresh Admin
4. **Expected:** Also logged out ✓

---

## 🔄 Rollback Plan

If something breaks:

```bash
# Revert docker-compose.prod.yml
git checkout HEAD -- docker-compose.prod.yml

# Revert admin next.config.js
git checkout HEAD -- apps/admin/next.config.js

# Rebuild and redeploy
docker build -t ghcr.io/jalcayaga/artifacterp-admin:latest -f apps/admin/Dockerfile .
docker push ghcr.io/jalcayaga/artifacterp-admin:latest

# Update stack in Portainer
```

---

## 📝 Notes

- **Development:** Apps still run on separate ports (3001, 3002, 3333)
- **Production:** All apps under `artifact.cl` with path-based routing
- **SSO:** Works only in production (same domain required)
- **Old URLs:** `app.artifact.cl` will return 404 after deployment

---

## ✅ Success Criteria

- [ ] All services accessible via new paths
- [ ] SSO works: login once, access both apps
- [ ] Logout syncs across apps
- [ ] No 404 errors
- [ ] All API calls work correctly
