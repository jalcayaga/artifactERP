FROM node:20-slim

# Instalar herramientas de compilación y procps
RUN apt-get update && apt-get install -y python3 make g++ procps

WORKDIR /app

# Copiar archivos de dependencias y el esquema de Prisma ANTES de instalar
COPY package*.json yarn.lock ./
COPY prisma ./prisma/

# Instalar dependencias (esto ejecutará 'prisma generate' via postinstall)
RUN yarn install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]