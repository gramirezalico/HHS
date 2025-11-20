// API calls extracted from controller/login logic
export async function fetchPackingList(){
  const resp = await fetch('/api/packingList');
  if(!resp.ok) throw new Error('packingList fetch failed');
  return resp.json();
}
export async function loginUser(id){
  const resp = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id}) });
  if(!resp.ok) throw new Error('login failed');
  return resp.json();
}