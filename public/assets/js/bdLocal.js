// Minimal IndexedDB init and save
let db;
const req = indexedDB.open('Cajas', 1);

req.onupgradeneeded = function(event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains('Cajas')) {
    db.createObjectStore('Cajas', { keyPath: 'id', autoIncrement: true });
  }
  // Add a separate store for Pallets so we can save pallet types independently
  if (!db.objectStoreNames.contains('Pallets')) {
    db.createObjectStore('Pallets', { keyPath: 'id', autoIncrement: true });
  }
};

//req.onupgradeneeded = e => e.target.result.createObjectStore('Cajas', {keyPath:'id'});

 req.onsuccess = function (event) {
    db = event.target.result;
    console.log('[bdLocal.js] Database ready');

    // Solo cargar automáticamente en página principal
    if (window.location.pathname.includes('PaginaPrincipal.html') || window.location.pathname === '/hh') {
        // Ahora sí puedes usar tus funciones
        // get counts for both stores and decide whether to fetch from server
        size(countCajas => {
          sizePallets(countPallets => {
            console.log('Cantidad de registros - Cajas:', countCajas, 'Pallets:', countPallets);
            if (countCajas === 0 && countPallets === 0) {
              T();
            } else {
              // load both local stores and pass combined data to setSelectCajas
              getAllData(cajas => {
                getAllPallets(pallets => {
                  const combined = (cajas || []).concat(pallets || []);
                  console.log('Datos locales cargados:', combined);
                  if (typeof setSelectCajas === 'function') {
                    setSelectCajas(combined);
                  }
                });
              });
            }
          });
        });
    }
   
  };
 

window.save = function(data) { db.transaction('Cajas','readwrite').objectStore('Cajas').add(data); };
// Save a pallet record into the Pallets object store
window.savePallet = function(data) { db.transaction('Pallets','readwrite').objectStore('Pallets').add(data); };
window.clearAll = function(cb) {
  const tx = db.transaction('Cajas', 'readwrite');
  const store = tx.objectStore('Cajas');
  const clearRequest = store.clear();
  clearRequest.onsuccess = () => { if (cb) cb(); };
  clearRequest.onerror = e => { console.error('Error al limpiar:', e.target.error); if (cb) cb(); };
};
window.clearAllPallets = function(cb) {
  const tx = db.transaction('Pallets', 'readwrite');
  const store = tx.objectStore('Pallets');
  const clearRequest = store.clear();
  clearRequest.onsuccess = () => { if (cb) cb(); };
  clearRequest.onerror = e => { console.error('Error al limpiar pallets:', e.target.error); if (cb) cb(); };
};
window.getById = function(id, cb) { db.transaction('Cajas').objectStore('Cajas').get(id).onsuccess = e => cb(e.target.result); };

// Helpers for pallets
window.getByIdPallet = function(id, cb) { db.transaction('Pallets').objectStore('Pallets').get(id).onsuccess = e => cb(e.target.result); };

function size(cb) {
  const tx = db.transaction('Cajas', 'readwrite');
  const store = tx.objectStore('Cajas');
  const countRequest = store.count();

  countRequest.onsuccess = e => cb(e.target.result);
  countRequest.onerror = e => console.error('Error al contar:', e.target.error);
}

function sizePallets(cb) {
  const tx = db.transaction('Pallets', 'readwrite');
  const store = tx.objectStore('Pallets');
  const countRequest = store.count();

  countRequest.onsuccess = e => cb(e.target.result);
  countRequest.onerror = e => console.error('Error al contar pallets:', e.target.error);
}

window.getAllData = function(cb) {
  const tx = db.transaction('Cajas', 'readwrite');
  const store = tx.objectStore('Cajas');
  const getAllRequest = store.getAll();
  getAllRequest.onsuccess = e => cb(e.target.result);
  getAllRequest.onerror = e => console.error('Error al obtener datos:', e.target.error);
}

window.getAllPallets = function(cb) {
  const tx = db.transaction('Pallets', 'readwrite');
  const store = tx.objectStore('Pallets');
  const getAllRequest = store.getAll();
  getAllRequest.onsuccess = e => cb(e.target.result);
  getAllRequest.onerror = e => console.error('Error al obtener pallets:', e.target.error);
}
