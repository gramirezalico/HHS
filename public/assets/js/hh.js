document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  if (userName) {
    const el = document.getElementById('userName');
    if (el) el.textContent = userName;
  }

  const logoutButton = document.querySelector('.btn-logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    });
  }

  // Botón de diagnóstico opcional
  const boton = document.getElementById('miBoton');
  if (boton && typeof size === 'function') {
    boton.addEventListener('click', () => {
      size(count => console.log('Cantidad de registros:', count));
    });
  }
});
