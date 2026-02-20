document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  // Si decidimos mostrar usuario aquí podríamos tener un span opcional
  const tabCajas = document.getElementById('tabCajas');
  const tabPallet = document.getElementById('tabPallet');
  const cajasContent = document.getElementById('tabCajasContent');
  const palletContent = document.getElementById('tabPalletContent');

  function activate(tab){
    if(tab==='cajas'){
      tabCajas.classList.add('active');
      tabPallet.classList.remove('active');
      cajasContent.style.display='';
      palletContent.style.display='none';
    } else {
      tabPallet.classList.add('active');
      tabCajas.classList.remove('active');
      cajasContent.style.display='none';
      palletContent.style.display='';
    }
  }
  if(tabCajas && tabPallet){
    tabCajas.addEventListener('click',()=>activate('cajas'));
    tabPallet.addEventListener('click',()=>{
      activate('pallet');
      if(typeof getAllData==='function' && typeof setSelectCajas==='function'){
        getAllData(data=> setSelectCajas(data));
      }
    });
  }

  // Helpers
  function createCajaRow(type='CAJA'){ // dynamic caja row
    const row = document.createElement('div');
    row.className='form-row';
    row.style.display='flex'; row.style.gap='1em'; row.style.marginBottom='0.9em';
    row.innerHTML = `
      <div class="form-group" style="flex:1 1 70%; min-width:200px;">
        <label style="min-width:110px;">Tipo embalaje</label>
        <select class="caja-select" style="width:100%;"></select>
      </div>
      <div class="form-group" style="flex:1 1 30%; min-width:110px;">
        <label style="min-width:50px;">Cant.</label>
        <input type="number" class="caja-qty number-input" value="" min="0" />
      </div>
      <button type="button" class="btn btn-remove-row" style="align-self:flex-end; padding:0.4em 0.8em; background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;">✕</button>
    `;
    return row;
  }
  function createPalletRow(){
    const row = document.createElement('div');
    row.className='form-row';
    row.style.display='flex'; row.style.gap='1em'; row.style.marginBottom='0.8em';
    row.innerHTML = `
      <div class="form-group" style="flex:1 1 70%; min-width:200px;">
        <label style="min-width:110px;">Tipo embalaje</label>
        <select class="pallet-caja-select" style="width:100%;"></select>
      </div>
      <div class="form-group" style="flex:1 1 30%; min-width:110px;">
        <label style="min-width:50px;">Cant.</label>
        <input type="number" class="pallet-qty number-input" value="" min="0" />
      </div>
      <button type="button" class="btn btn-remove-row" style="align-self:flex-end; padding:0.4em 0.8em; background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;">✕</button>
    `;
    return row;
  }
  function populateSelect(select, data){
    select.innerHTML='';
    const def=document.createElement('option'); def.value=''; def.textContent='Seleccione tipo embalaje...'; select.appendChild(def);
    data.filter(d=> d.Packing_Description && d.Packing_Description.includes('CAJA'))
        .forEach(d=>{ const o=document.createElement('option'); o.value=d.Packing_PkgCode; o.textContent=d.Packing_Description; select.appendChild(o); });
  }
  function recalcPalletWeight(){
    const weightSpan = document.getElementById('palletWeightCalc');
    if(!weightSpan || typeof getById!=='function') return;
    const typeBaseWeights = { NORMAL: 10, MEDIANO: 15, GRANDE: 20 };
    const palletType = document.querySelector('input[name="palletType"]:checked')?.value || '';
    let total = palletType? typeBaseWeights[palletType]||0 : 0;
    const rows = document.querySelectorAll('#palletRows .form-row');
    const promises=[];
    rows.forEach(r=>{
      const sel=r.querySelector('select');
      const qty=r.querySelector('input');
      const code=sel?.value; const q=Number(qty?.value||0);
      if(code && q>0){ promises.push(new Promise(res=>{ getById(code, data=>{ const w= Number(data?.Packing_PkgWeight||0); res(w*q); }); })); }
    });
    Promise.all(promises).then(values=>{ total += values.reduce((a,b)=>a+b,0); weightSpan.textContent = total.toFixed(2); });
  }

  // Inicializar filas y selects
  if(typeof getAllData==='function'){
    getAllData(data => {
      const cajasRows = document.getElementById('cajasRows');
      const palletRows = document.getElementById('palletRows');
      // Añadir 4 filas por defecto (como screenshot)
      for(let i=0;i<4;i++){ const r=createCajaRow(); cajasRows.appendChild(r); populateSelect(r.querySelector('select'), data); }
      for(let i=0;i<2;i++){ const r=createPalletRow(); palletRows.appendChild(r); populateSelect(r.querySelector('select'), data); }
    });
  }

  // Botones agregar fila
  const addCajaBtn=document.getElementById('addCajaRowBtn');
  if(addCajaBtn && typeof getAllData==='function'){ addCajaBtn.addEventListener('click', ()=>{ getAllData(data=>{ const r=createCajaRow(); document.getElementById('cajasRows').appendChild(r); populateSelect(r.querySelector('select'), data); }); }); }
  const addPalletBtn=document.getElementById('addPalletRowBtn');
  if(addPalletBtn && typeof getAllData==='function'){ addPalletBtn.addEventListener('click', ()=>{ getAllData(data=>{ const r=createPalletRow(); document.getElementById('palletRows').appendChild(r); populateSelect(r.querySelector('select'), data); recalcPalletWeight(); }); }); }

  // Delegación para eliminar fila
  document.addEventListener('click', e=>{
    const btn=e.target.closest('.btn-remove-row');
    if(btn){ const parent=btn.parentElement; parent?.remove(); recalcPalletWeight(); }
  });

  // Recalcular peso pallet en cambios
  document.addEventListener('change', e=>{
    if(e.target.matches('#palletRows select') || e.target.matches('#palletRows input') || e.target.matches('input[name="palletType"]')){ recalcPalletWeight(); }
  });

  const form = document.getElementById('packagingForm');
  if(form){
    form.addEventListener('submit', e => {
      e.preventDefault();
      const isCajasActive = tabCajas.classList.contains('active');
      if(isCajasActive){
        const rows=[...document.querySelectorAll('#cajasRows .form-row')];
        const items=[]; let valid=true;
        rows.forEach(r=>{ const sel=r.querySelector('select'); const qty=r.querySelector('input'); const code=sel.value; const q=qty.value.trim(); if(code){ if(!/^[0-9]+$/.test(q)){ valid=false; qty.classList.add('error'); } else { items.push({ codigo:code, cantidad:Number(q) }); } } });
        if(!valid){ alert('Corrige cantidades (solo números)'); return; }
        if(items.length===0){ alert('Agrega al menos una caja.'); return; }
        console.log('[GUARDAR CAJAS]', items);
        alert('Cajas guardadas (placeholder).');
      } else {
        const palletType = document.querySelector('input[name="palletType"]:checked')?.value || '';
        if(!palletType){ alert('Selecciona tipo de pallet.'); return; }
        const pesoTotalCalc = document.getElementById('palletWeightCalc')?.textContent || '0';
        const rows=[...document.querySelectorAll('#palletRows .form-row')];
        const cajas=[]; rows.forEach(r=>{ const sel=r.querySelector('select'); const qty=r.querySelector('input'); const code=sel.value; const q=Number(qty.value||0); if(code && q>0){ cajas.push({ codigo:code, cantidad:q }); } });
        if(cajas.length===0){ alert('Agrega al menos una caja en el pallet.'); return; }
        const dataPallet={ tipo:'PALLET', palletType, pesoTotal: Number(pesoTotalCalc), cajas };
        console.log('[GUARDAR PALLET]', dataPallet);
        alert('Pallet guardado (placeholder).');
      }
      window.location.href='HH.html';
    });
  }
});