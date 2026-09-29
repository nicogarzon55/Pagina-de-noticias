// Gestión de favoritos: una lista de ids guardada en localStorage.

import { leer, guardar } from './storage.js';

const CLAVE_FAVORITOS = 'poli-noticias:favoritos';

export function obtenerFavoritos() {
  return leer(CLAVE_FAVORITOS, []);
}

export function esFavorito(id) {
  return obtenerFavoritos().includes(id);
}

// Agrega o quita la noticia y devuelve true si quedó como favorita.
export function alternarFavorito(id) {
  const favoritos = obtenerFavoritos();
  const yaEsta = favoritos.includes(id);
  guardar(CLAVE_FAVORITOS, yaEsta ? favoritos.filter((f) => f !== id) : [...favoritos, id]);
  return !yaEsta;
}

export function quitarFavorito(id) {
  guardar(CLAVE_FAVORITOS, obtenerFavoritos().filter((f) => f !== id));
}
