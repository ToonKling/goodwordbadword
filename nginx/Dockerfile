FROM nginx:alpine

ARG API_BASE_URL

COPY ./public/index.html    /usr/share/nginx/html/index.html
COPY ./public/script.js     /usr/share/nginx/html/script.js
COPY ./public/classless.css /usr/share/nginx/html/classless.css
COPY ./public/default.conf  /etc/nginx/conf.d/default.conf

RUN sed -i "s|__API_BASE_URL__|${API_BASE_URL}|g" /usr/share/nginx/html/script.js

EXPOSE 80
