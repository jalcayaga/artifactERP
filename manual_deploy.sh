#!/bin/bash
set -e

# Manual Deployment Script for Artifact ERP
# Use this when GitHub Actions are down.

echo "🚀 Starting Manual Build & Push..."

# Load Environment Variables for Build Args
# (We need to ensure these are available or set default build args)
# NOTE: Ideally these should come from your .env.local or be set in the environment
# For this script, we'll assume they are set or we export dummy ones if they are public anyway

export GITHUB_REPOSITORY="jalcayaga/artifacterp"
export REGISTRY="ghcr.io"


export VERSION="v7"

echo "📦 Building Backend ($VERSION)..."
docker build --no-cache -t $REGISTRY/$GITHUB_REPOSITORY-backend:$VERSION \
  -f apps/backend/Dockerfile . \
  --push

echo "📦 Building Admin ($VERSION)..."
docker build --no-cache -t $REGISTRY/$GITHUB_REPOSITORY-admin:$VERSION \
  -f apps/admin/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL="https://api.artifact.cl" \
  --build-arg NEXT_PUBLIC_ADMIN_URL="https://app.artifact.cl" \
  . \
  --push

echo "📦 Building Storefront ($VERSION)..."
docker build --no-cache -t $REGISTRY/$GITHUB_REPOSITORY-storefront:$VERSION \
  -f apps/storefront/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL="https://api.artifact.cl" \
  . \
  --push



echo "✅ All images built ($VERSION) and pushed successfully!"
