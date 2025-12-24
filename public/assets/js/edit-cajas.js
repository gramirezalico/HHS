const urlParams = new URLSearchParams(window.location.search);
const ordenParam = urlParams.get('orden');
const empIdParam = urlParams.get('EmpId');
document.addEventListener('DOMContentLoaded', async () => {

    const packingListSelectCajas = document.getElementById('packingListSelectCajas');
    const packingListSelectPallet = document.getElementById('packingListSelectPallet');
    const packingListSelectOtro = document.getElementById('packingListSelectOtro');
    const tipoCajaRadios = document.querySelectorAll('input[name="tipoCaja"]');
    const itemsContainer = document.getElementById('items-container');
    let itemTemplate = document.getElementById('item-card-template');
    const itemTemplatePallet = document.getElementById('item-card-template-pallet');
    let originalItems = [];
    let itemCounter = 0;
    // Store categorized lists globally
    let cajasList = [];
    let palletsList = [];
    let otrosList = [];

    function populateSelect(selectEl, items, placeholderText) {
        if (!selectEl) return;
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
        for (const item of items) {
            if (!item) continue;
            const option = document.createElement('option');
            option.value = (item.Packing_PkgCode || '');
            // Format: Description ---- Code
            option.textContent = `${item.Packing_Description || ''} ---- ${item.Packing_PkgCode || ''}`.trim();
            option.dataset.item = JSON.stringify(item);
            frag.appendChild(option);
        }

        selectEl.appendChild(frag);
    }

    function classifyAndPopulate(items) {
        cajasList = [];
        palletsList = [];
        otrosList = [];
        for (const it of items) {
            const desc = (it.Packing_Description || '').toLowerCase();
            if (desc.includes('caja')) cajasList.push(it);
            else if (desc.includes('pallet')) palletsList.push(it);
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

    function addItemToList(selectedOption, tipoEmpaque, initialValues = null) {
        if (!selectedOption || !selectedOption.dataset.item || !itemTemplate) return;

        const itemData = JSON.parse(selectedOption.dataset.item);
        itemCounter++;
        // Check if it's a pallet
        const isPallet = tipoEmpaque === 'pallet_con';
         if (isPallet) {
            itemTemplate = itemTemplatePallet;
         }else{
            itemTemplate = document.getElementById('item-card-template');
         }
        const itemFragment = itemTemplate.content.cloneNode(true);
        const itemCard = itemFragment.querySelector('.item-card');
        const selectEl = itemCard.querySelector('.item-select select');
        const toChangeClass = itemCard.querySelector('item-inputs-2');
        
        // const codeEl = itemCard.querySelector('.item-code');
        const widthEl = itemCard.querySelector('.item-detail-width');
        const lengthEl = itemCard.querySelector('.item-detail-length');
        const heightEl = itemCard.querySelector('.item-detail-height');
        const unitsPerPackageInput = itemCard.querySelector('.item-detail-units-per-package-input');
        const unitsInput = itemCard.querySelector('[data-role="units-input"]');
        const weightInput = itemCard.querySelector('[data-role="weight-input"]');
        const weightBrutoInput = itemCard.querySelector('[data-role="weight-input-neto"]');
        const deleteBtn = itemCard.querySelector('.delete-btn');
        const palletContents = itemCard.querySelector('.pallet-contents');
        const btnAddContent = itemCard.querySelector('.btn-add-content');
        const palletContentsList = itemCard.querySelector('.pallet-contents-list');

        

        // Configure editable dimensions
        if (isPallet) {
            if (widthEl) {
                widthEl.removeAttribute('readonly');
                widthEl.disabled = false;
                // pathert 
                widthEl.parentElement.classList.remove('hidden');
               // toChangeClass.classList.add('item-inputs')
               // toChangeClass.classList.remove('item-inputs-2')
            }
            if (lengthEl) {
                lengthEl.removeAttribute('readonly');
                lengthEl.disabled = false;

                lengthEl.parentElement.classList.remove('hidden');
            }
            if (heightEl) {
                heightEl.removeAttribute('readonly');
                heightEl.disabled = false;
                heightEl.parentElement.classList.remove('hidden');
            }
            if(unitsPerPackageInput){
                
                unitsPerPackageInput.parentElement.classList.add('hidden');
            }

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
                    updateCardDetails(newItemData, widthEl, lengthEl, heightEl, weightInput, weightBrutoInput);
                    // If type changes, we might need to re-evaluate if it's a pallet (though usually select only has one type)
                }
            });
        }

        updateCardDetails(itemData, widthEl, lengthEl, heightEl, weightInput, weightBrutoInput);

        if (unitsInput) {
            unitsInput.value = (initialValues && initialValues.unidades) ? initialValues.unidades : 1;
            // Escuchar cambios en cantidad
            unitsInput.addEventListener('input', updatePalletWeight);
        }

        if (unitsPerPackageInput) {
            unitsPerPackageInput.value = (initialValues && initialValues.unidadesPorPaquete) ? initialValues.unidadesPorPaquete : 1;
        }

        if (weightInput) {
            if (initialValues && initialValues.peso) {
                weightInput.value = initialValues.peso;
            }
            // Escuchar cambios en peso
            weightInput.addEventListener('input', updatePalletWeight);
        }

        if (weightBrutoInput) {
            if (initialValues && initialValues.pesoBruto) {
                weightBrutoInput.value = initialValues.pesoBruto;
            }
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                itemCard.remove();
                updatePalletWeight(); // Recalcular al borrar
            });
        }

        itemsContainer.prepend(itemFragment);

        // Calcular inmediatamente por si ya hay cajas
        updatePalletWeight();

        const currentSelect = getCurrentSelect(tipoEmpaque);
        if (currentSelect) currentSelect.value = '';
    }

    function updateCardDetails(data, widthEl, lengthEl, heightEl, weightInput, weightBrutoInput) {
        // if (codeEl) codeEl.textContent = data.Packing_PkgCode || 'N/A';
        // Use value for inputs instead of textContent
        if (widthEl) widthEl.value = parseFloat(data.Packing_PkgWidth || 0).toFixed(1);
        if (lengthEl) lengthEl.value = parseFloat(data.Packing_PkgLength || 0).toFixed(1);
        if (heightEl) heightEl.value = parseFloat(data.Packing_PkgHeight || 0).toFixed(1);
        if (weightInput) weightInput.value = parseFloat(data.Packing_PkgWeight || 0).toFixed(1);
        if (weightBrutoInput) weightBrutoInput.value = parseFloat(data.Packing_PkgWeight || 0).toFixed(1);
    }

    function getCurrentSelect(tipo) {
        switch (tipo) {
            case 'cajas': return packingListSelectCajas;
            case 'pallet_con': return packingListSelectPallet;
            case 'otro': return packingListSelectOtro;
            default: return null;
        }
    }

    function updateVisibleSelect(tipo) {
        // Hide all first
        [packingListSelectCajas, packingListSelectPallet, packingListSelectOtro].forEach(s => {
            if (s) s.style.display = 'none';
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
    if (initialRadio) {
        updateVisibleSelect(initialRadio.value);
    } else {
        // Default to cajas if nothing selected
        const defaultRadio = document.getElementById('tipoCajaSinPallet');
        if (defaultRadio) {
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

        // Cargar datos existentes si hay ordenParam
        if (ordenParam) {
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

                if (result && result.ordersArray && Array.isArray(result.ordersArray)) {
                    console.log("Cargando datos existentes...", result.ordersArray);

                    for (const savedItem of result.ordersArray) {
                        // Find master item
                        const masterItem = originalItems.find(i => i.Packing_PkgCode === savedItem.codigo);
                        if (!masterItem) {
                            console.warn("Item guardado no encontrado en master list:", savedItem.codigo);
                            continue;
                        }

                        // Determine type
                        let tipoEmpaque = 'otro';
                        const desc = (masterItem.Packing_Description || '').toLowerCase();
                        if (desc.includes('caja')) tipoEmpaque = 'cajas';
                        else if (desc.includes('pallet')) tipoEmpaque = 'pallet_con';

                        // Find the select element
                        const selectEl = getCurrentSelect(tipoEmpaque);
                        if (!selectEl) continue;

                        // Find the option
                        const option = Array.from(selectEl.options).find(opt => opt.value === savedItem.codigo);

                        if (option) {
                            addItemToList(option, tipoEmpaque, savedItem);

                            // If it's a pallet and has saved content/dimensions, populate them
                            // Note: savedItem needs to have 'contenido' and dimensions properties
                            // Since we are just implementing this, existing data might not have it.
                            // But if we reload what we just saved, it should be there.

                            // We need to access the last added card (which is prepended)
                            const lastCard = itemsContainer.firstElementChild;
                            if (lastCard) {
                                // Cargar pesoBruto para todos los tipos
                                if (savedItem.pesoBruto) {
                                    const pesoBrutoInput = lastCard.querySelector('[data-role="weight-input-neto"]');
                                    if (pesoBrutoInput) pesoBrutoInput.value = savedItem.pesoBruto;
                                }

                                // Cargar unidadesPorPaquete para todos los tipos
                                if (savedItem.unidadesPorPaquete) {
                                    const unitsPerPackageInput = lastCard.querySelector('[data-role="units-per-package-input"]');
                                    if (unitsPerPackageInput) unitsPerPackageInput.value = savedItem.unidadesPorPaquete;
                                }

                                if (tipoEmpaque === 'pallet_con') {
                                    if (savedItem.ancho) lastCard.querySelector('.item-detail-width').value = savedItem.ancho;
                                    if (savedItem.largo) lastCard.querySelector('.item-detail-length').value = savedItem.largo;
                                    if (savedItem.alto) lastCard.querySelector('.item-detail-height').value = savedItem.alto;

                                    if (savedItem.contenido && Array.isArray(savedItem.contenido)) {
                                        const container = lastCard.querySelector('.pallet-contents-list');
                                        savedItem.contenido.forEach(c => addNestedBox(container, c));
                                    }
                                }
                            }
                        }
                    }
                    // Recalculate totals after adding all items
                    updatePalletWeight();
                }

            } catch (error) {
                console.error("Error cargando datos existentes:", error);
            }
        }
    } catch (err) {
        console.error('Error al obtener la lista de empaque:', err);
    }

    // Validation and Save Logic
    const btnGuardar = document.getElementById('btnGuardar');

    if (btnGuardar) {
        btnGuardar.addEventListener('click', async () => {
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
                const inputPesoBruto = card.querySelector('[data-role="weight-input-neto"]');
                const inputUnitsPerPackage = card.querySelector('[data-role="units-per-package-input"]');

                // Reset styles
                if (select) select.style.borderColor = '';
                if (inputQty) inputQty.parentElement.style.border = 'none'; // Reset border on .input-box
                if (inputPeso) inputPeso.parentElement.style.border = 'none';

                let itemValido = true;

                // 1. Validate selection
                if (!select || !select.value) {
                    if (select) select.style.borderColor = 'red';
                    itemValido = false;
                }

                // 2. Validate Quantity (> 0)
                const qtyValue = inputQty ? parseFloat(inputQty.value) : 0;
                if (!qtyValue || qtyValue <= 0) {
                    if (inputQty) inputQty.parentElement.style.border = '2px solid red';
                    itemValido = false;
                }

                // 3. Validate Weight (> 0)
                const pesoValue = inputPeso ? parseFloat(inputPeso.value) : 0;
                const pesoValueBruto = inputPesoBruto ? parseFloat(inputPesoBruto.value) : 0;
                if (!pesoValue || pesoValue <= 0) {
                    if (inputPeso) inputPeso.parentElement.style.border = '2px solid red';
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
                            const nQty = row.querySelector('.nested-item-qty');
                            const nUC = row.querySelector('.nested-item-uc');
                            if (nSelect && nSelect.value && nQty && nQty.value > 0) {
                                const nItemData = JSON.parse(nSelect.options[nSelect.selectedIndex].dataset.item);
                                nestedItems.push({
                                    codigo: nItemData.Packing_PkgCode,
                                    tipo: nItemData.Packing_Description,
                                    unidades: parseFloat(nQty.value),
                                    unidadesPorPaquete: nUC ? parseFloat(nUC.value) : 1
                                });
                            }
                        });
                    }

                    // Capture editable dimensions
                    const widthVal = card.querySelector('.item-detail-width').value;
                    const lengthVal = card.querySelector('.item-detail-length').value;
                    const heightVal = card.querySelector('.item-detail-height').value;
                    
                    // Capture units per package value
                    const unitsPerPackageValue = inputUnitsPerPackage ? parseFloat(inputUnitsPerPackage.value) : 1;

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
                        unidadesPorPaquete: unitsPerPackageValue || 1,
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

                //alert('Datos validados correctamente. Revisa la consola (F12) para ver el objeto generado.');
                // Aquí iría la llamada a tu API
                const newUrl = new URL("ViewCajas", window.location.href);
                newUrl.search = window.location.search;
                window.location.href = newUrl.toString();
            }
        });
    }

    function addNestedBox(container, initialData = null) {
        const row = document.createElement('div');
        row.className = 'nested-item-row';

        // Select for box type
        const select = document.createElement('select');
        select.className = 'nested-item-select';
        populateSelect(select, cajasList, 'Seleccione Caja...'); // Only boxes allowed inside pallet

        if (initialData && initialData.codigo) {
            select.value = initialData.codigo;
        }

        // Qty input
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = '1';
        qtyInput.value = (initialData && initialData.unidades) ? initialData.unidades : '1';
        qtyInput.className = 'nested-item-qty';
        qtyInput.placeholder = 'Cant';
        // U/C
        const ucInput = document.createElement('input');
        ucInput.type = 'number';
        ucInput.min = '1';
        ucInput.value = (initialData && initialData.unidadesPorPaquete) ? initialData.unidadesPorPaquete : '1';
        ucInput.className = 'nested-item-uc';
        ucInput.placeholder = 'U/C';
        // Delete button
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'nested-delete-btn';
        delBtn.textContent = 'X';
        delBtn.onclick = () => row.remove();

        row.appendChild(select);
        row.appendChild(qtyInput);
        row.appendChild(ucInput);
        row.appendChild(delBtn);

        container.appendChild(row);
    }
});
