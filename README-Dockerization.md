# Dockerize React and NodeJs app, and orchestrate the services using docker-compose

### Summary:

- Dockerize react project developed using create-react-app. Host it with nginx, which requires to set proxy_pass in order to route the api calls to the backend server. For example, a call to http://frontend/api/products should be route to http://backend/api/products.
- Dockerize nodejs project, no special requirement
- Create **docker-compose.yaml** file to orchestrating the 2 containers, adding extra requirements, such as .env file, network with links to allow frontend container to talk to the backend container.
- Create **nginx.conf** file to

My file structures:

```
.
├── Dockerfile
├── backend (nodejs src folder)
├── docker-compose.yml
├── .env
├── frontend (react src)
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx
│       ├── nginx.cpof
└── package.json
```

#### Dockerfile for the frontend app

`./frontend/Dockerfile`

```
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
```

#### Dockerfile for the backend app:

`./Dockerfile`

```
FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
ADD ./backend ./backend/
EXPOSE 5000
CMD [ "npm", "run", "start" ]
```

#### Nginx configuration:

`frontend/nginx/nginx.conf`

```
server {
    listen 80;
    location / {
      resolver 127.0.0.11;
      root   /usr/share/nginx/html;
      index  index.html index.htm;
      try_files $uri $uri/ /index.html;
    }
    error_page 404 /index.html;
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   /usr/share/nginx/html;
    }

    #proxy_pass for apicalls to the backend
    location ~ ^/api/(.*)$ {
       resolver 127.0.0.11;
       proxy_set_header X-Forwarded-Host $host;
       proxy_set_header X-Forwarded-Server $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_pass http://backend:5000/api/$1;
    }
  }
```

1. this nginx.conf works for docker container, but needs adjustment if it's used without container environment. The resolver is required to resolve 'backend' link, and 127.0.0.11 is the ip of docker container itself
2. the `location ~ ^/api/(.*)$ {` section is the setting to route the api call to the backend server. For example, a call to http://frontend/api/products should be route to http://backend/api/products.

#### docker-compose configuration

`./docker-compose.yaml`

```
version: '3'

services:
  backend:
    env_file:
        "./.env"
    build:
      context: .
      dockerfile: ./Dockerfile
    image: "sisi-be"
    ports:
      - "5000:5000"
  frontend:
    build:
      context: ./frontend
      dockerfile: ./Dockerfile
    image: "sisi-fe"
    ports:
      - "3000:80"
    links:
      - "backend:be"
```

1. ./.env has the env that used by nodejs app
2. How to use links: try
   `docker exec -it <fe_container> /bin/sh`
   `curl backend:5000` or `curl be:5000`
   It means the frontend container will be able to access the backend container using that link, which uses docker network (created for you automatically) underneath.

#### docker-compose cli to build and run the services.

`docker-compose build`
`docker-compose up -d`
