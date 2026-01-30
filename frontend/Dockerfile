# frontend/Dockerfile (para Desarrollo)

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

# El código fuente se montará a través de un volumen

EXPOSE 3000

CMD ["npm", "run", "dev"]
