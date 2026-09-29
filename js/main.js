// Poli Noticias · punto de entrada.
// Inicializa lo común (fecha, buscador, imágenes) y luego la lógica de la página
// actual, que se identifica con el atributo data-pagina del <body>.

import { iniciarInicio } from './paginas/inicio.js';
import { iniciarNoticias } from './paginas/noticias.js';
import { iniciarDetalle } from './paginas/detalle.js';
import { iniciarFavoritos } from './paginas/favoritos.js';
import { iniciarContacto } from './paginas/contacto.js';

const paginas = {
  inicio: iniciarInicio,
  noticias: iniciarNoticias,
  detalle: iniciarDetalle,
  favoritos: iniciarFavoritos,
  contacto: iniciarContacto
};

function mostrarFechaEdicion() {
  const elemento = document.getElementById('fecha-edicion');
  if (!elemento) return;
  const hoy = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  elemento.textContent = `${hoy.charAt(0).toUpperCase()}${hoy.slice(1)} · Edición nacional`;
}

// El buscador del encabezado lleva a noticias.html?q=...
// En la página de noticias, esa misma página se encarga de filtrar en vivo.
function activarBuscador() {
  const formulario = document.getElementById('form-buscador');
  if (!formulario || document.body.dataset.pagina === 'noticias') return;
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const termino = formulario.querySelector('#q').value.trim();
    location.href = termino ? `noticias.html?q=${encodeURIComponent(termino)}` : 'noticias.html';
  });
}

// Si una imagen no carga (sin internet, URL rota) se muestra el recuadro de la maqueta.
function reemplazarImagenesRotas() {
  document.addEventListener('error', (evento) => {
    const imagen = evento.target;
    if (!(imagen instanceof HTMLImageElement) || !imagen.classList.contains('img')) return;
    const reemplazo = document.createElement('div');
    reemplazo.className = 'ph';
    reemplazo.dataset.etiqueta = 'Imagen';
    imagen.replaceWith(reemplazo);
  }, true);
}

mostrarFechaEdicion();
activarBuscador();
reemplazarImagenesRotas();

const iniciarPagina = paginas[document.body.dataset.pagina];
if (iniciarPagina) iniciarPagina();
