// Configuración de columnas del DataGrid
const columnConfig = [
    {
        id: 'checkbox',
        type: 'checkbox',
        width: 50,
        sortable: false,
        filterable: false,
        visible: true
    },
    {
        id: 'Cliente',
        label: 'Cliente',
        type: 'text',
        sortable: true,
        filterable: true,
        visible: true
    },
    {
        id: 'Parte',
        label: 'Parte',
        type: 'text',
        sortable: true,
        filterable: true,
        visible: true
    },
    {
        id: 'Cantidad',
        label: 'Cantidad',
        type: 'number',
        sortable: true,
        filterable: true,
        visible: true,
        format: (val) => parseFloat(val).toFixed(2)
    },
    {
        id: 'Bin',
        label: 'Bin',
        type: 'text',
        sortable: true,
        filterable: true,
        visible: true
    },
    {
        id: 'OV',
        label: 'OV',
        type: 'number',
        sortable: true,
        filterable: true,
        visible: true
    },
    {
        id: 'LotNum',
        label: 'Lote',
        type: 'text',
        sortable: true,
        filterable: true,
        visible: true
    },
    {
        id: 'ID',
        label: 'ID',
        type: 'text',
        sortable: true,
        filterable: true,
        visible: false // Oculto por defecto, pero disponible
    }
];

// Instancia del DataGrid
let dataGrid;

// Función para cargar los datos desde el backend
async function loadData() {
    try {
        // Mostrar loading state (opcional)
        const container = document.getElementById('dataGridContainer');
        container.innerHTML = '<div class="loading-state">Cargando datos...</div>';

        // Obtener EmpID de los parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const empId = urlParams.get('EmpID') || urlParams.get('empId') || urlParams.get('EmpId')|| '00010';
        
        const response = await fetch(`./api/TI_HH_Listado?EmpID=${empId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.status === 'success' && data.value) {
            // Inicializar DataGrid con los datos
            dataGrid = new DataGrid({
                container: '#dataGridContainer',
                columns: columnConfig,
                data: data.value,
                features: {
                    sorting: true,
                    filtering: true,
                    pagination: true,
                    columnManager: true,
                    selection: 'multiple'
                },
                pagination: {
                    pageSize: 25,
                    pageSizeOptions: [10, 25, 50, 100]
                },
                onSelectionChange: (selectedItems) => {
                    updateSelectionCount(selectedItems.length);
                    validateOVSelection(selectedItems);
                },
                onRowClick: (item) => {
                    console.log('Row clicked:', item);
                }
            });

            dataGrid.setData(data.value);
        } else {
            console.error('No data received from API');
            container.innerHTML = '<div class="error-state">No se pudieron cargar los datos</div>';
        }
    } catch (error) {
        console.error('Error loading data:', error);
        const container = document.getElementById('dataGridContainer');
        container.innerHTML = `<div class="error-state">Error al cargar los datos: ${error.message}</div>`;
    }
}

// Actualizar contador de selección
function updateSelectionCount(count) {
    const selectionCount = document.getElementById('selectionCount');
    if (selectionCount) {
        selectionCount.textContent = `${count} item${count !== 1 ? 's' : ''} seleccionado${count !== 1 ? 's' : ''}`;
    }
}

// Validar que todos los items seleccionados tengan el mismo OV
function validateOVSelection(selectedItems) {
    if (selectedItems.length === 0) return true;
    
    // Obtener el OV del primer item seleccionado
    const firstOV = selectedItems[0].OV;
    
    // Verificar que todos los items tengan el mismo OV
    const allSameOV = selectedItems.every(item => item.OV === firstOV);
    
    if (!allSameOV) {
        // Mostrar advertencia si hay items con diferentes OV
        showWarning('Todos los items seleccionados deben pertenecer a la misma Orden de Venta (OV)');
        return false;
    }
    
    // Verificar si hay un intento de selección rechazado
    // Esto se detecta cuando el callback se llama sin cambios en la selección
    const currentCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    if (currentCheckboxes.length !== selectedItems.length) {
        showWarning(`Solo puedes seleccionar items de la OV ${firstOV}`);
        return false;
    }
    
    return true;
}

// Mostrar advertencia temporal
function showWarning(message) {
    // Crear o actualizar elemento de advertencia
    let warningElement = document.getElementById('ovWarning');
    
    if (!warningElement) {
        warningElement = document.createElement('div');
        warningElement.id = 'ovWarning';
        warningElement.className = 'ov-warning';
        
        const gridContainer = document.getElementById('dataGridContainer');
        if (gridContainer) {
            gridContainer.insertAdjacentElement('beforebegin', warningElement);
        }
    }
    
    warningElement.textContent = `⚠️ ${message}`;
    warningElement.style.display = 'block';
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
        if (warningElement) {
            warningElement.style.display = 'none';
        }
    }, 4000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos al iniciar
    loadData();
    
    // Botón CAJAS
    const btnCajas = document.getElementById('btnCajas');
    if (btnCajas) {
        btnCajas.addEventListener('click', () => {
            if (!dataGrid) {
                alert('El grid no está inicializado');
                return;
            }

            const selectedItems = dataGrid.getSelectedItems();
            
            if (selectedItems.length === 0) {
                alert('Por favor selecciona al menos un item');
                return;
            }
            
            // Validar que todos tengan el mismo OV
            const firstOV = selectedItems[0].OV;
            const allSameOV = selectedItems.every(item => item.OV === firstOV);
            
            if (!allSameOV) {
                alert('Error: Todos los items seleccionados deben pertenecer a la misma Orden de Venta (OV)');
                return;
            }
            
            console.log('Items seleccionados para CAJAS:', selectedItems);
            
            // Mostrar información detallada de cada item
            selectedItems.forEach((item, index) => {
                console.log(`\n=== Item ${index + 1} ===`);
                console.log('ID:', item.ID);
                console.log('Cliente:', item.Cliente);
                console.log('Parte:', item.Parte);
                console.log('Cantidad:', item.Cantidad);
                console.log('Bin:', item.Bin);
                console.log('OV:', item.OV);
                console.log('Lote:', item.LotNum);
                console.log('Objeto completo:', item);
            });
            
            // TODO: Aquí puedes enviar los datos a la siguiente página o endpoint
            // Ejemplo 1: Redirigir con datos en URL
            // const dataParam = encodeURIComponent(JSON.stringify(selectedItems));
            // window.location.href = `/CrearCaja?items=${dataParam}`;
            
            // Ejemplo 2: Guardar en sessionStorage y redirigir
            // sessionStorage.setItem('selectedItems', JSON.stringify(selectedItems));
            // window.location.href = '/CrearCaja';
            
            // Ejemplo 3: Mostrar modal con los datos
            showSelectionModal(selectedItems);
        });
    }
    
    // Botón Cancelar
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            if (confirm('¿Deseas salir de la lista?')) {
                window.location.href = '/hh';
            }
        });
    }
});

// Función para mostrar modal con items seleccionados
function showSelectionModal(items) {
    const modal = document.createElement('div');
    modal.className = 'selection-modal';
    
    const itemsList = items.map((item, index) => `
        <div class="modal-item">
            <h4>Item ${index + 1}</h4>
            <p><strong>Cliente:</strong> ${item.Cliente}</p>
            <p><strong>Parte:</strong> ${item.Parte}</p>
            <p><strong>Cantidad:</strong> ${item.Cantidad}</p>
            <p><strong>Bin:</strong> ${item.Bin}</p>
            <p><strong>OV:</strong> ${item.OV}</p>
            <p><strong>Lote:</strong> ${item.LotNum}</p>
            <p><strong>Empleado:</strong> ${item.EmpID}</p>
            <p><strong>ID:</strong> ${item.ID}</p>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Items Seleccionados (${items.length})</h3>
                <button class="modal-close">✕</button>
            </div>
            <div class="modal-body">
                ${itemsList}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="btnCloseModal">Cerrar</button>
                <button class="btn btn-primary" id="btnConfirmCajas">Confirmar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners del modal
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#btnCloseModal').addEventListener('click', () => modal.remove());
    modal.querySelector('#btnConfirmCajas').addEventListener('click', () => {
        // Obtener datos para la URL
        const orden = items[0].OV; // OV es la misma para todos
        const empId = items[0].EmpID || '00010'; // EmpID por defecto
        const ids = items.map(item => item.ID).join(','); // Concatenar todos los IDs
        
        // Construir URL y redirigir
        const url = `./EditCajas?orden=${orden}&EmpId=${empId}&ids=${encodeURIComponent(ids)}`;
        console.log('Redirigiendo a:', url);
        console.log('Items:', items);
        
        modal.remove();
        window.location.href = url;
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

