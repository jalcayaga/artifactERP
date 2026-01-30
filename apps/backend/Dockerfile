FROM node:20-slim

ENV NODE_ENV=development

# Herramientas necesarias para dependencias nativas y monitoreo
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ procps \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar configuración del monorepo y el código del backend
COPY package.json yarn.lock turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend

# Instalar dependencias de workspaces (ejecuta prisma generate via postinstall)
RUN corepack enable \
  && corepack prepare yarn@1.22.22 --activate \
  && yarn install --frozen-lockfile

EXPOSE 3001

CMD ["yarn", "workspace", "@artifact/backend", "start:dev"]
