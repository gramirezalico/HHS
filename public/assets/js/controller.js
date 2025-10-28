function T() {

    console.log('[T] llamada a T()');

    fetch('/api/packingList', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('[T] data recibido del API:', data);
            console.log('Datos recibidos del servidor:', data); // Log detallado
            if (data.status == 'success') {
                let idSelect = "packagingTypeList1";
                let packagingTypeList = document.getElementById(idSelect);

                // Limpiar la base de datos antes de guardar nuevos datos
                    // Try to clear both stores if available, then save CAJAS and PALLETS separately
                    const doSave = () => {
                        data.value.forEach((newItem) => {
                            console.log('Nuevo elemento:', newItem);
                            const desc = (newItem.Packing_Description || '').toString().toUpperCase();
                            // CAJAS
                            if (desc.includes('CAJA')) {
                                if (window.save) window.save({ id: newItem.Packing_PkgCode, ...newItem });
                            }
                            // PALLETS (accept PALLET or PAL)
                            else if (desc.includes('PALLET') || desc.includes('PAL')) {
                                if (window.savePallet) window.savePallet({ id: newItem.Packing_PkgCode, ...newItem });
                            } else {
                                // Fallback: save into cajas store so it's available for selects if needed
                                if (window.save) window.save({ id: newItem.Packing_PkgCode, ...newItem });
                            }
                        });
                        // Let the UI populate selects from full data set
                        setSelectCajas(data.value);
                    };

                    if (window.clearAll && window.clearAllPallets) {
                        // Clear Cajas then Pallets then save
                        window.clearAll(() => {
                            window.clearAllPallets(() => doSave());
                        });
                    } else if (window.clearAll) {
                        window.clearAll(() => doSave());
                    } else {
                        doSave();
                    }
            }
        })
        .catch(error => {
            console.error('Error al obtener la lista de paquetes:', error);
            const packagesList = document.getElementById('packagesList');
            packagesList.innerHTML = '<p>Error al cargar la lista de paquetes.</p>';
        });
}


window.setSelectCajas = function setSelectCajas(arrydata) {
    console.log('[setSelectCajas] called with', arrydata);
window.getAllData = getAllData;
    // Llenar todos los selects de packaging que comienzan con 'packagingTypeList' (p.ej. packagingTypeList, packagingTypeList1)
    let packagingSelects = Array.from(document.querySelectorAll('select[id^="packagingTypeList"]'));
    console.log('[setSelectCajas] packaging selects found:', packagingSelects.map(s => s ? s.id : 'null'));
    packagingSelects.forEach(select => {
        if (select) {
            select.innerHTML = '';
            let defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccione tipo embalaje...';
            select.appendChild(defaultOption);
        }
    });

    // Llenar todos los selects de pallet
    let palletSelects = [
        document.getElementById("palletTypeList1"),
        document.getElementById("palletTypeList2"),
        document.getElementById("palletTypeList3"),
        document.getElementById("palletTypeList4")
    ];
    
    console.log('[setSelectCajas] pallet selects found:', palletSelects.map(s => s ? s.id : 'null'));
    
    palletSelects.forEach((select, index) => {
        if (select) {
            console.log('[setSelectCajas] Clearing select', index + 1);
            select.innerHTML = '';
            let defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccione tipo embalaje...';
            select.appendChild(defaultOption);
        } else {
            console.log('[setSelectCajas] Select', index + 1, 'not found');
        }
    });

    // Build CAJAS list from incoming data
    let CAJAS = arrydata.filter(item => item.Packing_Description && item.Packing_Description.toString().toUpperCase().includes('CAJA'));
    console.log('[setSelectCajas] CAJAS filtered:', CAJAS.length, 'items');

    // Helper to actually populate selects given arrays of pallets and cajas
    const populate = (palletsFromDb) => {
        // Normalize pallets: include any pallets from incoming data too
        let PALLETS = (palletsFromDb || []).slice();

        // Also include pallet-like items that may be present in arrydata
        arrydata.forEach(item => {
            if (item.Packing_Description) {
                const d = item.Packing_Description.toString().toUpperCase();
                if (d.includes('PALLET') || d.includes('PAL')) {
                    // Avoid duplicates by code
                    if (!PALLETS.find(p => p.Packing_PkgCode === item.Packing_PkgCode)) {
                        PALLETS.push(item);
                    }
                }
            }
        });

        console.log('[setSelectCajas] PALLETS final count:', PALLETS.length);

        // First add pallets to packaging selects so they are visible near the top
        PALLETS.forEach((item, index) => {
            const code = item.Packing_PkgCode || item.id || ('PALLET_' + index);
            const label = item.Packing_Description || item.Packing_PkgCode || code;
            let option = document.createElement('option');
            option.value = code;
            option.textContent = label;
            option.dataset.type = 'PALLET';
            packagingSelects.forEach(sel => {
                if (sel && !sel.querySelector(`option[value="${option.value}"]`)) {
                    sel.appendChild(option.cloneNode(true));
                    console.log('[setSelectCajas] Added pallet to packaging select', sel.id, option.value);
                }
            });
            palletSelects.forEach((select, selectIndex) => {
                if (select && !select.querySelector(`option[value="${option.value}"]`)) {
                    select.appendChild(option.cloneNode(true));
                    console.log('[setSelectCajas] Added to pallet select', selectIndex + 1, option.value);
                }
            });
        });

        // Then add cajas
        CAJAS.forEach((item, index) => {
            console.log('[setSelectCajas] Adding CAJA option', index + 1, ':', item.Packing_Description);
            let option = document.createElement('option');
            option.value = item.Packing_PkgCode;
            option.textContent = item.Packing_Description;
            option.dataset.type = 'CAJA';
            packagingSelects.forEach(sel => {
                if (sel) {
                    if (!sel.querySelector(`option[value="${option.value}"]`)) {
                        sel.appendChild(option.cloneNode(true));
                        console.log('[setSelectCajas] Added caja to packaging select', sel.id);
                    }
                }
            });
        });

        // Finally ensure fixed pallets exist (in case DB empty)
        const fixedPallets = [
            { label: 'PALLET', code: 'PALLET', length: 0.0, width: 0.0, height: 0.0 },
            { label: 'PALLET GRANDE', code: 'PALLET-G', length: 1.2, width: 1.0, height: 1.6 },
            { label: 'PALLET MEDIANO', code: 'PALLET-M', length: 1.2, width: 1.0, height: 1.6 },
            { label: 'PALLET PEQUEÑO', code: 'PALLET-P', length: 1.2, width: 1.0, height: 1.6 }
        ];
        fixedPallets.forEach(({ label, code, length, width, height }) => {
            packagingSelects.forEach(sel => {
                if (!sel.querySelector(`option[value="${code}"]`)) {
                    const opt = document.createElement('option');
                    opt.value = code;
                    opt.textContent = label;
                    opt.dataset.type = 'PALLET';
                    sel.appendChild(opt.cloneNode(true));
                    console.log('[setSelectCajas] Added fixed pallet option to', sel.id, ':', label);
                }
            });
            palletSelects.forEach((sel) => {
                if (sel && !sel.querySelector(`option[value="${code}"]`)) {
                    const opt = document.createElement('option');
                    opt.value = code;
                    opt.textContent = label;
                    opt.dataset.type = 'PALLET';
                    sel.appendChild(opt.cloneNode(true));
                    console.log('[setSelectCajas] Added fixed pallet option to pallet select', sel.id, ':', label);
                }
            });
            // Persist fixed pallet to DB if possible
            if (window.savePallet) {
                try {
                    const palletRecord = {
                        id: code,
                        Packing_PkgCode: code,
                        Packing_Description: label,
                        Packing_PkgLength: length,
                        Packing_PkgWidth: width,
                        Packing_PkgHeight: height
                    };
                    if (typeof getByIdPallet === 'function') {
                        getByIdPallet(code, existing => {
                            if (!existing) {
                                window.savePallet(palletRecord);
                                console.log('[setSelectCajas] Saved fixed pallet to IndexedDB:', code);
                            }
                        });
                    } else {
                        window.savePallet(palletRecord);
                    }
                } catch (e) { console.error('Error saving fixed pallet to IndexedDB:', e); }
            }
        });
    };

    // If we have a helper to get pallets from IndexedDB, use it so pallets appear even when arrydata contains only cajas
    if (typeof getAllPallets === 'function') {
        getAllPallets(function(pallets) {
            populate(pallets);
        });
    } else {
        populate([]);
    }

    // Ensure fixed pallet options appear in the packaging selects (and pallet selects)
    const fixedPallets = [
        { label: 'PALLET', code: 'PALLET', length: 0.0, width: 0.0, height: 0.0 },
        { label: 'PALLET GRANDE', code: 'PALLET-G', length: 1.2, width: 1.0, height: 1.6 },
        { label: 'PALLET MEDIANO', code: 'PALLET-M', length: 1.2, width: 1.0, height: 1.6 },
        { label: 'PALLET PEQUEÑO', code: 'PALLET-P', length: 1.2, width: 1.0, height: 1.6 }
    ];

    fixedPallets.forEach(({ label, code, length, width, height }) => {
        // Add option to packaging selects if not present
        packagingSelects.forEach(sel => {
            if (!sel.querySelector(`option[value="${code}"]`)) {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = label;
                opt.dataset.type = 'PALLET';
                sel.appendChild(opt.cloneNode(true));
                console.log('[setSelectCajas] Added fixed pallet option to', sel.id, ':', label);
            }
        });

        // Also add to pallet selects
        palletSelects.forEach((sel) => {
            if (sel && !sel.querySelector(`option[value="${code}"]`)) {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = label;
                opt.dataset.type = 'PALLET';
                sel.appendChild(opt.cloneNode(true));
                console.log('[setSelectCajas] Added fixed pallet option to pallet select', sel.id, ':', label);
            }
        });

        // Persist to IndexedDB Pallets store so getByIdPallet can return dimensions
        if (window.savePallet) {
            try {
                // Create object matching the API shape used elsewhere
                const palletRecord = {
                    id: code,
                    Packing_PkgCode: code,
                    Packing_Description: label,
                    Packing_PkgLength: length,
                    Packing_PkgWidth: width,
                    Packing_PkgHeight: height
                };
                // Check if already exists by trying to get it (if getByIdPallet available)
                if (typeof getByIdPallet === 'function') {
                    getByIdPallet(code, existing => {
                        if (!existing) {
                            window.savePallet(palletRecord);
                            console.log('[setSelectCajas] Saved fixed pallet to IndexedDB:', code);
                        } else {
                            console.log('[setSelectCajas] Fixed pallet already in IndexedDB:', code);
                        }
                    });
                } else {
                    // No getter available yet; just save (may create duplicate if run multiple times)
                    window.savePallet(palletRecord);
                    console.log('[setSelectCajas] Saved fixed pallet to IndexedDB (no get):', code);
                }
            } catch (e) {
                console.error('Error saving fixed pallet to IndexedDB:', e);
            }
        }
    });
}
