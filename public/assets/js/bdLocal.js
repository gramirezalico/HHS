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

    // Ahora sí puedes usar tus funciones
    size(count => {
      console.log('Cantidad de registros:', count);
        if (count === 0) {
           T();
        } else {
             getAllData(data => {
                console.log('Datos:', data);
                setSelectCajas(data);
                });
        }
    });

   
  };
 
function save(data) { db.transaction('Cajas','readwrite').objectStore('Cajas').add(data); }
function getById(id, cb) { db.transaction('Cajas').objectStore('Cajas').get(id).onsuccess = e => cb(e.target.result); }

function size(cb) {
  const tx = db.transaction('Cajas', 'readwrite');
  const store = tx.objectStore('Cajas');
  const countRequest = store.count();

  countRequest.onsuccess = e => cb(e.target.result);
  countRequest.onerror = e => console.error('Error al contar:', e.target.error);
}

function getAllData(cb) {
    
  const tx = db.transaction('Cajas', 'readwrite');
  const store = tx.objectStore('Cajas');
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = e => cb(e.target.result);
  getAllRequest.onerror = e => console.error('Error al obtener datos:', e.target.error);
}
