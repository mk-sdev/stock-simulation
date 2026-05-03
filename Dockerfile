FROM node:25-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli && npm install

COPY . .

RUN npm run build 

CMD ["npm", "run", "start:prod"]
