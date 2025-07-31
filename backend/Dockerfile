# backend/Dockerfile

# ---- Builder Stage ----
# Esta etapa instala dependencias (incluyendo devDependencies) y construye la aplicación.
FROM node:18-slim AS builder

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y el lockfile
COPY package.json yarn.lock ./

# Instalar todas las dependencias
# Usamos --frozen-lockfile para asegurar que se use exactamente lo definido en el lockfile
RUN yarn install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN yarn build

# ---- Production Stage ----
# Esta etapa final crea la imagen de producción.
FROM node:18-slim AS production

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Crear un usuario y grupo no privilegiado
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Copiar dependencias de producción desde la etapa 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
# Si tienes un prisma schema, también hay que copiarlo
COPY --from=builder /usr/src/app/prisma ./prisma

# Generar el cliente Prisma para el entorno de producción
RUN npx prisma generate

# Copiar el código compilado desde la etapa 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# Instalar OpenSSL para Prisma
RUN apt-get update && apt-get install -y openssl

# Cambiar la propiedad de los archivos al usuario no privilegiado
RUN chown -R appuser:appgroup /usr/src/app

# Cambiar al usuario no privilegiado
USER appuser

# Exponer el puerto en el que corre la aplicación
# (Asegúrate de que el puerto en main.ts coincide)
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]