// Listado de noticias: filtros por categoría, búsqueda, paginación y mini CRUD
// (publicar y eliminar noticias).

import { obtenerNoticias, crearNoticia, eliminarNoticia, restaurarNoticias } from '../datos.js';
import { renderizarTarjetas, mostrarMensaje, activarBotonesFavorito } from '../render.js';
import { reglas, validarFormulario, validarEnVivo, limpiarErrores, datosDelFormulario } from '../validacion.js';

const POR_PAGINA = 6;

const estado = {
  noticias: [],
  categoria: 'todas',
  busqueda: '',
  pagina: 1
};

// Compara sin tildes ni mayúsculas: "tecnologica" encuentra "Tecnológica".
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function noticiasFiltradas() {
  const busqueda = normalizar(estado.busqueda);
  return estado.noticias.filter((noticia) => {
    const coincideCategoria = estado.categoria === 'todas'
      || normalizar(noticia.categoria) === normalizar(estado.categoria);
    const coincideBusqueda = !busqueda
      || normalizar(`${noticia.titulo} ${noticia.resumen}`).includes(busqueda);
    return coincideCategoria && coincideBusqueda;
  });
}

function actualizarURL() {
  const parametros = new URLSearchParams();
  if (estado.categoria !== 'todas') parametros.set('categoria', estado.categoria);
  if (estado.busqueda) parametros.set('q', estado.busqueda);
  const consulta = parametros.toString();
  history.replaceState(null, '', consulta ? `?${consulta}` : location.pathname);
}

// Resalta en el menú superior la categoría que se está filtrando.
function pintarFiltros() {
  document.querySelectorAll('.nav__cat').forEach((enlace) => {
    const categoria = new URL(enlace.href).searchParams.get('categoria') || '';
    enlace.classList.toggle('activo', normalizar(categoria) === normalizar(estado.categoria));
  });
}

function pintarPaginacion(totalPaginas) {
  const paginacion = document.getElementById('paginacion');
  paginacion.hidden = totalPaginas <= 1;
  paginacion.innerHTML = Array.from({ length: totalPaginas }, (_, i) => {
    const numero = i + 1;
    const activo = numero === estado.pagina;
    return `<button type="button" data-pagina="${numero}"${activo ? ' class="activo" aria-current="page"' : ''}>${numero}</button>`;
  }).join('');
}

function pintarListado() {
  const grid = document.getElementById('noticias-grid');
  const sinResultados = document.getElementById('sin-resultados');
  const titulo = document.getElementById('titulo-listado');

  const filtradas = noticiasFiltradas();
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  estado.pagina = Math.min(estado.pagina, totalPaginas);
  const inicio = (estado.pagina - 1) * POR_PAGINA;

  titulo.textContent = estado.busqueda ? `Resultados para «${estado.busqueda}»` : 'Todas las noticias';
  renderizarTarjetas(grid, filtradas.slice(inicio, inicio + POR_PAGINA), { eliminable: true });
  sinResultados.hidden = filtradas.length > 0;
  pintarFiltros();
  pintarPaginacion(totalPaginas);
  actualizarURL();
}

async function recargar() {
  estado.noticias = await obtenerNoticias();
  pintarListado();
}

function activarFiltrosYBusqueda() {
  // Las categorías del menú filtran sin recargar la página; un segundo clic
  // sobre la categoría activa vuelve a mostrar todas.
  document.querySelector('.nav').addEventListener('click', (evento) => {
    const enlace = evento.target.closest('.nav__cat');
    if (!enlace) return;
    evento.preventDefault();
    const categoria = new URL(enlace.href).searchParams.get('categoria');
    estado.categoria = normalizar(categoria) === normalizar(estado.categoria) ? 'todas' : categoria;
    estado.pagina = 1;
    pintarListado();
  });

  const buscador = document.getElementById('form-buscador');
  const campoBusqueda = buscador.querySelector('#q');
  campoBusqueda.value = estado.busqueda;
  // Si se llegó escribiendo desde otra página, se sigue escribiendo aquí.
  if (estado.busqueda) {
    campoBusqueda.focus();
    campoBusqueda.setSelectionRange(campoBusqueda.value.length, campoBusqueda.value.length);
  }
  buscador.addEventListener('submit', (evento) => evento.preventDefault());
  campoBusqueda.addEventListener('input', () => {
    estado.busqueda = campoBusqueda.value.trim();
    estado.pagina = 1;
    pintarListado();
  });

  document.getElementById('paginacion').addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-pagina]');
    if (!boton) return;
    estado.pagina = Number(boton.dataset.pagina);
    pintarListado();
    document.getElementById('titulo-listado').scrollIntoView({ behavior: 'smooth' });
  });
}

function activarEliminar() {
  document.getElementById('noticias-grid').addEventListener('click', async (evento) => {
    const boton = evento.target.closest('.card__eliminar');
    if (!boton) return;
    const tarjeta = boton.closest('.card');
    const titulo = tarjeta.querySelector('h3').textContent;
    if (!confirm(`¿Eliminar la noticia «${titulo}»?`)) return;
    eliminarNoticia(Number(tarjeta.dataset.id));
    await recargar();
  });

  document.getElementById('btn-restaurar').addEventListener('click', async () => {
    if (!confirm('Se borrarán las noticias que publicaste y volverán las eliminadas. ¿Continuar?')) return;
    restaurarNoticias();
    await recargar();
  });
}

const esquemaNoticia = {
  titulo: [reglas.obligatorio, reglas.minimo(10), reglas.maximo(120)],
  categoria: [reglas.obligatorio],
  resumen: [reglas.obligatorio, reglas.minimo(10), reglas.maximo(160)],
  cuerpo: [reglas.obligatorio, reglas.minimo(40)],
  autor: [reglas.obligatorio],
  imagen: [reglas.urlOpcional]
};

function activarFormularioNoticia() {
  const formulario = document.getElementById('form-noticia');
  const exito = document.getElementById('noticia-exito');
  validarEnVivo(formulario, esquemaNoticia);

  // El botón "Publicar noticia" del inicio enlaza a noticias.html#panel-crear.
  if (location.hash === '#panel-crear') document.getElementById('panel-crear').open = true;

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    exito.classList.remove('visible');
    if (!validarFormulario(formulario, esquemaNoticia)) return;

    const noticia = await crearNoticia(datosDelFormulario(formulario));
    formulario.reset();
    limpiarErrores(formulario);
    exito.querySelector('a').href = `detalle.html?id=${noticia.id}`;
    exito.classList.add('visible');

    // Se muestra la noticia nueva al inicio del listado.
    estado.categoria = 'todas';
    estado.busqueda = '';
    estado.pagina = 1;
    document.getElementById('q').value = '';
    await recargar();
  });
}

export async function iniciarNoticias() {
  const parametros = new URLSearchParams(location.search);
  estado.categoria = parametros.get('categoria') || 'todas';
  estado.busqueda = parametros.get('q') || '';

  const grid = document.getElementById('noticias-grid');
  activarBotonesFavorito(grid);
  activarFiltrosYBusqueda();
  activarEliminar();
  activarFormularioNoticia();

  try {
    await recargar();
  } catch (error) {
    console.error(error);
    mostrarMensaje(grid, 'No se pudieron cargar las noticias. Abre el proyecto con un servidor local (por ejemplo, Live Server).');
    document.getElementById('paginacion').hidden = true;
  }
}
