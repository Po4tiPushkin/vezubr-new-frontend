FROM node:14 as node-dev

RUN echo "Europe/Moscow" > /etc/timezone && ln -snf /usr/share/zoneinfo/Europe/Moscow /etc/localtime

WORKDIR /app
COPY ./ /app
RUN npm install
RUN npm run bootstrap
RUN npm run build:main:prod

#######################################################################################################

FROM nginx:1.14-alpine

RUN apk add --no-cache tzdata && cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime && apk del tzdata
ENV TZ Europe/Moscow
ENV NODE_OPTIONS --max_old_space_size=8192

WORKDIR /var/www
COPY --from=node-dev /app/packages/lk-client/build /var/www/vezubr-client-frontend/public
COPY --from=node-dev /app/packages/lk-producer/build /var/www/vezubr-producer-frontend/public
COPY --from=node-dev /app/packages/lk-operator/build /var/www/vezubr-operator-frontend/public
COPY --from=node-dev /app/packages/lk-dispatcher-old/build /var/www/vezubr-dispatcher-frontend/public
COPY --from=node-dev /app/packages/lk-enter/build /var/www/vezubr-enter-frontend/public

COPY --from=node-dev /app/env /var/www/env
COPY --from=node-dev /app/docker-entrypoint.sh /



COPY ./nginx.conf /etc/nginx




CMD ["/docker-entrypoint.sh", "nginx", "-g", "daemon off;"]
