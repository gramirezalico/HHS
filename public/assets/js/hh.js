let userName = localStorage.getItem('userName');
if (userName !== null) {
    document.getElementById('userName').textContent = userName;
}
   
    // Llama a esta función para llenar los selects al cargar la página

document.addEventListener('DOMContentLoaded', () => {
    // --- Funcionalidad de pestañas Cajas/Pallet en el modal ---
    const tabCajas = document.getElementById('tabCajas');
    const tabPallet = document.getElementById('tabPallet');
    const tabCajasContent = document.getElementById('tabCajasContent');
    const tabPalletContent = document.getElementById('tabPalletContent');

    if (tabCajas && tabPallet && tabCajasContent && tabPalletContent) {
        tabCajas.addEventListener('click', function() {
            tabCajas.classList.add('active');
            tabCajas.style.color = '#2563eb';
            tabCajas.style.borderBottom = '2.5px solid #2563eb';
            tabPallet.classList.remove('active');
            tabPallet.style.color = '#444';
            tabPallet.style.borderBottom = '2.5px solid transparent';
            tabCajasContent.style.display = '';
            tabPalletContent.style.display = 'none';
        });
        tabPallet.addEventListener('click', function() {
            tabPallet.classList.add('active');
            tabPallet.style.color = '#2563eb';
            tabPallet.style.borderBottom = '2.5px solid #2563eb';
            tabCajas.classList.remove('active');
            tabCajas.style.color = '#444';
            tabCajas.style.borderBottom = '2.5px solid transparent';
            tabCajasContent.style.display = 'none';
            tabPalletContent.style.display = '';
            // Llenar los selects de Pallet cada vez que se hace clic en la pestaña
            if (typeof getAllData === 'function' && typeof setSelectCajas === 'function') {
                getAllData(function(data) {
                    console.log('[hh.js] setSelectCajas called on modal open with', data);
                    setSelectCajas(data);
                });
            }
        });
    }
    const logoutButton = document.querySelector('.btn-logout');
    const addPackagingModal = document.getElementById('addPackagingModal');
    const addButton = document.querySelector('.btn-add');
    if (addButton && addPackagingModal) {
        addButton.addEventListener('click', () => {
            addPackagingModal.style.display = 'flex';
            // Llenar selects de cajas y pallet cada vez que se abre el modal
            getAllData(function(data) {
                if (typeof setSelectCajas === 'function') {
                    console.log('[hh.js] setSelectCajas executed on modal open');
                    console.log('[hh.js] setSelectCajas called on tab switch with', data);
                    console.log('[hh.js] setSelectCajas executed on tab switch');
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
