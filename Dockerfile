FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Default (bị override bởi docker-compose)
CMD ["node", "index.js"]
