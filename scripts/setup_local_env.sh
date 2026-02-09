#!/bin/bash
set -e

echo "🔄 Setting up Local Development Environment..."

# --- Configuration ---
BACKEND_PORT=3002
ADMIN_PORT=3001
STORE_PORT=3000
MARKETING_PORT=3003

API_URL="http://localhost:$BACKEND_PORT"
ADMIN_URL="http://localhost:$ADMIN_PORT"
STORE_URL="http://localhost:$STORE_PORT"
MARKETING_URL="http://localhost:$MARKETING_PORT"

# --- Backend ---
echo "📝 Configuring Backend (Port $BACKEND_PORT)..."
if [ -f apps/backend/.env ]; then
  echo "  - Backing up existing apps/backend/.env to apps/backend/.env.bak"
  cp apps/backend/.env apps/backend/.env.bak
fi

cat > apps/backend/.env <<EOL
PORT=$BACKEND_PORT
# ⚠️ REPLACE WITH YOUR SUPABASE URL ⚠️
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DATABASE_URL="CHANGE_ME_TO_SUPABASE_URL"
DIRECT_URL="CHANGE_ME_TO_SUPABASE_URL"

# JWT Config (Keep consistent or use defaults)
JWT_SECRET="superSecretKeyThatShouldBeLongAndRandom"
JWT_EXPIRATION="3600s"

# Public URLs
STOREFRONT_URL="$STORE_URL"
ADMIN_URL="$ADMIN_URL"
EOL

# --- Admin ---
echo "📝 Configuring Admin (Port $ADMIN_PORT)..."
cat > apps/admin/.env.local <<EOL
NEXT_PUBLIC_API_URL="$API_URL"
NEXT_PUBLIC_ADMIN_URL="$ADMIN_URL"
EOL

# --- Storefront ---
echo "📝 Configuring Storefront (Port $STORE_PORT)..."
cat > apps/storefront/.env.local <<EOL
API_URL="$API_URL"
NEXT_PUBLIC_API_URL="$API_URL"
NEXT_PUBLIC_TENANT_ID_HEADER="x-tenant-slug"
NEXT_PUBLIC_ADMIN_URL="$ADMIN_URL"
EOL

# --- Marketing ---
echo "📝 Configuring Marketing (Port $MARKETING_PORT)..."
cat > apps/marketing/.env.local <<EOL
API_URL="$API_URL"
NEXT_PUBLIC_API_URL="$API_URL"
NEXT_PUBLIC_ADMIN_URL="$ADMIN_URL"
EOL

chmod +x setup_local_env.sh

echo "✅ Environment files created!"
echo "⚠️  ACTION REQUIRED: Edit 'apps/backend/.env' and set your real DATABASE_URL from Supabase."
echo "👉 Then run: ./setup_local_env.sh (done) -> npx turbo run dev"
