// Lectura y escritura segura en localStorage.
// Si el navegador bloquea el almacenamiento, la app sigue funcionando sin persistir.

export function leer(clave, valorPorDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? valorPorDefecto : JSON.parse(texto);
  } catch {
    return valorPorDefecto;
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena): se ignora.
  }
}

export function borrar(clave) {
  try {
    localStorage.removeItem(clave);
  } catch {
    // Igual que arriba.
  }
}
