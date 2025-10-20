let userName = localStorage.getItem('userName');
if (userName !== null) {
    document.getElementById('userName').textContent = userName;
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
});
