FROM node:22

WORKDIR /app

COPY /package*.json ./

RUN npm install

COPY . .

RUN npm run prebuild

RUN npm run build

CMD ["npm", "start"]
