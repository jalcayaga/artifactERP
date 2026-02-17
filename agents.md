# Artifact ERP - AI Agent Context

## Project Overview
Artifact ERP is a modern, multi-tenant ERP system built for Chilean businesses, featuring inventory management, sales, invoicing, and e-commerce capabilities.

## Tech Stack
- **Monorepo**: Turborepo
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: NestJS, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth + Custom JWT
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Docker + Portainer (VPS)
- **CI/CD**: GitHub Actions

## Architecture

### Apps
1. **admin** (`apps/admin`) - ERP admin panel for employees
2. **storefront** (`apps/storefront`) - E-commerce storefront for customers
3. **backend** (`apps/backend`) - NestJS API server
4. **marketing** (`apps/marketing`) - Marketing landing page

### Packages
- **@artifact/core** - Shared business logic, types, contexts
- **@artifact/ui** - Shared UI components (shadcn/ui based)

## Multi-Tenancy
- Tenant resolution via subdomain (e.g., `cliente1.artifact.cl`)
- Reserved subdomains: `app`, `admin`, `www`, `api`, `localhost`
- Default tenant: `artifactspa`

## Authentication Flows

### Admin (ERP)
- Method: Email + Password (Backend Custom Auth)
- Endpoint: `POST /auth/login`
- Route: `/login/admin`

### Storefront (Customers)
- Method: Supabase OAuth (Google, Microsoft)
- Route: `/login` (storefront app)

## Key Conventions

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Server components by default (Next.js)
- Client components only when needed (`'use client'`)

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatCurrency.ts`)
- Types: PascalCase with `.types.ts` suffix

### API Patterns
- RESTful endpoints
- Tenant context via `x-tenant-slug` header
- JWT authentication via `Authorization: Bearer <token>`

## Database Schema

### Core Entities
- `Tenant` - Multi-tenant isolation
- `User` - Users with roles
- `Company` - Business entities within tenants
- `Product` - Inventory items
- `Sale`, `Invoice`, `Purchase` - Transactions
- `Warehouse`, `Lot` - Inventory management

### Prisma
- Schema: `apps/backend/prisma/schema.prisma`
- Migrations: `apps/backend/prisma/migrations/`
- Seed: `apps/backend/prisma/seed.ts`

## Environment Variables

### Required for All Apps
```bash
NEXT_PUBLIC_API_URL=https://api.artifact.cl
NEXT_PUBLIC_SUPABASE_URL=https://igscuchfztqvzwtehqag.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

### Backend Only
```bash
DATABASE_URL=<postgres_connection_string>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
JWT_SECRET=<secret>
```

## Development Workflow

### Local Development
```bash
npm install
npx turbo run dev
```

### Build
```bash
npx turbo run build
```

### Deployment
1. Push to `main` branch
2. GitHub Actions builds Docker images
3. Update services in Portainer

## Important Notes

> [!IMPORTANT]
> **Tenant Context**: Always ensure tenant context is properly set via `x-tenant-slug` header or subdomain resolution.

> [!WARNING]
> **Authentication**: Admin and Storefront use different auth methods. Never mix them.

> [!CAUTION]
> **Database Migrations**: Always test migrations on a branch before merging to main.

## Common Tasks

### Adding a New Feature
1. Create feature branch
2. Implement in appropriate app/package
3. Update types in `@artifact/core` if needed
4. Test locally
5. Create PR
6. Merge and deploy

### Fixing a Bug
1. Identify affected app/package
2. Check recent changes in git history
3. Add test case if missing
4. Fix and verify
5. Deploy

## Skills to Use

When working on this project, consider using these skills:
- `ui_ux_refinement` - For UI/UX improvements
- `api_architect` - For API design
- `automated_qa_engineer` - For testing
- `documentation_keeper` - For docs updates

## Contact
- Repository: https://github.com/jalcayaga/artifactERP
- Production: https://app.artifact.cl
