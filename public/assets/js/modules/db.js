let db;
export function initDB(){
  return new Promise((res,rej)=>{
    const req = indexedDB.open('Cajas',2);
    req.onupgradeneeded = e => {
      const dbUp = e.target.result;
      if(!dbUp.objectStoreNames.contains('Cajas')) dbUp.createObjectStore('Cajas',{keyPath:'id'});
      if(!dbUp.objectStoreNames.contains('Entries')) dbUp.createObjectStore('Entries',{keyPath:'id',autoIncrement:true});
    };
    req.onsuccess = e => { db=e.target.result; res(db); };
    req.onerror = e => rej(e.target.error);
  });
}
function store(name, mode='readonly'){ return db.transaction(name,mode).objectStore(name); }
export function save(d){ return store('Cajas','readwrite').add(d); }
export function clearAll(){ return new Promise((res,rej)=>{ const r=store('Cajas','readwrite').clear(); r.onsuccess=()=>res(); r.onerror=e=>rej(e.target.error); }); }
export function size(){ return new Promise(r=>{ store('Cajas').count().onsuccess=e=>r(e.target.result); }); }
export function getAllData(){ return new Promise(r=>{ store('Cajas').getAll().onsuccess=e=>r(e.target.result||[]); }); }
export function getById(id){ return new Promise(r=>{ store('Cajas').get(id).onsuccess=e=>r(e.target.result); }); }
// Entries
export function addEntry(entry){ return new Promise((res,rej)=>{ const r=store('Entries','readwrite').add({...entry,createdAt:Date.now()}); r.onsuccess=e=>res(e.target.result); r.onerror=e=>rej(e.target.error); }); }
export function getAllEntries(){ return new Promise((res,rej)=>{ const r=store('Entries').getAll(); r.onsuccess=e=>res(e.target.result||[]); r.onerror=e=>rej(e.target.error); }); }
export function deleteEntry(id){ return new Promise((res,rej)=>{ const r=store('Entries','readwrite').delete(id); r.onsuccess=()=>res(); r.onerror=e=>rej(e.target.error); }); }
