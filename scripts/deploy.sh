#!/bin/bash

# Artifact ERP - Manual Deployment Script
# This script builds and pushes Docker images to GitHub Container Registry
# and deploys them to your VPS

set -e

echo "🚀 Artifact ERP - Manual Deployment"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
GITHUB_USERNAME="jalcayaga"
REGISTRY="ghcr.io"
APPS=("backend" "admin" "storefront")

# Step 1: Login to GitHub Container Registry
echo -e "${YELLOW}Step 1: Login to GitHub Container Registry${NC}"
echo "You'll need a GitHub Personal Access Token with 'write:packages' permission"
echo "Create one at: https://github.com/settings/tokens"
echo ""
read -p "Enter your GitHub username [$GITHUB_USERNAME]: " input_username
GITHUB_USERNAME=${input_username:-$GITHUB_USERNAME}

echo "Logging in to $REGISTRY..."
echo $CR_PAT | docker login $REGISTRY -u $GITHUB_USERNAME --password-stdin

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Login failed. Make sure CR_PAT environment variable is set.${NC}"
    echo "Run: export CR_PAT=your_github_token"
    exit 1
fi

echo -e "${GREEN}✅ Login successful${NC}"
echo ""

# Step 2: Build Docker images
echo -e "${YELLOW}Step 2: Building Docker images${NC}"
for app in "${APPS[@]}"; do
    IMAGE_NAME="$REGISTRY/$GITHUB_USERNAME/artifacterp-$app:latest"
    echo "Building $app..."
    
    docker build \
        -t $IMAGE_NAME \
        -f apps/$app/Dockerfile \
        --build-arg NEXT_PUBLIC_API_URL=https://api.artifact.cl \
        --build-arg NEXT_PUBLIC_ADMIN_URL=https://app.artifact.cl \
        .
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $app built successfully${NC}"
    else
        echo -e "${RED}❌ Failed to build $app${NC}"
        exit 1
    fi
done
echo ""

# Step 3: Push images to registry
echo -e "${YELLOW}Step 3: Pushing images to registry${NC}"
for app in "${APPS[@]}"; do
    IMAGE_NAME="$REGISTRY/$GITHUB_USERNAME/artifacterp-$app:latest"
    echo "Pushing $app..."
    
    docker push $IMAGE_NAME
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $app pushed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to push $app${NC}"
        exit 1
    fi
done
echo ""

# Step 4: Deploy to VPS
echo -e "${YELLOW}Step 4: Deploy to VPS${NC}"
read -p "Enter your VPS IP or hostname: " VPS_HOST
read -p "Enter your VPS username [root]: " VPS_USER
VPS_USER=${VPS_USER:-root}

echo "Connecting to VPS and deploying..."

ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
    set -e
    
    echo "📦 Pulling latest images..."
    docker pull ghcr.io/jalcayaga/artifacterp-backend:latest
    docker pull ghcr.io/jalcayaga/artifacterp-admin:latest
    docker pull ghcr.io/jalcayaga/artifacterp-storefront:latest
    
    echo "🔄 Updating stack..."
    cd /path/to/docker-compose-directory
    docker stack deploy -c docker-compose.prod.yml artifact
    
    echo "⏳ Waiting for services to be healthy..."
    sleep 10
    
    echo "📊 Service status:"
    docker service ls | grep artifact
    
    echo "✅ Deployment complete!"
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo "🌐 Your services should be available at:"
    echo "   - Storefront: https://artifact.cl"
    echo "   - Admin: https://app.artifact.cl"
    echo "   - API: https://api.artifact.cl"
    echo ""
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
