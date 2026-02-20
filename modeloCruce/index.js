const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 6501;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints
const EPICOR_URL = 'https://apps.alico-sa.com/webhook/ac0aaeb3-00c1-47a0-83b8-namano';
const CAJAS_URL = 'https://apps.alico-sa.com/webhook/HH112as233a33a3a3a33a3a3a33as3d3as3d3as3d3as3d';
const EPICOR_POST_URL = 'https://apps.alico-sa.com/webhook/4321116b-7876-4783-8271-0c7fbdc0fe50Epicor';
const DeleteCajas_URL = 'https://apps.alico-sa.com/webhook/bc6faeb3-c4ab-407a-861a-0fc6fc3efe08';
const UPDATE_STATUS_URL = 'https://apps.alico-sa.com/webhook/ac0aaeb3-00c1-47a0-83b8-do3sa'; // Reemplaza con la URL correcta

// Función para cruzar datos
async function cruzarDatos(epicor, cajas) {

  let resultado = [];
  let epicorIdsUnicos = new Set(); // Para almacenar IDs únicos

  for (let c of cajas) {
    let caja = c.ordersArray || [];
    
    for (let caja2 of caja) {
      let match = epicor.find(e =>
        e.shipdtl_ordernum === Number(caja2.orderNumber) &&
        e.shipdtl_orderline === Number(caja2.orderLine)
      );

      // Agregar el _id de la caja principal
      caja2['_id'] = c['_id'];

      if (match) {

        let objEpicorCaja = {}
        objEpicorCaja["Key1"] = caja2.orderNumber + '-' + caja2.orderLine+ '-' +caja2.codigo+ '-' + caja2.peso+match.shipdtl_packnum + '-' +match.shipdtl_packline+ '-' + match.created_at;
        objEpicorCaja["Number01"] = caja2.alto;
        objEpicorCaja["Number02"] = caja2.ancho;
        objEpicorCaja["Number03"] = caja2.unidades;
        objEpicorCaja["Number04"] = caja2.largo;
        objEpicorCaja["Number05"] = caja2.peso;
        objEpicorCaja["ShortChar01"] = caja2.orderNumber;
        objEpicorCaja["ShortChar02"] = caja2.orderLine;
        objEpicorCaja["ShortChar03"] = match.shipdtl_packnum;
        objEpicorCaja["ShortChar04"] = match.shipdtl_packline;
        objEpicorCaja["ShortChar05"] = caja2.codigo;
        objEpicorCaja["ShortChar06"] = "";
        objEpicorCaja["ShortChar07"] = caja2.empId;
        
        // Enviar a Epicor
        try {
          await axios.post(EPICOR_POST_URL, objEpicorCaja);
          console.log(`Registro enviado a Epicor: ${objEpicorCaja.Key1}`);
          await axios.post(DeleteCajas_URL, { _id: caja2['_id'] });
          
          // Agregar el ID único de epicor al Set
          epicorIdsUnicos.add(match.id);

        } catch (error) {
          console.error(`Error al enviar a Epicor: ${error.message}`);
        }
        
        resultado.push({
          caja2,
          epicor: match
        });
      }
    }
  }

  // Convertir el Set a array de objetos con la estructura [{id: "..."}, {id: "..."}]
  const idsArray = Array.from(epicorIdsUnicos).map(id => ({ id }));
  
  // Enviar los IDs únicos al endpoint de actualización de status
  if (idsArray.length > 0) {
    try {
      //await axios.post(UPDATE_STATUS_URL, idsArray);
      // es en un for por cada uno madaremos esto 
      for(let idObj of idsArray){
        await axios.post(UPDATE_STATUS_URL, {"id": idObj.id});
      }
      //"id"
      console.log(`${idsArray.length} IDs únicos enviados para actualizar status`);
    } catch (error) {
      console.error(`Error al actualizar status: ${error.message}`);
    }
  }

  return resultado;
}

// Endpoint principal para obtener los datos cruzados
app.get('/cruce', async (req, res) => {
  try {
    console.log('Obteniendo datos de Epicor...');
    const epicorResponse = await axios.get(EPICOR_URL);
    const epicor = epicorResponse.data || epicorResponse.data;

    console.log('Obteniendo datos de Cajas...');
    const cajasResponse = await axios.get(CAJAS_URL);
    const cajas = cajasResponse.data;

    console.log('Cruzando datos...');
    const resultado = await cruzarDatos(epicor, cajas);

    console.log(`Cruce completado. ${resultado.length} registros encontrados.`);
    
    res.json({
      success: true,
      count: resultado.length,
      data: resultado
    });

  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null
    });
  }
});

// Endpoint para verificar el estado del servidor
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para obtener solo datos de Epicor
app.get('/epicor', async (req, res) => {
  try {
    const response = await axios.get(EPICOR_URL);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener solo datos de Cajas
app.get('/cajas', async (req, res) => {
  try {
    const response = await axios.get(CAJAS_URL);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Endpoint principal: http://localhost:${PORT}/cruce`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
