FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./

RUN npm install -g npm@7.0.15
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build
RUN npm i -g serve

EXPOSE 3000

CMD [ "serve", "-s", "build", "-l", "3000"]