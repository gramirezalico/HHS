import { initDB, size, getById, getAllData, save, clearAll, addEntry, getAllEntries, deleteEntry } from './modules/db.js';
import { fetchPackingList } from './modules/api.js';
import { setSelectCajas, wireTabs, renderEntries } from './modules/ui.js';

async function ensureData(){
  const count = await size();
  if(count === 0){
    const data = await fetchPackingList();
    if(data.status==='success'){
      await clearAll().catch(()=>{});
      data.value.forEach(item => save({ id: item.Packing_PkgCode, ...item }));
      setSelectCajas(data.value);
    }
  } else {
    const existing = await getAllData();
    setSelectCajas(existing);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  wireTabs();
  await ensureData();
  try { const entries = await getAllEntries(); renderEntries(entries); } catch {}
  const userName = localStorage.getItem('userName');
  if(userName) { const el=document.getElementById('userName'); if(el) el.textContent = userName; }

  const addButton = document.querySelector('.btn-add');
  const logoutButton = document.querySelector('.btn-logout');
  const closeMainBtn = document.querySelector('.btn-close-main');
  const modal = document.getElementById('addPackagingModal');
  const typeSelectionModal = document.getElementById('packagingTypeSelectionModal');
  if(addButton && modal){
    addButton.onclick=()=>{
      modal.style.display='flex';
      getAllData().then(d=> setSelectCajas(d));
      const cajaSelect=document.getElementById('packagingTypeList1');
      if(cajaSelect){
        cajaSelect.onchange=e=>{
          const val=e.target.value; if(!val) return;
          getById(val).then(data=>{ if(!data) return; ['length','width','height'].forEach(k=>{ const el=document.getElementById(k); if(el) el.value = data[`Packing_Pkg${k.charAt(0).toUpperCase()+k.slice(1)}`]; }); });
        };
      }
    };
  }
  if(logoutButton){ logoutButton.onclick=()=>{ localStorage.removeItem('userId'); localStorage.removeItem('userName'); window.location.href='/'; }; }

  // Close buttons & modal utilities
  const closeModalButtons = [
    ...document.querySelectorAll('.btn-close-packaging-modal'),
    ...document.querySelectorAll('.btn-close-pallet-boxes-modal'),
    ...document.querySelectorAll('.btn-cancel-selection')
  ];
  function hide(el){ if(el) el.style.display='none'; }
  function resetForm(){
    const form = document.getElementById('packagingForm');
    if(form){ form.reset(); }
  }
  closeModalButtons.forEach(btn => {
    btn.onclick = () => { hide(modal); hide(document.getElementById('editPalletBoxesModal')); hide(typeSelectionModal); resetForm(); };
  });
  if(closeMainBtn){
    closeMainBtn.onclick = () => { hide(modal); hide(typeSelectionModal); hide(document.getElementById('editPalletBoxesModal')); resetForm(); };
  }
  // Overlay click to close
  [modal, document.getElementById('editPalletBoxesModal'), typeSelectionModal].forEach(m => {
    if(m){ m.addEventListener('click', e => { if(e.target === m){ hide(m); } }); }
  });
  // ESC key
  document.addEventListener('keydown', e => { if(e.key==='Escape'){ hide(modal); hide(document.getElementById('editPalletBoxesModal')); hide(typeSelectionModal); } });

  // Accept pallet boxes (placeholder logic)
  const acceptPalletBtn = document.getElementById('acceptPalletBoxesBtn');
  if(acceptPalletBtn){ acceptPalletBtn.onclick = () => { console.log('Pallet boxes accepted'); hide(document.getElementById('editPalletBoxesModal')); }; }

  const countBtn=document.getElementById('miBoton');
  if(countBtn){ countBtn.onclick=()=> size().then(c=>console.log('Cantidad de registros:', c)); }

  // Handle save (form submit)
  const form = document.getElementById('packagingForm');
  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isCajasActive = document.getElementById('tabCajas')?.classList.contains('active');
      try {
        if(isCajasActive){
          const select = document.getElementById('packagingTypeList1');
          const pkgCode = select?.value || '';
          if(!pkgCode) return;
          const pkgData = await getById(pkgCode);
          const description = [...(select?.options||[])].find(o=>o.value===pkgCode)?.textContent || pkgCode;
          const entry = {
            kind: 'CAJA',
            pkgCode,
            description,
            length: document.getElementById('length')?.value || '',
            width: document.getElementById('width')?.value || '',
            height: document.getElementById('height')?.value || '',
            um: document.getElementById('um')?.value || (pkgData?.Packing_PkgUM || ''),
            unitWeight: document.getElementById('unitWeight')?.value || '',
            numPackages: document.getElementById('numPackages')?.value || ''
          };
          const id = await addEntry(entry);
          entry.id = id;
        } else {
          // Pallet: collect selected cajas and quantities + tipo + peso total
          const palletType = document.querySelector('input[name="palletType"]:checked')?.value || '';
          const palletTotalWeight = document.getElementById('palletTotalWeight')?.value || '';
          const rows = [...document.querySelectorAll('#tabPalletContent .form-row')];
          const items = [];
          rows.forEach(r=>{
            const select = r.querySelector('select.pallet-caja-select');
            const qtyInput = r.querySelector('input.number-input');
            if(select && qtyInput){
              const code = select.value;
              const qty = Number(qtyInput.value||0);
              if(code && qty>0){ items.push({ pkgCode: code, qty }); }
            }
          });
          const entry = { kind:'PALLET', items, palletType, palletTotalWeight };
          const id = await addEntry(entry);
          entry.id = id;
        }
        const entries = await getAllEntries();
        renderEntries(entries);
        hide(modal); resetForm();
      } catch(err){ console.error('Save error', err); }
    });
  }

  // Delete entry (event delegation)
  const list = document.getElementById('packagesList');
  if(list){
    list.addEventListener('click', async (e) => {
      const btn = e.target.closest('.btn-delete-entry');
      if(!btn) return;
      const id = Number(btn.getAttribute('data-id'));
      if(Number.isFinite(id)){
        try { await deleteEntry(id); const entries = await getAllEntries(); renderEntries(entries); } catch(err){ console.error('Delete error', err); }
      }
    });
  }
});