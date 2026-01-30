
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/ packages/
COPY apps/storefront/ apps/storefront/
RUN npm ci
RUN npx turbo run build --filter=@artifact/storefront...

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/storefront/public ./public
COPY --from=builder /app/apps/storefront/.next/standalone ./
COPY --from=builder /app/apps/storefront/.next/static ./apps/storefront/.next/static

EXPOSE 3000
CMD ["node", "apps/storefront/server.js"]
