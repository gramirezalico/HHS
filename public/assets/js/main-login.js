import { loginUser } from './modules/api.js';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if(!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idInput = document.getElementById('id');
    const msg = document.getElementById('message');
    if(!idInput.value){ msg.textContent='Por favor, ingresa tu ID de empleado.'; return; }
    msg.textContent='Iniciando sesión...';
    try {
      const data = await loginUser(idInput.value);
      if(data.status==='success'){
        localStorage.setItem('userId', data.EmpBasic_EmpID);
        localStorage.setItem('userName', data.EmpBasic_Name);
        msg.textContent=`Bienvenido, ${data.EmpBasic_EmpID}`;
        setTimeout(()=>{ window.location.href='/hh'; }, 800);
      } else { msg.textContent='Error al iniciar sesión.'; }
    } catch(err){ console.error(err); msg.textContent='Error al iniciar sesión.'; }
  });
});