# Secret-Garden-Florist

## Live Demo hosted on Heroku

https://secret-garden-florist.herokuapp.com/

## Summary of the app

- A modern single-page web application that handles online florist business. It allows customer to place orders, process payments, rate the products, and helps the admin user to manage the product stock, customers, order deliveries etc.
- It is a production ready microservice application built using docker and docker-compose. The tech-stack includes React, Redux, NodeJS, Express, MongoDB, Docker.

<div>
   <h3>Home Page and Product Page </h3>
   <img src="/docs/Home.png" width="420" height="280">
   <img src="/docs/ProductPage.png" width="420" height="280">
</div>
<div>
   <h3>Shopping Cart Page and Order Page </h3>
   <img src="/docs/ShoppingCartPage.png"  width="420" height="280">
   <img src="/docs/OrderPage.png"  width="420" height="280">
</div>
<div>
   <h3> Order Paid Page and PayPal Integration </h3>
   <img src="/docs/OrderPaid.png"  width="420" height="280">
   <img src="/docs/PayPal-Integration.png"  width="420" height="280">
</div>
<div>
   <h3> Admin Users can manage Users and Products </h3>
   <img src="/docs/Admin-ManageUsers.png"  width="420" height="280">
   <img src="/docs/Admin-ManageProducts.png"  width="420" height="280">
</div>
<div>
   <h3> Admin Users can manage Orders and Shipments </h3>
   <img src="/docs/Admin-OrderAndShipmentManagement.png"  width="420" height="280">
</div>

## Deploy with Heroku

1. Install Heroku CTL and create an app\
   `heroku login`\
   `heroku create <app name>`

2. create a Procfile telling Heroku server how to run the code, within that file write:\
   `web: node backend/server.js`
3. Add heroku-postbuild script to the script section in the package.json\
   `"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix frontend && npm run build --prefix frontend"`
4. Add heroku owned git remote repository, and push the code to the remote repo.\
   `heroku git:remote -a <app name>`\
   `git push heroku <local branch>:master`
5. On Heroku dashboard, configure env vars. Basically add whatever is in the `.env` file. Includes:\
   `NODE_ENV`, tells nodejs your running environment.\
   `PORT`, at which port the API is runnning.\
   `MONGO_URI`, connect token of MongoDB.\
   `JWT_SECRET`, private key used to sign the JWT token. \
   `PAYPAL_CLIENT_ID`, The business-id that was created in paypal development sandbox tool.

## Build and Deploy with Docker and Docker-Compose

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
