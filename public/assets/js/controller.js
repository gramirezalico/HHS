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
    if (packagingTypeList) {
        packagingTypeList.innerHTML = '';
        let defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione tipo embalaje...';
        packagingTypeList.appendChild(defaultOption);
    }

    // Llenar todos los selects de pallet usando la clase
    let palletSelects = document.querySelectorAll('.pallet-caja-select');
    console.log('[setSelectCajas] palletSelects found:', palletSelects.length);
    palletSelects.forEach(sel => {
    console.log('[setSelectCajas] Populating select:', sel);
        sel.innerHTML = '';
        let defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione tipo embalaje...';
        sel.appendChild(defaultOption);
    });

    let CAJAS = arrydata.filter(item => item.Packing_Description && item.Packing_Description.includes('CAJA'));
    console.log('[setSelectCajas] CAJAS:', CAJAS);
    CAJAS.forEach(item => {
    console.log('[setSelectCajas] Adding option:', item.Packing_Description);
        let option = document.createElement('option');
        option.value = item.Packing_PkgCode;
        option.textContent = item.Packing_Description;
        if (packagingTypeList) packagingTypeList.appendChild(option.cloneNode(true));
        palletSelects.forEach(sel => sel.appendChild(option.cloneNode(true)));
    });
}
