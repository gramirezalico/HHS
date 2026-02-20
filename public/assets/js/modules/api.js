// API calls extracted from controller/login logic
// Base relativo para funcionar detrás de un reverse proxy.
// Permite definir opcionalmente window.APP_BASE = 'subpath/' antes de cargar este script.
function base(){
  let b = (window.APP_BASE || '').trim();
  if(b && !b.endsWith('/')) b += '/';
  return b;
}
export async function fetchPackingList(){
  const resp = await fetch(base() + 'api/packingList');
  if(!resp.ok) throw new Error('packingList fetch failed: ' + resp.status);
  return resp.json();
}
export async function loginUser(id){
  const resp = await fetch(base() + 'api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id}) });
  if(!resp.ok) throw new Error('login failed: ' + resp.status);
  return resp.json();
}