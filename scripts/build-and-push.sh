#!/bin/bash
set -e

echo "🚀 Building and pushing Docker images locally..."
echo ""

# Check if logged in to GitHub Container Registry
if ! docker info 2>/dev/null | grep -q "ghcr.io"; then
    echo "⚠️  Please login to GitHub Container Registry first:"
    echo "   docker login ghcr.io -u jalcayaga"
    echo ""
    read -p "Press enter after logging in..."
fi

# Build arguments for Next.js apps
BUILD_ARGS="--build-arg NEXT_PUBLIC_API_URL=https://api.artifact.cl"

echo "📦 Building backend..."
docker build -f apps/backend/Dockerfile -t ghcr.io/jalcayaga/artifacterp-backend:latest .
echo "✅ Backend built"
echo ""

echo "📦 Building admin..."
docker build -f apps/admin/Dockerfile $BUILD_ARGS -t ghcr.io/jalcayaga/artifacterp-admin:latest .
echo "✅ Admin built"
echo ""

echo "📦 Building storefront..."
docker build -f apps/storefront/Dockerfile $BUILD_ARGS -t ghcr.io/jalcayaga/artifacterp-storefront:latest .
echo "✅ Storefront built"
echo ""

echo "🚢 Pushing images to GitHub Container Registry..."
docker push ghcr.io/jalcayaga/artifacterp-backend:latest
echo "✅ Backend pushed"

docker push ghcr.io/jalcayaga/artifacterp-admin:latest
echo "✅ Admin pushed"

docker push ghcr.io/jalcayaga/artifacterp-storefront:latest
echo "✅ Storefront pushed"

echo ""
echo "🎉 All images built and pushed successfully!"
echo ""
echo "Next steps:"
echo "1. Go to Portainer"
echo "2. Update the stack (it will pull these new images)"
echo "3. Wait for services to be 'Running' and 'Healthy'"
echo "4. Visit https://artifact.cl"
