document.addEventListener('DOMContentLoaded', async () => {
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
        const itemCards = document.querySelectorAll('.item-card');
        let totalBoxWeight = 0;
        const palletInputs = [];

        // 1. Calcular peso total de las cajas
        itemCards.forEach(card => {
            const select = card.querySelector('.item-select select');
            if (!select || !select.value) return;

            const itemData = JSON.parse(select.options[select.selectedIndex].dataset.item);
            const isPallet = itemData.Packing_Description.toLowerCase().includes('pallet');
            
            const inputs = card.querySelectorAll('.input-box input');
            const qty = parseFloat(inputs[0].value) || 0;
            const weight = parseFloat(inputs[1].value) || 0;

            if (isPallet) {
                // Guardamos referencia al input de peso del pallet para actualizarlo luego
                palletInputs.push(inputs[1]);
            } else {
                // Es una caja: Sumamos (Cantidad * Peso Unitario)
                totalBoxWeight += (qty * weight);
            }
        });

        // 2. Actualizar todos los pallets con el peso total calculado
        palletInputs.forEach(input => {
            input.value = totalBoxWeight.toFixed(2); // 2 decimales
            
            // Opcional: Efecto visual para mostrar que se actualizó
            input.style.backgroundColor = '#dcfce7'; // Verde muy suave
            setTimeout(() => {
                input.style.backgroundColor = '#e5e7eb'; // Volver al gris original
            }, 500);
        });
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
                    updatePalletWeight(); // Recalcular si cambia el tipo de caja
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
        if (widthEl) widthEl.textContent = `ANCHO ${data.Packing_PkgWidth || 'N/A'} CM`;
        if (lengthEl) lengthEl.textContent = `LARGO ${data.Packing_PkgLength || 'N/A'} CM`;
        if (heightEl) heightEl.textContent = `PROFUNDO ${data.Packing_PkgHeight || 'N/A'} CM`;
        if (weightInput) weightInput.value = data.Packing_PkgWeight || 0;
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
        btnGuardar.addEventListener('click', () => {
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
                if (!pesoValue || pesoValue <= 0) {
                    if(inputPeso) inputPeso.parentElement.style.border = '2px solid red';
                    itemValido = false;
                }

                if (!itemValido) {
                    hayErrores = true;
                } else {
                    // Prepare data object
                    const itemData = JSON.parse(select.options[select.selectedIndex].dataset.item);
                    
                    // Objeto estructurado según requerimiento
                    const objetoItem = {
                        tipo: itemData.Packing_Description, // Ej: "Caja C03"
                        codigo: itemData.Packing_PkgCode,   // Ej: "C03"
                        unidades: qtyValue,                 // Und
                        peso: pesoValue,                    // Peso
                        es_pallet: itemData.Packing_Description.toLowerCase().includes('pallet') // Identificador extra
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
                
                alert('Datos validados correctamente. Revisa la consola (F12) para ver el objeto generado.');
                // Aquí iría la llamada a tu API
            }
        });
    }
});

