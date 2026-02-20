# Modelo Cruce - API de Cruce de Datos

API en Node.js con Express para cruzar datos de Epicor y Cajas.

## Instalación

```bash
npm install
```

## Ejecutar

```bash
# Modo producción
npm start

# Modo desarrollo (con nodemon)
npm run dev
```

## Endpoints

### `GET /cruce`
Endpoint principal que obtiene datos de Epicor y Cajas, y devuelve los datos cruzados.

**Respuesta:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "caja2": { ... },
      "epicor": { ... }
    }
  ]
}
```

### `GET /health`
Verifica el estado del servidor.

### `GET /epicor`
Obtiene solo los datos de Epicor.

### `GET /cajas`
Obtiene solo los datos de Cajas.

## Puerto

El servidor corre en el puerto **6901**.

URL: `http://localhost:6901`
