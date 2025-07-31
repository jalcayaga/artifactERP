FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
