# 1. Etapa de compilación (Build)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Etapa de producción (Servidor Nginx en puerto 8080)
FROM nginx:1.27-alpine

ENV PORT=8080

# Copiamos la plantilla de configuración de Nginx para el puerto 8080
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copiamos los archivos compilados de React a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080