const express = require('express');
const path = require('path');
const { getData } = require('./utils/getData');
const app = express();
const PORT = process.env.PORT || 3000;
const EPICOR_API_BASE = 'https://centralusdtapp73.epicorsaas.com/SaaS5333/api/v1/BaqSvc';
// Middleware de seguridad y configuración
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Headers de seguridad
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Middleware de logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    next();
});

// Servir archivos estáticos desde la carpeta public con configuración mejorada
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d', // Cache por 1 día
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Servir archivos estáticos desde la raíz (para archivos como favicon, robots.txt)
app.use(express.static(__dirname, {
    maxAge: '1h',
    index: false // No servir index.html desde aquí
}));

// Ruta principal - servir index.html desde public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Alias de login para compatibilidad
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para la aplicación HH
app.get('/hh', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HH.html'));
});

// Ruta para la aplicación HH
app.get('/CrearCaja', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'CrearCaja.html'));
});
// API endpoints para futuras funcionalidades
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Ruta para health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});
app.post('/api/login', async (req, res) => {
    const { id } = req.body;
    console.log('Login attempt for ID:', id);
    // Aquí iría la lógica de autenticación
    const url = `${EPICOR_API_BASE}/HHLogin(ALICO)/?idEmp=${id}`;

    // Obtener datos de la API
    const response = await getData(url);
    if (!response) {
        console.log(response)
        return res.status(400).json({ status: 'error', message: 'Invalid ID' });
    } else {
        value = response.value[0];
        console.log('Login successful for ID:', value);
        if (value) {
            console.log('Login successful for ID:', value);
            res.json({ status: 'success', ...value });
        }

    }
})
;
app.get('/api/packingList', async (req, res) => {
    // Aquí iría la lógica de autenticación
    const url = `${EPICOR_API_BASE}/TI_packingList(ALICO)/`;

    // Obtener datos de la API
    const response = await getData(url);
    if (!response) {
        console.log(response)
        return res.status(400).json({ status: 'error', message: 'Invalid ID' });
    } else {
        value = response.value
        if (value) {
            res.json({ status: 'success', value });
        }

    }
});
// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('💤 Process terminated');
    });
});

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log('🚀 ===================================');
    console.log(`🌟 Servidor HH iniciado exitosamente`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📁 Archivos públicos: http://localhost:${PORT}/`);
    console.log(`🎯 HH App: http://localhost:${PORT}/hh`);
    console.log(`🔍 API Status: http://localhost:${PORT}/api/status`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ===================================');
});

module.exports = app;