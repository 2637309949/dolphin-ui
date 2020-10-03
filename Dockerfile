FROM nginx:stable-alpine

RUN echo "http://mirrors.aliyun.com/alpine/v3.6/main/" > /etc/apk/repositories
RUN apk update && apk add tzdata \
    && rm -f /etc/localtime \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html/admin
RUN mkdir -p /usr/share/nginx/html/static
RUN mkdir -p /etc/nginx/conf.d/

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

ADD flarum.tar.gz /usr/share/nginx/html/
ADD flarum.tar.gz /usr/share/nginx/html/admin/
COPY /usr/share/nginx/html/admin/static /usr/share/nginx/html/static/

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]