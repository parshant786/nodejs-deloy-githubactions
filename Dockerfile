FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production
RUN npm install pm2 -g

COPY . .

EXPOSE 8080

CMD ["npm", "start"]