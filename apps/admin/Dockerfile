
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/ packages/
COPY apps/admin/ apps/admin/
RUN npm ci
RUN npx turbo run build --filter=@artifact/admin...

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/admin/public ./public
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static

EXPOSE 3000
CMD ["node", "apps/admin/server.js"]
