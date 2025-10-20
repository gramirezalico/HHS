// Minimal IndexedDB init and save
let db;
const req = indexedDB.open('Cajas', 1);

req.onupgradeneeded = function(event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains('Cajas')) {
    db.createObjectStore('Cajas', { keyPath: 'id', autoIncrement: true });
  }
};

//req.onupgradeneeded = e => e.target.result.createObjectStore('Cajas', {keyPath:'id'});

 req.onsuccess = function (event) {
    db = event.target.result;
    console.log('[bdLocal.js] Database ready');

    // Solo cargar automáticamente en página principal
    if (window.location.pathname.includes('PaginaPrincipal.html') || window.location.pathname === '/hh') {
        // Ahora sí puedes usar tus funciones
        size(count => {
          console.log('Cantidad de registros:', count);
            if (count === 0) {
               T();
            } else {
                 getAllData(data => {
                    console.log('Datos:', data);
                    if (typeof setSelectCajas === 'function') {
                        setSelectCajas(data);
                    }
                    });
            }
        });
    }
   
  };
 

window.save = function(data) { db.transaction('Cajas','readwrite').objectStore('Cajas').add(data); };
window.clearAll = function(cb) {
  const tx = db.transaction('Cajas', 'readwrite');
  const store = tx.objectStore('Cajas');
  const clearRequest = store.clear();
  clearRequest.onsuccess = () => { if (cb) cb(); };
  clearRequest.onerror = e => { console.error('Error al limpiar:', e.target.error); if (cb) cb(); };
};
window.getById = function(id, cb) { db.transaction('Cajas').objectStore('Cajas').get(id).onsuccess = e => cb(e.target.result); };

function size(cb) {
  const tx = db.transaction('Cajas', 'readwrite');
  const store = tx.objectStore('Cajas');
  const countRequest = store.count();

  countRequest.onsuccess = e => cb(e.target.result);
  countRequest.onerror = e => console.error('Error al contar:', e.target.error);
}

window.getAllData = function(cb) {
  const tx = db.transaction('Cajas', 'readwrite');
  const store = tx.objectStore('Cajas');
  const getAllRequest = store.getAll();
  getAllRequest.onsuccess = e => cb(e.target.result);
  getAllRequest.onerror = e => console.error('Error al obtener datos:', e.target.error);
}
