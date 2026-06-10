# 1. Usar una imagen oficial de Python ligera
FROM python:3.10-slim

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar el archivo de requerimientos primero (ayuda a la caché de Docker)
COPY requirements.txt .

# 4. Instalar las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copiar el resto del código del backend a la carpeta de trabajo
COPY . .

# 6. Exponer el puerto 8080 (el puerto estándar que requiere AWS App Runner)
EXPOSE 8080

# 7. Comando para arrancar FastAPI con Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]