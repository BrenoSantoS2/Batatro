# backend/nginx/Dockerfile

# Começa com a imagem oficial do NGINX
FROM nginx:stable-alpine

# Remove a configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia a nossa configuração customizada para dentro da imagem
COPY nginx.conf /etc/nginx/conf.d/