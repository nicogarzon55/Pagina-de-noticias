// Mis favoritos: muestra las noticias cuyos ids están guardados en localStorage.

import { obtenerNoticias } from '../datos.js';
import { obtenerFavoritos } from '../favoritos.js';
import { renderizarTarjetas, mostrarMensaje, activarBotonesFavorito } from '../render.js';

let todas = [];

function pintarFavoritos() {
  const grid = document.getElementById('favoritos-grid');
  const ids = obtenerFavoritos();
  // Se respeta el orden en que se guardaron y se ignoran ids de noticias eliminadas.
  const favoritas = ids.map((id) => todas.find((n) => n.id === id)).filter(Boolean);

  const total = favoritas.length;
  document.getElementById('contador-favoritos').textContent =
    `${total} ${total === 1 ? 'noticia guardada' : 'noticias guardadas'}`;
  document.getElementById('favoritos-vacio').hidden = total > 0;
  renderizarTarjetas(grid, favoritas);
}

export async function iniciarFavoritos() {
  const grid = document.getElementById('favoritos-grid');
  // Al quitar un corazón en esta página, la tarjeta desaparece de la lista.
  activarBotonesFavorito(grid, pintarFavoritos);

  try {
    todas = await obtenerNoticias();
    pintarFavoritos();
  } catch (error) {
    console.error(error);
    mostrarMensaje(grid, 'No se pudieron cargar las noticias. Abre el proyecto con un servidor local (por ejemplo, Live Server).');
  }
}
