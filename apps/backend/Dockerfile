
FROM node:20-alpine AS builder
WORKDIR /app

# Install Python and build tools for native modules (bcrypt)
RUN apk add --no-cache python3 make g++ openssl

# Copy root manifests
COPY package.json package-lock.json turbo.json tsconfig.base.json ./

# Copy all workspace manifests for npm ci
COPY apps/admin/package.json ./apps/admin/
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/
COPY packages/config/package.json ./packages/config/
COPY packages/core/package.json ./packages/core/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/

# Install dependencies
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
RUN npm ci

# Copy Prisma schema for generation
COPY apps/backend/prisma/ ./apps/backend/prisma/
RUN npx prisma generate --schema ./apps/backend/prisma/schema.prisma

# Copy shared source code
COPY packages/ packages/
# Copy application source
COPY apps/backend/ apps/backend/

# Build the application
RUN npx turbo run build --filter=@artifact/backend... --force
RUN ls -R apps/backend/dist || echo "No dist found"

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built artifacts and dependencies
RUN apk add --no-cache openssl
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/packages ./packages

# Generate Prisma Client in runner
RUN npx prisma generate --schema ./prisma/schema.prisma

CMD ["node", "dist/main.js"]
