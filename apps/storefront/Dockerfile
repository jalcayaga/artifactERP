FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=development

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/storefront ./apps/storefront

RUN corepack enable \
  && corepack prepare yarn@1.22.22 --activate \
  && yarn install --frozen-lockfile

WORKDIR /app

EXPOSE 3000

CMD ["yarn", "workspace", "@artifact/storefront", "dev"]
