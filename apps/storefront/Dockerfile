

FROM node:20-alpine AS builder
WORKDIR /app
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

# Copy shared source code
COPY packages/ packages/
# Copy application source
COPY apps/storefront/ apps/storefront/
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ADMIN_URL
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_CHATWOOT_TOKEN
ARG NEXT_PUBLIC_CHATWOOT_BASE_URL
ARG NEXT_PUBLIC_N8N_WEBHOOK_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ADMIN_URL=$NEXT_PUBLIC_ADMIN_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_CHATWOOT_TOKEN=$NEXT_PUBLIC_CHATWOOT_TOKEN
ENV NEXT_PUBLIC_CHATWOOT_BASE_URL=$NEXT_PUBLIC_CHATWOOT_BASE_URL
ENV NEXT_PUBLIC_N8N_WEBHOOK_URL=$NEXT_PUBLIC_N8N_WEBHOOK_URL

RUN npx turbo run build --filter=@artifact/storefront... --force

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/storefront/public ./public
COPY --from=builder /app/apps/storefront/.next/standalone ./
COPY --from=builder /app/apps/storefront/.next/static ./apps/storefront/.next/static

EXPOSE 3000
CMD ["node", "apps/storefront/server.js"]
