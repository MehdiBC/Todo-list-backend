FROM node:14-alpine3.14

WORKDIR /app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm","run","start:prod" ]