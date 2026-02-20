# HH App 🚀

Aplicación web desarrollada con Express.js para servir archivos estáticos y proporcionar una API básica.

## 📋 Características

- ✅ Servidor Express.js optimizado
- ✅ Servicio de archivos estáticos con cache
- ✅ Headers de seguridad implementados
- ✅ Logging de requests
- ✅ API endpoints básicos
- ✅ Manejo de errores global
- ✅ Health check endpoint
- ✅ Graceful shutdown

## 🚀 Instalación

```bash
npm install
```

## 🎯 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run prod
```

### Scripts disponibles
- `npm start` - Inicia el servidor
- `npm run dev` - Inicia con watch mode
- `npm run prod` - Inicia en modo producción
- `npm run clean` - Limpia node_modules
- `npm run reinstall` - Reinstala dependencias

## 🌐 Rutas disponibles

- `GET /` - Página principal
- `GET /hh` - Aplicación HH
- `GET /api/status` - Estado del servidor
- `GET /health` - Health check

## 📁 Estructura del proyecto

```
├── app.js                      # Servidor Express principal
├── package.json                # Configuración npm
├── public/                     # Archivos estáticos unificados
│   ├── index.html              # Login
│   ├── HH.html                 # Pantalla principal HH
│   ├── main.css                # Estilos consolidados (login + HH)
│   ├── assets/
│   │   └── js/
│   │       ├── main-login.js   # Entry point login (ES Module)
│   │       ├── main-hh.js      # Entry point HH (ES Module)
│   │       └── modules/        # Módulos reutilizables
│   │           ├── api.js      # Fetch API backend
│   │           ├── db.js       # IndexedDB abstracción
│   │           └── ui.js       # Utilidades UI (selects, tabs)
└── README.md                  # Este archivo
```

## 🔄 Migración y Consolidación (2025-11)

Se unificaron archivos duplicados provenientes de `other/HHS/` para reducir mantenimiento y evitar divergencias.

### Cambios Clave
- Eliminada carpeta duplicada `other/HHS/` (HTML/CSS/JS redundantes).
- Migrado CSS (`HH.css`, `login.css`) a un único `public/main.css`.
- Refactorizado JS en módulos ES:
	- `api.js`: llamadas a `/api/login` y `/api/packingList`.
	- `db.js`: manejo IndexedDB (`initDB`, `save`, `getById`, `getAllData`, `size`, `clearAll`).
	- `ui.js`: población de selects y tabs modal.
	- `main-login.js` y `main-hh.js` como entry points específicos.
- Actualizados `<script>` a `type="module"` en `index.html` y `HH.html`.
- Removidos scripts legacy: `controller.js`, `bdLocal.js`, `hh.js`, `login.js` (integrados en módulos).

### Nueva Organización de Frontend
```
public/
	index.html
	HH.html
	main.css
	assets/js/
		main-login.js
		main-hh.js
		modules/
			api.js
			db.js
			ui.js
```

### Ventajas
- Código más legible y mantenible.
- Evita drift entre dos copias del proyecto.
- Preparado para bundling futuro (Vite/Webpack) si se requiere.
- Facilita pruebas unitarias futuras aislando lógica (API, DB, UI).

### Pasos Siguientes Sugeridos
1. Añadir pruebas básicas (IndexedDB y login flow).
2. Implementar manejo de errores UI más descriptivo.
3. Agregar control de versión estático (hashing) si se introduce un bundler.
4. Incorporar un `.env` real para credenciales y claves (actualmente embebidas en backend).

---

Historial de migración documentado para trazabilidad.

## 🔧 Configuración

Copia `.env.example` a `.env` y ajusta las variables según tu entorno.

## 🚦 Estados del servidor

- **Development**: Logs detallados y manejo de errores completo
- **Production**: Logs optimizados y mensajes de error seguros

---

Desarrollado con ❤️ usando Express.js
# HHS



http://localhost:3000/EditCajas?orden=1183682&EmpId=00010&ids=3075941&Customer=EMFLESA&orderLine=2