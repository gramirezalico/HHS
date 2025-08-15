let userName = localStorage.getItem('userName');
if (userName !== null) {
    document.getElementById('userName').textContent = userName;
}
   
    // Llama a esta función para llenar los selects al cargar la página

document.addEventListener('DOMContentLoaded', () => {
    try {
        const logoutButton = document.querySelector('.btn-logout');
        const addPackagingModal = document.getElementById('addPackagingModal');
        const addButton = document.querySelector('.btn-add');
        addButton.addEventListener('click', () => {


            addPackagingModal.style.display = 'flex';
            let pck = document.getElementById('packagingTypeList1')
            pck.addEventListener('change', (event) => {
                let selectedValue = event.target.value;
                console.log('Valor seleccionado:', selectedValue);
                getById(selectedValue, data => {
                    console.log(data);
                    let length = document.getElementById('length');
                    let width = document.getElementById('width');
                    let height = document.getElementById('height');
                    length.value = data['Packing_PkgLength'];
                    width.value = data['Packing_PkgWidth'];
                    height.value = data['Packing_PkgHeight'];
                });
            });
        });
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            window.location.href = '/login'; // Redirigir a la página de inicio de sesión
        });
        
        

        const boton = document.getElementById('miBoton');

        boton.addEventListener('click', () => {
            size(count => {
            console.log('Cantidad de registros:', count);
            });
        });

    } catch (error) {
        console.error('Error en el bloque try:', error);
    }
});
