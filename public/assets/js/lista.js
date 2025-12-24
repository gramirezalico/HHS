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

        const response = await fetch('/api/TI_HH_Listado');
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
                <button class="btn btn-primary" id="btnConfirmCajas">Confirmar y Procesar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners del modal
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#btnCloseModal').addEventListener('click', () => modal.remove());
    modal.querySelector('#btnConfirmCajas').addEventListener('click', () => {
        console.log('Procesando items:', items);
        // TODO: Aquí va la lógica de procesamiento
        modal.remove();
        alert(`Procesando ${items.length} items...`);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

