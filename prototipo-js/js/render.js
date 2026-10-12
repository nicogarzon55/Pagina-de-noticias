// Funciones que convierten noticias en HTML y utilidades de presentación.

import { esFavorito, alternarFavorito } from './favoritos.js';

// Evita que el texto escrito por el usuario se interprete como HTML.
export function escaparHTML(texto = '') {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function nombreCategoria(categoria) {
  return categoria.charAt(0).toUpperCase() + categoria.slice(1);
}

export function claseCategoria(categoria) {
  return categoria === 'comercio' ? 'categoria categoria--comercio' : 'categoria';
}

export function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

// Imagen de la noticia o, si no tiene, el recuadro rayado de la maqueta.
export function imagenHTML(noticia, etiqueta = 'Imagen') {
  if (!noticia.imagen) return `<div class="ph" data-etiqueta="${escaparHTML(etiqueta)}"></div>`;
  return `<img class="img" src="${escaparHTML(noticia.imagen)}" alt="${escaparHTML(noticia.titulo)}" loading="lazy">`;
}

export function botonFavoritoHTML(id) {
  const activo = esFavorito(id);
  const texto = activo ? 'Quitar de favoritos' : 'Agregar a favoritos';
  return `<button type="button" class="fav${activo ? ' activo' : ''}" aria-pressed="${activo}" aria-label="${texto}" title="${texto}">${activo ? '♥' : '♡'}</button>`;
}

export function tarjetaHTML(noticia, { eliminable = false } = {}) {
  return `
    <article class="card" data-id="${noticia.id}" data-categoria="${escaparHTML(noticia.categoria)}">
      ${imagenHTML(noticia)}
      ${botonFavoritoHTML(noticia.id)}
      <p class="${claseCategoria(noticia.categoria)}">${escaparHTML(nombreCategoria(noticia.categoria))}</p>
      <h3>${escaparHTML(noticia.titulo)}</h3>
      <p>${escaparHTML(noticia.resumen)}</p>
      <div class="card__pie">
        <a class="card__enlace" href="detalle.html?id=${noticia.id}">Ver más →</a>
        ${eliminable ? '<button type="button" class="card__eliminar">Eliminar</button>' : ''}
      </div>
    </article>`;
}

export function renderizarTarjetas(contenedor, noticias, opciones) {
  contenedor.innerHTML = noticias.map((noticia) => tarjetaHTML(noticia, opciones)).join('');
}

export function mostrarMensaje(contenedor, texto) {
  contenedor.innerHTML = `<p class="vacio">${escaparHTML(texto)}</p>`;
}

// Actualiza el aspecto de un botón .fav después de alternarlo.
export function pintarBotonFavorito(boton, activo) {
  const texto = activo ? 'Quitar de favoritos' : 'Agregar a favoritos';
  boton.classList.toggle('activo', activo);
  boton.setAttribute('aria-pressed', String(activo));
  boton.setAttribute('aria-label', texto);
  boton.title = texto;
  boton.textContent = activo ? '♥' : '♡';
}

// Delegación de eventos: un solo listener maneja los corazones de todas las tarjetas.
export function activarBotonesFavorito(contenedor, alCambiar) {
  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.fav');
    if (!boton) return;
    const id = Number(boton.closest('.card').dataset.id);
    const activo = alternarFavorito(id);
    pintarBotonFavorito(boton, activo);
    if (alCambiar) alCambiar(id, activo);
  });
}
