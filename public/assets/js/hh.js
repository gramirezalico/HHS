let userName = localStorage.getItem('userName');
if (userName !== null) {
    document.getElementById('userName').textContent = userName;
}
   
    // Llama a esta función para llenar los selects al cargar la página

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.btn-logout');
    const addPackagingModal = document.getElementById('addPackagingModal');
    const addButton = document.querySelector('.btn-add');
    if (addButton && addPackagingModal) {
        addButton.addEventListener('click', () => {
            addPackagingModal.style.display = 'flex';
            // Llenar selects de cajas cada vez que se abre el modal
            getAllData(function(data) {
                if (typeof setSelectCajas === 'function') {
                    console.log('[hh.js] setSelectCajas executed on modal open');
                    setSelectCajas(data);
                }
            });

            // Evento para el select de cajas (solo uno)
            let cajaSelect = document.getElementById('packagingTypeList1');
            if (cajaSelect) {
                cajaSelect.onchange = function(event) {
                    let selectedValue = event.target.value;
                    getById(selectedValue, data => {
                        let length = document.getElementById('length');
                        let width = document.getElementById('width');
                        let height = document.getElementById('height');
                        length.value = data['Packing_PkgLength'];
                        width.value = data['Packing_PkgWidth'];
                        height.value = data['Packing_PkgHeight'];
                    });
                };
            }
        });
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            window.location.href = '/login'; // Redirigir a la página de inicio de sesión
        });
    }
    const boton = document.getElementById('miBoton');
    if (boton) {
        boton.addEventListener('click', () => {
            size(count => {
                console.log('Cantidad de registros:', count);
            });
        });
    }
});
