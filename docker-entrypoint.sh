#!/bin/sh
set -e

[ -z $FQDN ] && echo "If you want to use custom url setup variable FQDN"

function custom_name() {

    local HOSTNAMEDEV

    HOSTNAMEDEV=$(echo ${FQDN} | cut -d "." -f 1)

    sed -i -E "s/https:\/\/(client|producer|operator|dispatcher)\.vezubr\.dev\//https:\/\/"$HOSTNAMEDEV"\.\1\.vezubr\.dev\//g" env/*.js
}

function copy_config() {

    local ENV

    ENV=$1

    if [ "${ENV}" == "local" ]; then
        cp env/local.js ./vezubr-client-frontend/public/config.js
        cp env/local.js ./vezubr-producer-frontend/public/config.js
        cp env/local.js ./vezubr-operator-frontend/public/config.js
        cp env/local.js ./vezubr-dispatcher-frontend/public/config.js
        cp env/local.js ./vezubr-enter-frontend/public/config.js
    fi

    if [ "${ENV}" == "development" ]; then
        cp env/development.js ./vezubr-client-frontend/public/config.js
        cp env/development.js ./vezubr-producer-frontend/public/config.js
        cp env/development.js ./vezubr-operator-frontend/public/config.js
        cp env/development.js ./vezubr-dispatcher-frontend/public/config.js
        cp env/development.js ./vezubr-enter-frontend/public/config.js
    fi

    if [ "${ENV}" == "stage" ]; then
        cp env/stage.js ./vezubr-client-frontend/public/config.js
        cp env/stage.js ./vezubr-producer-frontend/public/config.js
        cp env/stage.js ./vezubr-operator-frontend/public/config.js
        cp env/stage.js ./vezubr-dispatcher-frontend/public/config.js
        cp env/stage.js ./vezubr-enter-frontend/public/config.js
    fi

    if [ "${ENV}" == "production" ]; then
        cp env/production.js ./vezubr-client-frontend/public/config.js
        cp env/production.js ./vezubr-producer-frontend/public/config.js
        cp env/production.js ./vezubr-operator-frontend/public/config.js
        cp env/production.js ./vezubr-dispatcher-frontend/public/config.js
        cp env/production.js ./vezubr-enter-frontend/public/config.js
    fi
}

[ -z ${FQDN} ] || custom_name ${FQDN}

if [ -z ${DOMAIN} ]; then
    echo 'Variable DOMAIN does not setup;'
    exit 111
else 
    case "${DOMAIN}" in
 "vezubr.local") copy_config "local"
               ;;
   "vezubr.dev") copy_config "development"
               ;;
   "vezubr.com") copy_config "stage"
               ;;
    "vezubr.ru") copy_config "production"
               ;;
     "cls24.ru") copy_config "cls"
               ;;
              *) echo 'You should use ${DOMAIN}: ["vezubr.local", "vezubr.dev", "vezubr.com", "vezubr.ru"]'
                 echo '$DOMAIN:' " \"${DOMAIN}\", does not match for accepted list"
                 exit 112
               ;;
    esac
fi

exec "$@"

