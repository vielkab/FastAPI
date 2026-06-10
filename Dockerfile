# 1. Etapa de compilación (Build)
FROM node:20-alpine AS build
WORKDIR /app

# 🔍 Cambiamos las rutas para que apunten a la carpeta frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ . 
RUN npm run build

# 2. Etapa de producción (Servidor Nginx en puerto 8080)
FROM nginx:1.27-alpine

ENV PORT=8080

# La plantilla nginx.conf ahora está en la raíz, se queda igual
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copiamos los archivos compilados de React a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080