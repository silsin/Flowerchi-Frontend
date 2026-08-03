#!/bin/sh
set -eu

mkdir -p /etc/letsencrypt/live/"$DOMAIN"
if [ ! -f /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem ]; then
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/"$DOMAIN"/privkey.pem \
    -out /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem \
    -subj "/CN=$DOMAIN"
fi
envsubst '$DOMAIN' < /etc/nginx/templates/flowerchi.conf.template > /etc/nginx/conf.d/default.conf
nginx
while :; do sleep 6h; nginx -s reload; done
