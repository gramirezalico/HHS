const express = require('express');
const path = require('path');
const { getData } = require('./utils/getData');
const app = express();
const PORT = process.env.PORT || 3000;
const pilot = true;
const EPICOR_API_BASE = 'https://alicoempaques-live.epicorsaas.com/server/api/v1/BaqSvc';
const EPICOR_API_BASE_P = 'https://alicoempaques-pilot.epicorsaas.com/server/api/v1/BaqSvc';

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

// ---------------------------------------------------------
// CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS (PUBLIC)
// ---------------------------------------------------------
// Esto hace que todo lo que esté dentro de 'public' sea accesible desde la raíz.
// Ejemplo: public/main.css -> http://localhost:3000/main.css
// Ejemplo: public/assets/js/main.js -> http://localhost:3000/assets/js/main.js
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d', // Cache por 1 día para mejorar rendimiento
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // No cachear HTML para asegurar que los usuarios siempre vean la última versión
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

// ---------------------------------------------------------
// RUTAS DE PÁGINAS (VISTAS)
// ---------------------------------------------------------

// Ruta principal (Login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Alias para login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Aplicación HH Principal
app.get('/hh', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HH.html'));
});

// Pantalla de Crear Caja
app.get('/CrearCaja', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'CrearCaja.html'));
});

// Pantalla de Editar Caja
app.get('/EditCajas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'EditCajas.html'));
});

// Pantalla de Ver Cajas
app.get('/ViewCajas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ViewCajas.html'));
});
app.get('/Lista', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Lista.html'));
});
// ---------------------------------------------------------
// API ENDPOINTS
// ---------------------------------------------------------

app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.get('/api/orderhh', async (req, res) => {
    // Obtener EmpID de query params o usar valor por defecto
    const OrderNum = req.query.OrderNum || req.query.OrderNum || '00010';

    let url = `${EPICOR_API_BASE_P}/CajasHHCliente(ALICO)/?OrderNum=${OrderNum}`;
    if (pilot) {
        url = `${EPICOR_API_BASE_P}/CajasHHCliente(ALICO)/?OrderNum=${OrderNum}`;
    }
    try {
        const response = await getData(url);
        if (!response) {
            return res.status(400).json({ status: 'error', message: 'No data found' });
        } else {
            const value = response.value;
            if (value) {

                res.json({ status: 'success', value });
             }
        }
    }
    catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }

})
app.get('/api/TI_HH_Listado', async (req, res) => {
    // Obtener EmpID de query params o usar valor por defecto
    const empId = req.query.EmpID || req.query.empId || '00010';

    let url = `${EPICOR_API_BASE_P}/TI_HH_Listado(ALICO)/?EmpID=${empId}&Plant=MfgSys`;
    if (pilot) {
        url = `${EPICOR_API_BASE_P}/TI_HH_Listado(ALICO)/?EmpID=${empId}&Plant=MfgSys`;
    }
    try {
        const response = await getData(url);
        if (!response) {
            return res.status(400).json({ status: 'error', message: 'No data found' });
        } else {
            const value = response.value;
            if (value) {
                // Agrupar y transformar los datos
                const groupedData = {};

                value.forEach(item => {
                    // Crear una clave única para agrupar
                    const groupKey = `${item.MtlQueue_LotNum}_${item.Customer_CustID}_${item.MtlQueue_OrderNum}_${item.MtlQueue_PartNum}`;

                    if (!groupedData[groupKey]) {
                        // Crear nuevo grupo
                        groupedData[groupKey] = {
                            ID: [],
                            Cliente: item.Customer_CustID,
                            Parte: item.MtlQueue_PartNum,
                            Cantidad: 0,
                            Bin: [],
                            OV: item.MtlQueue_OrderNum,
                            LotNum: item.MtlQueue_LotNum,
                            EmpID: item.MtlQueue_SelectedByEmpID
                        };
                    }

                    // Agregar datos al grupo
                    groupedData[groupKey].ID.push(item.MtlQueue_MtlQueueSeq);
                    groupedData[groupKey].Bin.push(item.MtlQueue_FromBinNum);
                    groupedData[groupKey].Cantidad += parseFloat(item.MtlQueue_Quantity);
                });

                // Convertir el objeto agrupado a array y formatear
                const organizedData = Object.values(groupedData).map(group => ({
                    ID: group.ID.join(','),
                    Cliente: group.Cliente,
                    Parte: group.Parte,
                    Cantidad: group.Cantidad.toFixed(0),
                    Bin: group.Bin.join(','),
                    OV: group.OV,
                    LotNum: group.LotNum,
                    EmpID: group.EmpID
                }));

                res.json({ status: 'success', value: organizedData });
            }
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.post('/api/login', async (req, res) => {
    const { id } = req.body;
    console.log('Login attempt for ID:', id);

    const url = `${EPICOR_API_BASE}/HHLogin(ALICO)/?idEmp=${id}`;

    try {
        const response = await getData(url);
        if (!response || !response.value || response.value.length === 0) {
            console.log('Login failed or empty response');
            return res.status(401).json({ status: 'error', message: 'Invalid ID' });
        } else {
            const value = response.value[0];
            console.log('Login successful for ID:', value);
            res.json({ status: 'success', ...value });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});
app.post('/api/getCaja', async (req, res) => {
    const { orderNum, orderLine } = req.body;
    const myHeaders = new Headers();
    let newExtructure = { orderNum: orderNum, orderLine: orderLine };
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(newExtructure),
        redirect: "follow"
    };

    try {
        const response = await fetch("https://apps.alico-sa.com/webhook/6baaad35-d336-4fb4-b0f6-a42c4feaa2b8?dataBase=CajasOrdenes", requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Intentamos parsear como JSON, si falla devolvemos texto
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const result = await response.json();
            res.json(result); // Enviamos el JSON al frontend
        } else {
            const text = await response.text();
            res.send(text); // Enviamos texto plano si no es JSON
        }

    } catch (error) {
        console.error("Error en /api/getCaja:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
})
app.post('/api/cajasPorEmp', async (req, res) => {
    console.log('Datos recibidos:', req.body);

    try {
        const ordersArray = req.body;

        if (!ordersArray || !Array.isArray(ordersArray) || ordersArray.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No se recibieron datos válidos' });
        }

        const newExtructure = {
            unixtimestamp: new Date().getTime(),
            orderNum: ordersArray[0].orderNumber,
            orderLine: ordersArray[0].orderLine,
            ordersArray: ordersArray
        };

        const response = await fetch("https://apps.alico-sa.com/webhook/ea609c91-64c3-463f-b21e-82156cfba1box?dataBase=CajasOrdenes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExtructure)
        });

        if (!response.ok) {
            throw new Error(`Error en webhook: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        let result;

        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        console.log('Respuesta de webhook:', result);
        res.json({ status: 'success', data: result });

    } catch (error) {
        console.error('Error en /api/cajasPorEmp:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
})
app.get('/api/packingList', async (req, res) => {
    const url = `${EPICOR_API_BASE}/TI_packingList(ALICO)/`;

    try {
        const response = await getData(url);
        if (!response) {
            return res.status(400).json({ status: 'error', message: 'No data found' });
        } else {
            const value = response.value;
            if (value) {
                res.json({ status: 'success', value });
            }
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});

// ---------------------------------------------------------
// MANEJO DE ERRORES
// ---------------------------------------------------------

// 404 - Redirigir al login si no encuentra la ruta
app.use((req, res) => {
    // Opcional: Podrías enviar un 404.html personalizado si lo tuvieras
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error global
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
    console.log(`📦 Crear Caja: http://localhost:${PORT}/CrearCaja`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ===================================');
});

module.exports = app;