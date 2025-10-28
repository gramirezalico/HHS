// HH.js - Archivo principal de funcionalidad
(function() {
    'use strict';
    
    console.log('[hh.js] Script loaded');

    // Esperar a que el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[hh.js] DOM Content Loaded');
        
        // Configurar el nombre de usuario si existe el elemento
        try {
            let userName = localStorage.getItem('userName');
            if (userName !== null) {
                let userNameElement = document.getElementById('userName');
                if (userNameElement) {
                    userNameElement.textContent = userName;
                    console.log('[hh.js] Usuario configurado:', userName);
                }
            }
        } catch (error) {
            console.error('[hh.js] Error configurando usuario:', error);
        }
        
        // Configurar botón de logout
        try {
            const logoutButton = document.querySelector('.btn-logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', function() {
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userName');
                    window.location.href = '/login';
                });
                console.log('[hh.js] Botón logout configurado');
            }
        } catch (error) {
            console.error('[hh.js] Error configurando logout:', error);
        }

        // Configurar botón especial si existe
        try {
            const boton = document.getElementById('miBoton');
            if (boton) {
                boton.addEventListener('click', function() {
                    if (typeof size === 'function') {
                        size(count => {
                            console.log('Cantidad de registros:', count);
                        });
                    }
                });
                console.log('[hh.js] Botón especial configurado');
            }
        } catch (error) {
            console.error('[hh.js] Error configurando botón especial:', error);
        }

        // Cargar datos para los selects si estamos en cajas.html
        try {
            console.log('[hh.js] Current pathname:', window.location.pathname);
            if (window.location.pathname.includes('cajas.html')) {
                console.log('[hh.js] Detected cajas page, loading data...');
                loadDataForCajas();
            }
        } catch (error) {
            console.error('[hh.js] Error cargando datos para cajas:', error);
        }
    });

    function loadDataForCajas() {
        console.log('[hh.js] Loading data for cajas page');
        
        setTimeout(function() {
            try {
                if (typeof size === 'function') {
                    size(function(count) {
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
                } else {
                    console.log('[hh.js] size function not available yet, retrying...');
                    setTimeout(loadDataForCajas, 500);
                }
            } catch (error) {
                console.error('[hh.js] Error loading data:', error);
            }
        }, 500);
    }

    function setupCajasSelect() {
        try {
            let cajaSelect = document.getElementById('packagingTypeList1');
            if (cajaSelect) {
                cajaSelect.onchange = function(event) {
                    let selectedValue = event.target.value;
                    let selectedOption = event.target.options[event.target.selectedIndex];
                    let type = selectedOption ? selectedOption.dataset.type : null;

                    if (selectedValue && selectedValue !== '') {
                        if (type === 'CAJA') {
                            if (typeof getById === 'function') {
                                getById(selectedValue, function(data) {
                                    let length = document.getElementById('length');
                                    let width = document.getElementById('width');
                                    let height = document.getElementById('height');
                                    if (length && data) length.value = data['Packing_PkgLength'] || '';
                                    if (width && data) width.value = data['Packing_PkgWidth'] || '';
                                    if (height && data) height.value = data['Packing_PkgHeight'] || '';
                                });
                            }
                        } else if (type === 'PALLET') {
                            if (typeof getByIdPallet === 'function') {
                                getByIdPallet(selectedValue, function(data) {
                                    let length = document.getElementById('length');
                                    let width = document.getElementById('width');
                                    let height = document.getElementById('height');
                                    if (length && data) length.value = data['Packing_PkgLength'] || '';
                                    if (width && data) width.value = data['Packing_PkgWidth'] || '';
                                    if (height && data) height.value = data['Packing_PkgHeight'] || '';
                                });
                            }
                        } else {
                            // fallback: try caja then pallet
                            if (typeof getById === 'function') {
                                getById(selectedValue, function(data) {
                                    if (data) {
                                        let length = document.getElementById('length');
                                        let width = document.getElementById('width');
                                        let height = document.getElementById('height');
                                        if (length && data) length.value = data['Packing_PkgLength'] || '';
                                        if (width && data) width.value = data['Packing_PkgWidth'] || '';
                                        if (height && data) height.value = data['Packing_PkgHeight'] || '';
                                    } else if (typeof getByIdPallet === 'function') {
                                        getByIdPallet(selectedValue, function(dataP) {
                                            let length = document.getElementById('length');
                                            let width = document.getElementById('width');
                                            let height = document.getElementById('height');
                                            if (length && dataP) length.value = dataP['Packing_PkgLength'] || '';
                                            if (width && dataP) width.value = dataP['Packing_PkgWidth'] || '';
                                            if (height && dataP) height.value = dataP['Packing_PkgHeight'] || '';
                                        });
                                    }
                                });
                            } else if (typeof getByIdPallet === 'function') {
                                getByIdPallet(selectedValue, function(dataP) {
                                    let length = document.getElementById('length');
                                    let width = document.getElementById('width');
                                    let height = document.getElementById('height');
                                    if (length && dataP) length.value = dataP['Packing_PkgLength'] || '';
                                    if (width && dataP) width.value = dataP['Packing_PkgWidth'] || '';
                                    if (height && dataP) height.value = dataP['Packing_PkgHeight'] || '';
                                });
                            }
                        }
                    } else {
                        // clear
                        let length = document.getElementById('length');
                        let width = document.getElementById('width');
                        let height = document.getElementById('height');
                        if (length) length.value = '';
                        if (width) width.value = '';
                        if (height) height.value = '';
                    }
                };
                console.log('[hh.js] Cajas select event listener configured');
            }
        } catch (error) {
            console.error('[hh.js] Error setting up cajas select:', error);
        }
    }

})();