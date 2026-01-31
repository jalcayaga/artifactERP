FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/ packages/
COPY apps/marketing/ apps/marketing/
RUN npm ci
RUN npx turbo run build --filter=@artifact/marketing... --force

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/marketing/public ./public
COPY --from=builder /app/apps/marketing/.next/standalone ./
COPY --from=builder /app/apps/marketing/.next/static ./apps/marketing/.next/static

EXPOSE 3000
CMD ["node", "apps/marketing/server.js"]
