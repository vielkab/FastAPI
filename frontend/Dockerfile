# --- ETAPA 1: Compilación del proyecto ---
FROM node:20-alpine AS build

WORKDIR /app

# Copiar los archivos de configuración de dependencias
COPY package*.json ./

# Instalar los módulos de Node
RUN npm install

# Copiar todo el código del frontend
COPY . .

# Compilar la aplicación para producción (esto genera la carpeta /dist)
RUN npm run build

# --- ETAPA 2: Servidor de producción ---
FROM nginx:alpine

# Copiar los archivos compilados de la etapa anterior al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar una configuración personalizada de Nginx para manejar rutas de React (opcional pero recomendado)
# Si no la tienes, Nginx usará la por defecto que expone el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]