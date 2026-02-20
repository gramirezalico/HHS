document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (event) => {
        const id = document.getElementById('id');
        event.preventDefault(); 
        const message = document.getElementById('message');
        message.textContent = 'Iniciando sesión...';        
        try {
            //validate
            if (!id.value) {
                message.textContent = 'Por favor, ingresa tu ID de empleado.';
                return;
            }
            const base = (window.APP_BASE||'').replace(/\/?$/, '/');
            const response = await fetch(base + './api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id.value })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos del servidor:', data); // Log detallado

            if (data.status === 'success') {
                message.textContent = `Bienvenido, ${data.EmpBasic_EmpID}`;
                localStorage.setItem('userId', data.EmpBasic_EmpID);
                localStorage.setItem('userName', data.EmpBasic_Name);
                setTimeout(() => {
                    message.textContent = ''; // Limpiar mensaje después de 2 segundos
                    window.location.href = './CrearCaja'; // Redirigir a la aplicación HH
                }, 2000);
            } else {
                message.textContent = 'Error al iniciar sesión. Inténtalo de nuevo.';
            }
        } catch (error) {
            console.error('Error en la solicitud de inicio de sesión:', error); 
            message.textContent = 'Error al iniciar sesión. Por favor, inténtalo más tarde.';
        }
    });
});