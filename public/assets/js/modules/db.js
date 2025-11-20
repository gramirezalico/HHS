// IndexedDB handling extracted from bdLocal.js (modular)
let db;
export function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('Cajas', 2);
    req.onupgradeneeded = e => {
      const dbRef = e.target.result;
      if (!dbRef.objectStoreNames.contains('Cajas')) {
        dbRef.createObjectStore('Cajas', { keyPath: 'id' });
      }
      if (!dbRef.objectStoreNames.contains('Entries')) {
        dbRef.createObjectStore('Entries', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror = e => reject(e.target.error);
  });
}
function getStore(mode='readonly'){ return db.transaction('Cajas', mode).objectStore('Cajas'); }
function getEntryStore(mode='readonly'){ return db.transaction('Entries', mode).objectStore('Entries'); }
export function save(data){ return getStore('readwrite').add(data); }
export function clearAll(){ return new Promise((res,rej)=>{ const r=getStore('readwrite').clear(); r.onsuccess=()=>res(); r.onerror=e=>rej(e.target.error); }); }
export function getById(id){ return new Promise((res)=>{ getStore().get(id).onsuccess=e=>res(e.target.result); }); }
export function getAllData(){ return new Promise((res)=>{ getStore().getAll().onsuccess=e=>res(e.target.result); }); }
export function size(){ return new Promise((res)=>{ getStore().count().onsuccess=e=>res(e.target.result); }); }

// User entries (cajas/pallets creadas por el usuario)
export function addEntry(entry){ return new Promise((res,rej)=>{ const r=getEntryStore('readwrite').add({ ...entry, createdAt: Date.now() }); r.onsuccess=e=>res(e.target.result); r.onerror=e=>rej(e.target.error); }); }
export function getAllEntries(){ return new Promise((res,rej)=>{ const r=getEntryStore().getAll(); r.onsuccess=e=>res(e.target.result||[]); r.onerror=e=>rej(e.target.error); }); }
export function deleteEntry(id){ return new Promise((res,rej)=>{ const r=getEntryStore('readwrite').delete(id); r.onsuccess=()=>res(); r.onerror=e=>rej(e.target.error); }); }