FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g serve

COPY . .
RUN npm run build

EXPOSE 4000

CMD ["serve", "-s", "build", "-l", "4000"]
