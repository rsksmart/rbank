FROM nginx

EXPOSE 80
EXPOSE 443

COPY nginx.crt /etc/ssl/
COPY nginx.key /etc/ssl/
COPY default.conf /etc/nginx/conf.d/
COPY ./dist/ /usr/share/nginx/html
COPY entrypoint.sh /

CMD ["sh", "/entrypoint.sh"]
