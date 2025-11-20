// UI helpers extracted / unified from controller.js & hh.js
export function setSelectCajas(data){
  const cajas = data.filter(item => item.Packing_Description && item.Packing_Description.includes('CAJA'));
  const mainSelect = document.getElementById('packagingTypeList1');
  if(mainSelect){
    mainSelect.innerHTML='';
    const def = document.createElement('option'); def.value=''; def.textContent='Seleccione tipo embalaje...'; mainSelect.appendChild(def);
  }
  const palletSelects = document.querySelectorAll('.pallet-caja-select');
  palletSelects.forEach(sel=>{ sel.innerHTML=''; const d=document.createElement('option'); d.value=''; d.textContent='Seleccione tipo embalaje...'; sel.appendChild(d); });
  cajas.forEach(item => {
    const optMain = document.createElement('option'); optMain.value=item.Packing_PkgCode; optMain.textContent=item.Packing_Description;
    if(mainSelect) mainSelect.appendChild(optMain.cloneNode(true));
    palletSelects.forEach(sel => sel.appendChild(optMain.cloneNode(true)));
  });
}
export function wireTabs(){
  const tabCajas=document.getElementById('tabCajas');
  const tabPallet=document.getElementById('tabPallet');
  const cajasContent=document.getElementById('tabCajasContent');
  const palletContent=document.getElementById('tabPalletContent');
  if(!tabCajas||!tabPallet) return;
  tabCajas.onclick=()=>{ tabCajas.classList.add('active'); tabPallet.classList.remove('active'); cajasContent.style.display=''; palletContent.style.display='none'; };
  tabPallet.onclick=()=>{ tabPallet.classList.add('active'); tabCajas.classList.remove('active'); cajasContent.style.display='none'; palletContent.style.display=''; };
}

export function renderEntries(entries){
  const container = document.getElementById('packagesList');
  if(!container) return;
  if(!entries || entries.length===0){
    container.innerHTML = '<p style="color:#666;">No hay embalajes guardados.</p>';
    return;
  }
  container.innerHTML = '';
  entries.forEach(e => {
    const div = document.createElement('div');
    div.className = 'package-item';
    const when = new Date(e.createdAt||Date.now()).toLocaleString();
    if(e.kind==='CAJA'){
      div.innerHTML = `
        <div><strong>CAJA</strong> - ${e.description||e.pkgCode}</div>
        <div>Dimensiones: L ${e.length||''} x A ${e.width||''} x H ${e.height||''} ${e.um||''}</div>
        <div>Peso unit.: ${e.unitWeight||''} | Cant.: ${e.numPackages||''}</div>
        <div style="font-size:12px;color:#777;">${when}</div>
        <div><button class="btn btn-delete-entry" data-id="${e.id}">Eliminar</button></div>
      `;
    } else if(e.kind==='PALLET'){
      const items = (e.items||[]).filter(i=>i.pkgCode && i.qty>0).map(i=>`${i.pkgCode} x ${i.qty}`).join(', ');
      div.innerHTML = `
        <div><strong>PALLET</strong></div>
        <div>Cajas: ${items||'—'}</div>
        <div style="font-size:12px;color:#777;">${when}</div>
        <div><button class="btn btn-delete-entry" data-id="${e.id}">Eliminar</button></div>
      `;
    }
    container.appendChild(div);
  });
}