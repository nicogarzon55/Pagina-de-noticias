// Validación de formularios reutilizable (contacto y publicar noticia).
// Cada regla recibe el valor del campo y devuelve true si es válido.
// El error se muestra con la clase .invalido en el .campo que contiene el input.

export const reglas = {
  obligatorio: (valor) => valor.trim() !== '',
  correo: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim()),
  minimo: (n) => (valor) => valor.trim().length >= n,
  maximo: (n) => (valor) => valor.trim().length <= n,
  urlOpcional: (valor) => valor.trim() === '' || /^https?:\/\/\S+\.\S+/.test(valor.trim())
};

function validarCampo(campo, validaciones) {
  const valido = validaciones.every((regla) => regla(campo.value));
  campo.closest('.campo').classList.toggle('invalido', !valido);
  campo.setAttribute('aria-invalid', String(!valido));
  return valido;
}

// esquema: { nombreDelCampo: [regla, regla, ...] }
// Devuelve true si todo es válido; si no, enfoca el primer campo con error.
export function validarFormulario(formulario, esquema) {
  let primerInvalido = null;
  for (const [nombre, validaciones] of Object.entries(esquema)) {
    const campo = formulario.elements[nombre];
    if (!validarCampo(campo, validaciones) && !primerInvalido) primerInvalido = campo;
  }
  if (primerInvalido) primerInvalido.focus();
  return !primerInvalido;
}

// Después del primer intento, corrige el error en vivo mientras el usuario escribe.
export function validarEnVivo(formulario, esquema) {
  formulario.addEventListener('input', (evento) => {
    const campo = evento.target;
    const validaciones = esquema[campo.name];
    if (validaciones && campo.closest('.campo').classList.contains('invalido')) {
      validarCampo(campo, validaciones);
    }
  });
}

export function limpiarErrores(formulario) {
  formulario.querySelectorAll('.campo.invalido').forEach((campo) => campo.classList.remove('invalido'));
  formulario.querySelectorAll('[aria-invalid]').forEach((campo) => campo.removeAttribute('aria-invalid'));
}

export function datosDelFormulario(formulario) {
  const datos = Object.fromEntries(new FormData(formulario));
  for (const clave in datos) datos[clave] = String(datos[clave]).trim();
  return datos;
}
