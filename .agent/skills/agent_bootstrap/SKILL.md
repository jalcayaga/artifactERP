---
name: agent_bootstrap
description: Mandatory first step for any AI agent to ensure situational awareness and adherence to Artifact ERP standards.
---

# Agent Bootstrap Skill

This skill is the **entry point** for any task in Artifact ERP. It ensures the agent is not hallucinating architectural details or ports.

## Initialization Checklist

### 1. Environment & Ports
- [ ] **Admin App**: Port 3002 (Verification: `apps/admin/package.json`).
- [ ] **Backend API**: Port 3001 (Verification: `apps/backend/package.json`).
- [ ] **Storefront**: Port 3000 (Verification: `apps/storefront/package.json`).

### 2. Authentication Logic
- [ ] **Unified Gateway**: Both Admin and Storefront use Supabase Auth (OAuth + Email/Password) via the central Gateway (`/login`).
- [ ] **@artifact/core**: `useSupabaseAuth` handles auth state globally for both applications. Ensure proper RBAC is checked post-login for ERP access.

### 3. Visual Identity (Brand Tokens)
- [ ] **Emerald (ERP)**: Emerald-500/600, Slate-950 background, SpaceInvaders animations.
- [ ] **Sky (Storefront)**: Sky-500/600, Black background, Mesh/Orbit animations.

### 4. Mandatory Documents
- [ ] I have read `agents.md`.
- [ ] I have read `apps/admin/public/llms.txt`.
- [ ] I have read `apps/storefront/public/llms.txt`.
- [ ] I have read `apps/backend/public/llms.txt`.

## Usage
Add "Verified via agent_bootstrap" to your first plan or status update to confirm compliance.
