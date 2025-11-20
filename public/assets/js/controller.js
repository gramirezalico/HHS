function T() {

    const base = (window.APP_BASE||'').replace(/\/?$/, '/');
    fetch(base + 'api/packingList', {
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
            console.log('Datos recibidos del servidor:', data); // Log detallado
            if (data.status == 'success') {
                let idSelect = "packagingTypeList1";
                let packagingTypeList = document.getElementById(idSelect);

                //packagingTypeList.innerHTML = '<option value="" disabled selected>Seleccione un tipo de embalaje</option>';
                data.value.forEach((newItem) => {
                    console.log('Nuevo elemento:', newItem);
                    // Save each item to IndexedDB
                    if (window.save) save({ id: newItem.Packing_PkgCode, ...newItem });
                })
                setSelectCajas(data.value);

            }
        })
        .catch(error => {
            console.error('Error al obtener la lista de paquetes:', error);
            const packagesList = document.getElementById('packagesList');
            packagesList.innerHTML = '<p>Error al cargar la lista de paquetes.</p>';
        });
}


function setSelectCajas(arrydata){
let packagingTypeList = document.getElementById("packagingTypeList1");

    let CAJAS = arrydata.filter(item => item.Packing_Description.includes('CAJA'));
    
    CAJAS.forEach(item => {
        let option = document.createElement('option');
        option.value = item.Packing_PkgCode;
        option.textContent = item.Packing_Description;
        packagingTypeList.appendChild(option);
    });
}
