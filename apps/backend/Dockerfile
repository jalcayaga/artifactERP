
FROM node:20-alpine AS builder
WORKDIR /app
# Copy shared files
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
# Copy workspace packages
COPY packages/ packages/
# Copy application source
COPY apps/backend/ apps/backend/

# Install dependencies
RUN npm ci

# Build the application
RUN npx turbo run build --filter=@artifact/backend...

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=builder /app/apps/backend/prisma ./prisma

# Generate Prisma Client in runner
RUN npx prisma generate

CMD ["node", "dist/main.js"]
