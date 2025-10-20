let userName = localStorage.getItem('userName');
if (userName !== null) {
    let userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
}
   
    // Llama a esta función para llenar los selects al cargar la página

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.btn-logout');
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

    // Cargar datos para los selects si estamos en cajas.html o pallet.html
    console.log('[hh.js] Current pathname:', window.location.pathname);
    if (window.location.pathname.includes('cajas.html') || window.location.pathname.includes('pallet.html')) {
        console.log('[hh.js] Detected cajas or pallet page, loading data...');
        
        // Esperar un poco para que la DB esté lista
        // Para pallet.html, usar un enfoque más directo
        if (window.location.pathname.includes('pallet.html')) {
            loadDataForPallet();
        } else {
            // Para cajas.html
            setTimeout(() => {
                if (typeof size === 'function') {
                    size(count => {
                        console.log('[hh.js] DB record count:', count);
                        if (count > 0) {
                            if (typeof getAllData === 'function') {
                                getAllData(function(data) {
                                    console.log('[hh.js] Cargando datos desde IndexedDB:', data.length, 'items');
                                    if (typeof setSelectCajas === 'function') {
                                        setSelectCajas(data);
                                    }
                                    setupCajasSelect();
                                });
                            }
                        } else {
                            console.log('[hh.js] No data in IndexedDB, loading from API');
                            if (typeof T === 'function') {
                                T();
                            }
                            setTimeout(setupCajasSelect, 1000);
                        }
                    });
                }
            }, 500);
        }
    }

    function loadDataForPallet() {
        console.log('[hh.js] Loading data specifically for pallet page');
        
        // Intentar múltiples veces con diferentes delays
        let attempts = 0;
        const maxAttempts = 10;
        
        function tryLoad() {
            attempts++;
            console.log('[hh.js] Attempt', attempts, 'to load pallet data');
            
            if (typeof size === 'function') {
                size(count => {
                    console.log('[hh.js] DB record count:', count);
                    if (count > 0) {
                        if (typeof getAllData === 'function') {
                            getAllData(function(data) {
                                console.log('[hh.js] Got data for pallet, populating selects...');
                                populatePalletSelects(data);
                            });
                        }
                    } else if (attempts <= 3) {
                        // Cargar desde API
                        console.log('[hh.js] Loading from API for pallet');
                        if (typeof T === 'function') {
                            T();
                            setTimeout(() => {
                                getAllData(function(data) {
                                    console.log('[hh.js] Got API data for pallet');
                                    populatePalletSelects(data);
                                });
                            }, 2000);
                        }
                    }
                });
            } else if (attempts < maxAttempts) {
                console.log('[hh.js] Functions not ready, retrying in 200ms');
                setTimeout(tryLoad, 200);
            }
        }
        
        setTimeout(tryLoad, 100);
    }
    
    function populatePalletSelects(data) {
        console.log('[hh.js] Populating pallet selects with', data.length, 'items');
        
        let palletSelects = [
            document.getElementById("palletTypeList1"),
            document.getElementById("palletTypeList2"),
            document.getElementById("palletTypeList3"),
            document.getElementById("palletTypeList4")
        ];
        
        let CAJAS = data.filter(item => item.Packing_Description && item.Packing_Description.includes('CAJA'));
        console.log('[hh.js] Filtered CAJAS:', CAJAS.length);
        
        palletSelects.forEach((select, index) => {
            if (select) {
                console.log('[hh.js] Filling select', index + 1);
                select.innerHTML = '<option value="">Seleccione tipo embalaje...</option>';
                
                CAJAS.forEach(item => {
                    let option = document.createElement('option');
                    option.value = item.Packing_PkgCode;
                    option.textContent = item.Packing_Description;
                    select.appendChild(option);
                });
                
                console.log('[hh.js] Select', index + 1, 'now has', select.options.length, 'options');
            }
        });
    }

    function setupCajasSelect() {
        // Agregar event listener para el select de cajas si existe
        let cajaSelect = document.getElementById('packagingTypeList1');
        if (cajaSelect) {
            cajaSelect.onchange = function(event) {
                let selectedValue = event.target.value;
                if (typeof getById === 'function') {
                    getById(selectedValue, data => {
                        let length = document.getElementById('length');
                        let width = document.getElementById('width');
                        let height = document.getElementById('height');
                        if (length) length.value = data['Packing_PkgLength'];
                        if (width) width.value = data['Packing_PkgWidth'];
                        if (height) height.value = data['Packing_PkgHeight'];
                    });
                }
            };
        }
    }
});
