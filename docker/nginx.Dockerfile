FROM nginx:1.27-alpine
RUN apk add --no-cache openssl
COPY docker/nginx-entrypoint.sh /nginx-entrypoint.sh
COPY docker/nginx.conf.template /etc/nginx/templates/flowerchi.conf.template
RUN chmod +x /nginx-entrypoint.sh
ENTRYPOINT ["/nginx-entrypoint.sh"]
