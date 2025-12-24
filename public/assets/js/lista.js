// Estado global para almacenar los datos
let listData = [];

// Función para cargar los datos desde el backend
async function loadData() {
    try {
        const response = await fetch('/api/TI_HH_Listado');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.status === 'success' && data.value) {
            listData = data.value;
            renderTable(listData);
        } else {
            console.error('No data received from API');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error al cargar los datos');
    }
}

// Función para renderizar la tabla dinámicamente
function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpiar tabla
    
    data.forEach((item) => {
        const row = document.createElement('tr');
        
        // Guardamos todos los datos del objeto en el data attribute
        row.setAttribute('data-item', JSON.stringify(item));
        
        // Crear celdas
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" /></td>
            <td>${item.Cliente || ''}</td>
            <td>${item.Parte || ''}</td>
            <td>${item.Cantidad || ''}</td>
            <td>${item.Bin || ''}</td>
            <td>${item.OV || ''}</td>
            <td>${item.LotNum || ''}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Función para obtener los items seleccionados
function getSelectedItems() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    const selectedItems = [];
    
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const itemData = row.getAttribute('data-item');
        if (itemData) {
            selectedItems.push(JSON.parse(itemData));
        }
    });
    
    return selectedItems;
}

// Event listener para el botón CAJAS
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos al iniciar
    loadData();
    
    // Botón CAJAS
    const btnCajas = document.getElementById('btnGuardar');
    if (btnCajas) {
        btnCajas.addEventListener('click', () => {
            const selectedItems = getSelectedItems();
            
            if (selectedItems.length === 0) {
                alert('Por favor selecciona al menos un item');
                return;
            }
            
            console.log('Items seleccionados:', selectedItems);
            
            // Aquí puedes hacer lo que necesites con los items seleccionados
            // Por ejemplo, mostrarlos en consola o enviarlos a otra página
            selectedItems.forEach((item, index) => {
                console.log(`Item ${index + 1}:`, item);
            });
            
            // Opcional: Redirigir o mostrar en un modal
            // window.location.href = `/CrearCaja?data=${encodeURIComponent(JSON.stringify(selectedItems))}`;
        });
    }
    
    // Botón Cancelar
    const btnCancel = document.querySelector('.btn-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            window.location.href = '/hh';
        });
    }
});
