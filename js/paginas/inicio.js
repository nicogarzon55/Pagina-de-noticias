// Home: noticia de apertura (la más reciente) y noticias destacadas.

import { obtenerNoticias } from '../datos.js';
import {
  nombreCategoria, claseCategoria, imagenHTML,
  renderizarTarjetas, mostrarMensaje, activarBotonesFavorito
} from '../render.js';

const CANTIDAD_DESTACADAS = 3;

function pintarApertura(noticia) {
  const hero = document.getElementById('hero');
  hero.querySelector('#hero-categoria').className = claseCategoria(noticia.categoria);
  hero.querySelector('#hero-categoria').textContent = nombreCategoria(noticia.categoria);
  hero.querySelector('#hero-titulo').textContent = noticia.titulo;
  hero.querySelector('#hero-resumen').textContent = noticia.resumen;
  hero.querySelector('#hero-meta').textContent = `Por ${noticia.autor} · ${noticia.lectura} min de lectura`;
  hero.querySelector('#hero-enlace').href = `detalle.html?id=${noticia.id}`;
  hero.querySelector('#hero-imagen').innerHTML = imagenHTML(noticia, 'Foto de apertura');
  hero.querySelector('#hero-pie').textContent = noticia.pieFoto || '';
}

export async function iniciarInicio() {
  const grid = document.getElementById('destacadas-grid');
  activarBotonesFavorito(grid);

  try {
    const noticias = await obtenerNoticias();
    if (noticias.length === 0) {
      mostrarMensaje(grid, 'No hay noticias publicadas todavía.');
      return;
    }

    const [apertura, ...resto] = noticias;
    pintarApertura(apertura);

    // Primero las marcadas como destacadas; si faltan, se completa con las más recientes.
    const destacadas = [
      ...resto.filter((n) => n.destacada),
      ...resto.filter((n) => !n.destacada)
    ].slice(0, CANTIDAD_DESTACADAS);
    renderizarTarjetas(grid, destacadas);
  } catch (error) {
    console.error(error);
    mostrarMensaje(grid, 'No se pudieron cargar las noticias. Abre el proyecto con un servidor local (por ejemplo, Live Server).');
  }
}
