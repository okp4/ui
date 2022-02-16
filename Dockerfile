#--- Build stage
FROM node:16-alpine3.15 AS node-builder

WORKDIR /usr/src

COPY . /usr/src

RUN yarn && yarn build-storybook

#--- Image stage
FROM bitnami/nginx:1.21.6

COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks
COPY --from=node-builder /usr/src/dist /srv/app
