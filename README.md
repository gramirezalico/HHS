# CajasHH

Aplicación web para gestión de cajas y packing list, desarrollada con Express.js.

## 📋 Características

- Servidor Express.js optimizado
- Servicio de archivos estáticos con cache
- Headers de seguridad implementados
- Logging de requests
- API REST endpoints
- Manejo de errores global
- Health check endpoint
- Graceful shutdown
- Soporte Docker

## 🚀 Instalación

```bash
npm install
```

## 🎯 Uso

| Script | Comando | Descripción |
|--------|---------|-------------|
| Start | `npm start` | Inicia el servidor |
| Dev | `npm run dev` | Modo desarrollo con watch |
| Prod | `npm run prod` | Modo producción |
| Clean | `npm run clean` | Limpia node_modules |
| Reinstall | `npm run reinstall` | Reinstala dependencias |

## 🐳 Docker

```bash
docker-compose up -d
```

## 📁 Estructura del Proyecto

```
CajasHH/
├── app.js                    # Servidor Express principal
├── package.json              # Configuración npm
├── Dockerfile                # Imagen Docker
├── docker-compose.yml        # Orquestación contenedores
├── public/                   # Frontend - archivos estáticos
│   ├── index.html            # Login
│   ├── HH.html               # Pantalla principal HH
│   ├── Lista.html            # Listado de órdenes
│   ├── CrearCaja.html        # Crear nueva caja
│   ├── EditCajas.html        # Editar cajas
│   ├── ViewCajas.html        # Ver cajas
│   ├── *.css                 # Estilos
│   └── assets/js/
│       ├── modules/          # Módulos ES6 reutilizables
│       │   ├── api.js        # Fetch API backend
│       │   ├── db.js         # IndexedDB abstracción
│       │   └── ui.js         # Utilidades UI
│       └── components/
│           └── DataGrid.js   # Componente tabla
├── utils/
│   └── getData.js            # Utilidades datos backend
├── modeloCruce/              # Microservicio modelo cruce
└── other/HHS/                # Versión legacy (deprecada)
```

## 🌐 Rutas API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página principal (login) |
| GET | `/hh` | Aplicación HH |
| GET | `/lista` | Listado de órdenes |
| GET | `/api/status` | Estado del servidor |
| GET | `/health` | Health check |

## 🔧 Configuración

Copia `.env.example` a `.env` y ajusta las variables según tu entorno.

| Entorno | Comportamiento |
|---------|----------------|
| Development | Logs detallados, errores completos |
| Production | Logs optimizados, errores seguros |

---

## 📝 Historial de Cambios

### Migración 2025-11

Se unificaron archivos duplicados de `other/HHS/` para reducir mantenimiento:

- Migrado CSS a estilos consolidados
- Refactorizado JS en módulos ES6 (`api.js`, `db.js`, `ui.js`)
- Scripts actualizados a `type="module"`
- Removidos scripts legacy (integrados en módulos)

**Próximos pasos:**
- Añadir pruebas (IndexedDB, login flow)
- Mejorar manejo de errores UI
- Implementar `.env` para credenciales

---

Desarrollado con Express.js