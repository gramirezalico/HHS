# Imagen base ligera
FROM node:20-alpine

# Variables de entorno
ENV NODE_ENV=production \
    PORT=3000

# Directorio de trabajo
WORKDIR /app

# Instalar utilidades necesarias para healthcheck
RUN apk add --no-cache curl

# Copiar manifiestos y instalar dependencias (solo producción)
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# Copiar el resto del código
COPY . .

# Crear usuario no root para mayor seguridad
RUN addgroup -S app && adduser -S app -G app
USER app

# Exponer el puerto
EXPOSE 3000

# Healthcheck contra endpoint /health (definido en app.js)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fs http://localhost:${PORT}/health || exit 1

# Comando de inicio
CMD ["node", "app.js"]
