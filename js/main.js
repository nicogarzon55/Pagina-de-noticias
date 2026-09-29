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

// El buscador del encabezado filtra mientras se escribe: en la página de
// noticias lo hace esa misma página; en las demás, tras una breve pausa al
// escribir (o con Enter), lleva a noticias.html?q=...
function activarBuscador() {
  const formulario = document.getElementById('form-buscador');
  if (!formulario || document.body.dataset.pagina === 'noticias') return;
  const campo = formulario.querySelector('#q');
  const irAResultados = () => {
    const termino = campo.value.trim();
    location.href = termino ? `noticias.html?q=${encodeURIComponent(termino)}` : 'noticias.html';
  };
  let espera;
  campo.addEventListener('input', () => {
    clearTimeout(espera);
    if (campo.value.trim()) espera = setTimeout(irAResultados, 400);
  });
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    clearTimeout(espera);
    irAResultados();
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
