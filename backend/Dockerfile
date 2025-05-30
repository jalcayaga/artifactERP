# backend/Dockerfile

# ---- Base Stage ----
# Usar una imagen base de Debian (Bookworm) para mejor compatibilidad con módulos nativos
FROM node:20-bookworm-slim AS base
WORKDIR /usr/src/app

# Instalar dependencias de sistema:
# - dumb-init: para un mejor manejo de señales en contenedores
# - python3, build-essential, git: para compilar módulos nativos como bcrypt (node-gyp)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    dumb-init \
    python3 \
    build-essential \
    git \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ---- Builder Stage ----
# Esta etapa instala todas las dependencias (incluyendo devDependencies),
# copia el código fuente, genera el cliente Prisma y construye la aplicación.
FROM base AS builder
ENV NODE_ENV=development
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

# Instala TODAS las dependencias (incluyendo devDependencies como prisma, typescript)
# No usar --ignore-scripts para que bcrypt y otros módulos puedan compilarse/configurarse
RUN yarn install --frozen-lockfile && yarn cache clean --all

# Copia el resto del código fuente (respetando .dockerignore)
# Asegúrate de tener un .dockerignore en tu carpeta backend/ para excluir node_modules locales
COPY . .

# Genera el Cliente Prisma (esto modifica node_modules en ESTA etapa)
# Asegúrate de que 'prisma:generate' esté en tus scripts de package.json
RUN yarn prisma:generate

# Construye la aplicación
RUN yarn build

# ---- Production Stage ----
# Esta etapa crea la imagen final para producción.
FROM base AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copia package.json y yarn.lock (pueden ser necesarios para algunas herramientas o para referencia)
COPY package.json .
COPY yarn.lock .

# Copia node_modules de la etapa 'builder'. Estos node_modules incluyen:
# 1. Todas las dependencias (incluyendo devDependencies con esta estrategia, pero asegura
#    que bcrypt y el cliente Prisma estén compilados/generados correctamente para el entorno de ejecución Debian).
# 2. El cliente Prisma generado.
# 3. Módulos nativos compilados (como bcrypt).
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia el código compilado de la aplicación
COPY --from=builder /usr/src/app/dist ./dist

# Copia el schema de Prisma (necesario en tiempo de ejecución por Prisma Client)
COPY --from=builder /usr/src/app/prisma ./prisma

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE ${PORT:-3001}

# Comando para iniciar la aplicación
CMD ["dumb-init", "node", "dist/main.js"]