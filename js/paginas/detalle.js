// Detalle de una noticia: se identifica por el parámetro ?id= de la URL.

import { obtenerNoticias } from '../datos.js';
import { esFavorito, alternarFavorito } from '../favoritos.js';
import {
  escaparHTML, nombreCategoria, claseCategoria, formatearFecha, imagenHTML
} from '../render.js';

const CANTIDAD_RELACIONADAS = 3;

function pintarBotonDetalle(boton, activo) {
  boton.setAttribute('aria-pressed', String(activo));
  boton.classList.toggle('activo', activo);
  boton.textContent = activo ? '♥ En favoritos' : '♡ Agregar a favoritos';
}

function pintarNoticia(noticia) {
  document.title = `${noticia.titulo} · Poli Noticias`;
  const categoria = document.getElementById('d-categoria');
  categoria.className = claseCategoria(noticia.categoria);
  categoria.textContent = nombreCategoria(noticia.categoria);
  document.getElementById('d-titulo').textContent = noticia.titulo;
  document.getElementById('d-meta').textContent =
    `Por ${noticia.autor} · ${formatearFecha(noticia.fecha)} · ${noticia.lectura} min de lectura`;
  document.getElementById('d-imagen').innerHTML = imagenHTML(noticia, 'Imagen principal');
  document.getElementById('d-pie').textContent = noticia.pieFoto || '';
  document.getElementById('d-cuerpo').innerHTML =
    noticia.cuerpo.map((parrafo) => `<p>${escaparHTML(parrafo)}</p>`).join('');
  document.getElementById('btn-contactar').href =
    `contacto.html?noticia=${encodeURIComponent(noticia.titulo)}`;

  const boton = document.getElementById('btn-favorito');
  pintarBotonDetalle(boton, esFavorito(noticia.id));
  boton.addEventListener('click', () => pintarBotonDetalle(boton, alternarFavorito(noticia.id)));
}

function pintarRelacionadas(noticia, noticias) {
  const otras = noticias.filter((n) => n.id !== noticia.id);
  const relacionadas = [
    ...otras.filter((n) => n.categoria === noticia.categoria),
    ...otras.filter((n) => n.categoria !== noticia.categoria)
  ].slice(0, CANTIDAD_RELACIONADAS);

  document.getElementById('relacionadas-lista').innerHTML = relacionadas.map((n) => `
    <a href="detalle.html?id=${n.id}">${imagenHTML(n)}<h3>${escaparHTML(n.titulo)}</h3></a>`).join('');
}

function mostrarNoEncontrada(texto) {
  document.getElementById('detalle').hidden = true;
  const aviso = document.getElementById('detalle-no-encontrada');
  aviso.querySelector('span').textContent = texto;
  aviso.hidden = false;
}

export async function iniciarDetalle() {
  const id = Number(new URLSearchParams(location.search).get('id'));

  try {
    const noticias = await obtenerNoticias();
    const noticia = noticias.find((n) => n.id === id);
    if (!noticia) {
      mostrarNoEncontrada('La noticia que buscas no existe o fue eliminada.');
      return;
    }
    pintarNoticia(noticia);
    pintarRelacionadas(noticia, noticias);
  } catch (error) {
    console.error(error);
    mostrarNoEncontrada('No se pudo cargar la noticia. Abre el proyecto con un servidor local (por ejemplo, Live Server).');
  }
}
