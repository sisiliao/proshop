#build environment
FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./

RUN npm install -g npm@7.0.15
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]