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
                if (window.clearAll) {
                    window.clearAll(() => {
                        data.value.forEach((newItem) => {
                            console.log('Nuevo elemento:', newItem);
                            if (window.save) save({ id: newItem.Packing_PkgCode, ...newItem });
                        });
                        setSelectCajas(data.value);
                    });
                } else {
                    data.value.forEach((newItem) => {
                        console.log('Nuevo elemento:', newItem);
                        if (window.save) save({ id: newItem.Packing_PkgCode, ...newItem });
                    });
                    setSelectCajas(data.value);
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
    // Llenar el select principal de cajas
    let packagingTypeList = document.getElementById("packagingTypeList1");
    console.log('[setSelectCajas] packagingTypeList element:', packagingTypeList);
    if (packagingTypeList) {
        packagingTypeList.innerHTML = '';
        let defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione tipo embalaje...';
        packagingTypeList.appendChild(defaultOption);
    }

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

    let CAJAS = arrydata.filter(item => item.Packing_Description && item.Packing_Description.includes('CAJA'));
    console.log('[setSelectCajas] CAJAS filtered:', CAJAS.length, 'items');
    CAJAS.forEach((item, index) => {
        console.log('[setSelectCajas] Adding option', index + 1, ':', item.Packing_Description);
        let option = document.createElement('option');
        option.value = item.Packing_PkgCode;
        option.textContent = item.Packing_Description;
        
        // Llenar select de cajas
        if (packagingTypeList) {
            packagingTypeList.appendChild(option.cloneNode(true));
            console.log('[setSelectCajas] Added to cajas select');
        }
        
        // Llenar todos los selects de pallet
        palletSelects.forEach((select, selectIndex) => {
            if (select) {
                select.appendChild(option.cloneNode(true));
                console.log('[setSelectCajas] Added to pallet select', selectIndex + 1);
            }
        });
    });
}
