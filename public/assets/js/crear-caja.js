const urlParams = new URLSearchParams(window.location.search);
const ordenParam = urlParams.get('orden');
const empIdParam = urlParams.get('EmpId');
document.addEventListener('DOMContentLoaded', async () => {
    try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                  "orderNum": ordenParam
                });

                const requestOptions = {
                  method: "POST",
                  headers: myHeaders,
                  body: raw,
                  redirect: "follow"
                };

                const response = await fetch("./api/getCaja", requestOptions);
                const result = await response.json();

                if (Object.keys(result).length > 0) {
                    const newUrl = new URL("EditCajas", window.location.href);
                    newUrl.search = window.location.search;
                    window.location.href = newUrl.toString();
                    return;
                }
            } catch (error) {
                console.error('Error fetching caja data:', error);
            }
    const packingListSelectCajas = document.getElementById('packingListSelectCajas');
    const packingListSelectPallet = document.getElementById('packingListSelectPallet');
    const packingListSelectOtro = document.getElementById('packingListSelectOtro');
    const tipoCajaRadios = document.querySelectorAll('input[name="tipoCaja"]');
    const itemsContainer = document.getElementById('items-container');
    const itemTemplate = document.getElementById('item-card-template');
    let originalItems = [];
    let itemCounter = 0;
    // Store categorized lists globally
    let cajasList = [];
    let palletsList = [];
    let otrosList = [];

    function populateSelect(selectEl, items, placeholderText){
        if(!selectEl) return;
        selectEl.innerHTML = '';
        if (placeholderText) {
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.disabled = true;
            placeholder.selected = true;
            placeholder.textContent = placeholderText;
            selectEl.appendChild(placeholder);
        }
        const frag = document.createDocumentFragment();
        for(const item of items){
            if(!item) continue;
            const option = document.createElement('option');
            option.value = (item.Packing_PkgCode || '');
            // Format: Description ---- Code
            option.textContent = `${item.Packing_Description || ''} ---- ${item.Packing_PkgCode || ''}`.trim();
            option.dataset.item = JSON.stringify(item);
            frag.appendChild(option);
        }
        selectEl.appendChild(frag);
    }

    function classifyAndPopulate(items){
        cajasList = [];
        palletsList = [];
        otrosList = [];
        for(const it of items){
            const desc = (it.Packing_Description || '').toLowerCase();
            if(desc.includes('caja')) cajasList.push(it);
            else if(desc.includes('pallet')) palletsList.push(it);
            else otrosList.push(it);
        }
        populateSelect(packingListSelectCajas, cajasList, 'Seleccione CAJA...');
        populateSelect(packingListSelectPallet, palletsList, 'Seleccione PALLET...');
        populateSelect(packingListSelectOtro, otrosList, 'Seleccione OTRO...');
    }

    function getListByType(tipo) {
        if (tipo === 'cajas') return cajasList;
        if (tipo === 'pallet_con') return palletsList;
        if (tipo === 'otro') return otrosList;
        return [];
    }

    function updatePalletWeight() {
        // Funcionalidad de suma automática deshabilitada
    }

    function addItemToList(selectedOption, tipoEmpaque) {   
        if (!selectedOption || !selectedOption.dataset.item || !itemTemplate) return;

        const itemData = JSON.parse(selectedOption.dataset.item);
        itemCounter++;

        const itemFragment = itemTemplate.content.cloneNode(true);
        const itemCard = itemFragment.querySelector('.item-card');
        const selectEl = itemCard.querySelector('.item-select select');
        const codeEl = itemCard.querySelector('.item-code');
        const widthEl = itemCard.querySelector('.item-detail-width');
        const lengthEl = itemCard.querySelector('.item-detail-length');
        const heightEl = itemCard.querySelector('.item-detail-height');
        const unitsInput = itemCard.querySelector('[data-role="units-input"]');
        const weightInput = itemCard.querySelector('[data-role="weight-input"]');
        const deleteBtn = itemCard.querySelector('.delete-btn');
        const palletContents = itemCard.querySelector('.pallet-contents');
        const btnAddContent = itemCard.querySelector('.btn-add-content');
        const palletContentsList = itemCard.querySelector('.pallet-contents-list');

        // Check if it's a pallet
        const isPallet = tipoEmpaque === 'pallet_con';

        // Configure editable dimensions
        if (isPallet) {
            if (widthEl) { widthEl.removeAttribute('readonly'); widthEl.disabled = false; }
            if (lengthEl) { lengthEl.removeAttribute('readonly'); lengthEl.disabled = false; }
            if (heightEl) { heightEl.removeAttribute('readonly'); heightEl.disabled = false; }
            
            // Show nested content section
            if (palletContents) palletContents.classList.remove('hidden');
            
            // Handle adding nested boxes
            if (btnAddContent) {
                // Remove old listeners to avoid duplicates if any (though cloning usually handles this, but just in case)
                const newBtn = btnAddContent.cloneNode(true);
                btnAddContent.parentNode.replaceChild(newBtn, btnAddContent);
                newBtn.addEventListener('click', () => {
                    addNestedBox(palletContentsList);
                });
            }
        } else {
            if (widthEl) { widthEl.setAttribute('readonly', true); }
            if (lengthEl) { lengthEl.setAttribute('readonly', true); }
            if (heightEl) { heightEl.setAttribute('readonly', true); }
            if (palletContents) palletContents.classList.add('hidden');
        }

        // Populate the card's select with the full list of the current type
        if (selectEl) {
            const list = getListByType(tipoEmpaque);
            populateSelect(selectEl, list, null); 
            selectEl.value = itemData.Packing_PkgCode || '';
            
            selectEl.addEventListener('change', (e) => {
                const newOpt = e.target.options[e.target.selectedIndex];
                if (newOpt && newOpt.dataset.item) {
                    const newItemData = JSON.parse(newOpt.dataset.item);
                    updateCardDetails(newItemData, codeEl, widthEl, lengthEl, heightEl, weightInput);
                    // If type changes, we might need to re-evaluate if it's a pallet (though usually select only has one type)
                }
            });
        }

        updateCardDetails(itemData, codeEl, widthEl, lengthEl, heightEl, weightInput);

        if (unitsInput) {
            unitsInput.value = 1;
            // Escuchar cambios en cantidad
            unitsInput.addEventListener('input', updatePalletWeight);
        }
        
        if (weightInput) {
            // Escuchar cambios en peso
            weightInput.addEventListener('input', updatePalletWeight);
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                itemCard.remove();
                updatePalletWeight(); // Recalcular al borrar
            });
        }

        itemsContainer.appendChild(itemFragment);

        // Calcular inmediatamente por si ya hay cajas
        updatePalletWeight();

        const currentSelect = getCurrentSelect(tipoEmpaque);
        if (currentSelect) currentSelect.value = '';
    }

    function updateCardDetails(data, codeEl, widthEl, lengthEl, heightEl, weightInput) {
        if (codeEl) codeEl.textContent = data.Packing_PkgCode || 'N/A';
        // Use value for inputs instead of textContent
        if (widthEl) widthEl.value = parseFloat(data.Packing_PkgWidth || 0).toFixed(1);
        if (lengthEl) lengthEl.value = parseFloat(data.Packing_PkgLength || 0).toFixed(1);
        if (heightEl) heightEl.value = parseFloat(data.Packing_PkgHeight || 0).toFixed(1);
        if (weightInput) weightInput.value = parseFloat(data.Packing_PkgWeight || 0).toFixed(1);
    }

    function getCurrentSelect(tipo) {
        switch(tipo) {
            case 'cajas': return packingListSelectCajas;
            case 'pallet_con': return packingListSelectPallet;
            case 'otro': return packingListSelectOtro;
            default: return null;
        }
    }

    function updateVisibleSelect(tipo) {
        // Hide all first
        [packingListSelectCajas, packingListSelectPallet, packingListSelectOtro].forEach(s => {
            if(s) s.style.display = 'none';
        });

        // Show the correct one
        let current;
        if (tipo === 'cajas') current = packingListSelectCajas;
        else if (tipo === 'pallet_con') current = packingListSelectPallet;
        else if (tipo === 'otro') current = packingListSelectOtro;

        if (current) {
            current.style.display = 'block';
            // Ensure it fills the container
            current.style.width = '100%';
            current.style.height = '100%';
        }
    }

    // Radio button change handler
    tipoCajaRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const val = radio.value;
            updateVisibleSelect(val);
        });
    });

    // Initialize with default selection
    const initialRadio = document.querySelector('input[name="tipoCaja"]:checked');
    if(initialRadio) {
        updateVisibleSelect(initialRadio.value);
    } else {
        // Default to cajas if nothing selected
        const defaultRadio = document.getElementById('tipoCajaSinPallet');
        if(defaultRadio) {
            defaultRadio.checked = true;
            updateVisibleSelect('cajas');
        }
    }

    // Load data
    try {
        const response = await fetch('./api/packingList', {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            console.error(`Error HTTP ${response.status}: ${response.statusText}`);
            return;
        }

        const payload = await response.json();

        if (payload.status !== 'success' || !Array.isArray(payload.value)) {
            console.error('Respuesta inválida del servidor:', payload);
            return;
        }

        originalItems = payload.value;
        classifyAndPopulate(originalItems);
        
        // Add change listeners to selects to auto-add items
        [packingListSelectCajas, packingListSelectPallet, packingListSelectOtro].forEach((select, index) => {
            if (!select) return;
            const tipos = ['cajas', 'pallet_con', 'otro'];
            select.addEventListener('change', (e) => {
                if (e.target.value) {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    addItemToList(selectedOption, tipos[index]);
                    
                    // Auto-check corresponding radio
                    const radio = document.querySelector(`input[value="${tipos[index]}"]`);
                    if (radio) radio.checked = true;
                }
            });
        });

    } catch (err) {
        console.error('Error al obtener la lista de empaque:', err);
    }

    // Validation and Save Logic
    const btnGuardar = document.getElementById('btnGuardar');
    
    if (btnGuardar) {
        btnGuardar.addEventListener('click', async() => {
            const itemCards = document.querySelectorAll('.item-card');
            
            if (itemCards.length === 0) {
                alert('La lista está vacía. Por favor agrega al menos una caja o pallet.');
                return;
            }

            let hayErrores = false;
            const datosValidos = [];

            // Iterate over each card
            itemCards.forEach((card) => {
                const select = card.querySelector('.item-select select');
                const inputs = card.querySelectorAll('.input-box input'); 
                const inputQty = card.querySelector('[data-role="units-input"]');
                const inputPeso = card.querySelector('[data-role="weight-input"]');
                const inputPesoBruto = card.querySelector('[data-role="weight-input-bruto"]');

                // Reset styles
                if(select) select.style.borderColor = '';
                if(inputQty) inputQty.parentElement.style.border = 'none'; // Reset border on .input-box
                if(inputPeso) inputPeso.parentElement.style.border = 'none';

                let itemValido = true;

                // 1. Validate selection
                if (!select || !select.value) {
                    if(select) select.style.borderColor = 'red';
                    itemValido = false;
                }

                // 2. Validate Quantity (> 0)
                const qtyValue = inputQty ? parseFloat(inputQty.value) : 0;
                if (!qtyValue || qtyValue <= 0) {
                    if(inputQty) inputQty.parentElement.style.border = '2px solid red';
                    itemValido = false;
                }

                // 3. Validate Weight (> 0)
                const pesoValue = inputPeso ? parseFloat(inputPeso.value) : 0;
                const pesoValueBruto = inputPesoBruto ? parseFloat(inputPesoBruto.value) : 0;
                if (!pesoValue || pesoValue <= 0) {
                    if(inputPeso) inputPeso.parentElement.style.border = '2px solid red';
                    itemValido = false;
                }

                if (!itemValido) {
                    hayErrores = true;
                } else {
                    // Prepare data object
                    const itemData = JSON.parse(select.options[select.selectedIndex].dataset.item);
                    
                    // Capture nested items if any
                    const nestedItems = [];
                    const palletContentsList = card.querySelector('.pallet-contents-list');
                    if (palletContentsList) {
                        const rows = palletContentsList.querySelectorAll('.nested-item-row');
                        rows.forEach(row => {
                            const nSelect = row.querySelector('select');
                            const nQty = row.querySelector('input');
                            if (nSelect && nSelect.value && nQty && nQty.value > 0) {
                                const nItemData = JSON.parse(nSelect.options[nSelect.selectedIndex].dataset.item);
                                nestedItems.push({
                                    codigo: nItemData.Packing_PkgCode,
                                    tipo: nItemData.Packing_Description,
                                    unidades: parseFloat(nQty.value)
                                });
                            }
                        });
                    }

                    // Capture editable dimensions
                    const widthVal = card.querySelector('.item-detail-width').value;
                    const lengthVal = card.querySelector('.item-detail-length').value;
                    const heightVal = card.querySelector('.item-detail-height').value;

                    // Objeto estructurado según requerimiento
                    const objetoItem = {
                        orderNumber: ordenParam || '',
                        empId: empIdParam || '',
                        tipo: itemData.Packing_Description, // Ej: "Caja C03"
                        codigo: itemData.Packing_PkgCode,   // Ej: "C03"
                        unidades: qtyValue,                 // Und
                        peso: pesoValue,                    // Peso
                        es_pallet: itemData.Packing_Description.toLowerCase().includes('pallet'), // Identificador extra
                        // New fields
                        ancho: parseFloat(widthVal) || 0,
                        largo: parseFloat(lengthVal) || 0,
                        alto: parseFloat(heightVal) || 0,
                        pesoBruto: pesoValueBruto || 0,
                        contenido: nestedItems // Array of nested boxes
                    };

                    datosValidos.push(objetoItem);
                }
            });

            if (hayErrores) {
                alert('Por favor corrige los campos marcados en rojo (Cantidades y Pesos son obligatorios).');
            } else {
                console.clear();
                console.log('%c DATOS LISTOS PARA GUARDAR:', 'color: #22c55e; font-size: 16px; font-weight: bold;');
                
                console.table(datosValidos); // Muestra una tabla bonita en consola
                console.log('Array de objetos:', datosValidos);
                await fetch('./api/cajasPorEmp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosValidos)
                });
                alert('Datos validados correctamente. Revisa la consola (F12) para ver el objeto generado.');
                // Aquí iría la llamada a tu API
            }
        });
    }

    function addNestedBox(container) {
        const row = document.createElement('div');
        row.className = 'nested-item-row';
        
        // Select for box type
        const select = document.createElement('select');
        select.className = 'nested-item-select';
        populateSelect(select, cajasList, 'Seleccione Caja...'); // Only boxes allowed inside pallet
        
        // Qty input
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = '1';
        qtyInput.value = '1';
        qtyInput.className = 'nested-item-qty';
        qtyInput.placeholder = 'Cant';

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'nested-delete-btn';
        delBtn.textContent = 'X';
        delBtn.onclick = () => row.remove();

        row.appendChild(select);
        row.appendChild(qtyInput);
        row.appendChild(delBtn);
        
        container.appendChild(row);
    }
});

