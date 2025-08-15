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
├── app.js              # Servidor Express principal
├── package.json        # Configuración npm
├── public/            # Archivos estáticos
│   ├── index.html     # Página principal
│   ├── HH.html        # Aplicación HH
│   ├── HH.js          # Scripts HH
│   ├── HH.css         # Estilos HH
│   └── ...            # Otros archivos
└── README.md          # Este archivo
```

## 🔧 Configuración

Copia `.env.example` a `.env` y ajusta las variables según tu entorno.

## 🚦 Estados del servidor

- **Development**: Logs detallados y manejo de errores completo
- **Production**: Logs optimizados y mensajes de error seguros

---

Desarrollado con ❤️ usando Express.js
# HHS
