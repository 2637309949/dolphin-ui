FROM nginx:stable-alpine

RUN echo "http://mirrors.aliyun.com/alpine/v3.6/main/" > /etc/apk/repositories
RUN apk update && apk add tzdata \
    && rm -f /etc/localtime \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html/admin
RUN mkdir -p /usr/share/nginx/html/static
RUN mkdir -p /etc/nginx/conf.d/
RUN echo "\
client_max_body_size 1024m;\
underscores_in_headers on;\
" > /etc/apk/repositories

ADD flarum-ui.tar.gz /usr/share/nginx/html/
ADD flarum-ui.tar.gz /usr/share/nginx/html/admin/

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]