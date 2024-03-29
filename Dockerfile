# docker build -t logsight/logsight-frontend .

### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:14 as builder

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i
RUN mkdir /ng-app
RUN mv ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build --configuration --aot --vendor-chunk --build-optimizer --delete-output-path --common-chunk --output-path=dist --output-hashing=all


### STAGE 2: Setup ###

FROM nginx:1.21.6-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/
COPY logsight-eula.txt /
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html

## copy entrypoint
COPY entrypoint.sh /sbin

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

ENTRYPOINT [ "/sbin/entrypoint.sh" ]
