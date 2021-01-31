FROM node:alpine

WORKDIR '/app'

COPY ./package.json ./

RUN npm install
ADD ./backend ./backend/

EXPOSE 5000

CMD [ "npm", "run", "start" ]