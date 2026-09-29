// Contacto: validación del formulario y mensaje de confirmación.

import { reglas, validarFormulario, validarEnVivo, limpiarErrores, datosDelFormulario } from '../validacion.js';

const esquemaContacto = {
  nombre: [reglas.obligatorio, reglas.minimo(3)],
  correo: [reglas.obligatorio, reglas.correo],
  asunto: [reglas.obligatorio],
  mensaje: [reglas.obligatorio, reglas.minimo(20)]
};

export function iniciarContacto() {
  const formulario = document.getElementById('form-contacto');
  const exito = document.getElementById('mensaje-exito');
  validarEnVivo(formulario, esquemaContacto);

  // Si se llega desde el detalle de una noticia, se precarga el mensaje.
  const noticia = new URLSearchParams(location.search).get('noticia');
  if (noticia) formulario.elements.mensaje.value = `Sobre la noticia «${noticia}»: `;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    exito.classList.remove('visible');
    if (!validarFormulario(formulario, esquemaContacto)) return;

    // No hay servidor: el envío se simula y se muestra la confirmación.
    const { nombre, correo } = datosDelFormulario(formulario);
    exito.querySelector('span').textContent =
      `Gracias, ${nombre}. Te responderemos pronto a ${correo}.`;
    exito.classList.add('visible');
    formulario.reset();
    limpiarErrores(formulario);
  });
}
