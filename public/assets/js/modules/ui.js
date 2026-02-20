import { getAllEntries, deleteEntry } from './db.js';

export function populateSelect(selectEl, data){
  selectEl.innerHTML = '<option value="">Seleccione caja...</option>' + data.map(d=>`<option value="${d.Packing_PkgCode}">${d.Packing_PkgCode} - ${d.Packing_Description}</option>`).join('');
}

export function renderEntries(listEl){
  getAllEntries().then(entries=>{
    if(!entries.length){ listEl.innerHTML='<li>No hay registros</li>'; return; }
    listEl.innerHTML = entries.map(e=>`<li data-id="${e.id}">
      <strong>${e.kind}</strong> ${e.pkgCode||''} ${Array.isArray(e.pkgCodes)?e.pkgCodes.join(', '):''}
      ${e.palletType?` Tipo:${e.palletType}`:''}
      ${e.palletTotalWeight?` Peso:${e.palletTotalWeight}`:''}
      <button class="delEntry">X</button>
    </li>`).join('');
  });
}

export function wireEntryDeletion(container){
  container.addEventListener('click', e=>{
    if(e.target.classList.contains('delEntry')){
      const li = e.target.closest('li');
      const id = Number(li.getAttribute('data-id'));
      deleteEntry(id).then(()=>renderEntries(container));
    }
  });
}
