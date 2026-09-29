// Fuente de datos de las noticias (mini CRUD).
// Las noticias base vienen de data/noticias.json. Las que crea el usuario y los
// ids que elimina se guardan en localStorage, porque el JSON es de solo lectura.

import { leer, guardar, borrar } from './storage.js';
import { quitarFavorito } from './favoritos.js';

const URL_JSON = 'data/noticias.json';
const CLAVE_CREADAS = 'poli-noticias:creadas';
const CLAVE_ELIMINADAS = 'poli-noticias:eliminadas';

export const CATEGORIAS = ['educación', 'tecnológica', 'turismo', 'comercio'];

let noticiasBase = null;

async function cargarBase() {
  if (!noticiasBase) {
    const respuesta = await fetch(URL_JSON);
    if (!respuesta.ok) throw new Error(`No se pudo leer ${URL_JSON} (${respuesta.status})`);
    noticiasBase = await respuesta.json();
  }
  return noticiasBase;
}

// Devuelve todas las noticias visibles, de la más reciente a la más antigua.
export async function obtenerNoticias() {
  const base = await cargarBase();
  const eliminadas = leer(CLAVE_ELIMINADAS, []);
  const creadas = leer(CLAVE_CREADAS, []);
  return [...creadas, ...base]
    .filter((noticia) => !eliminadas.includes(noticia.id))
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
}

export async function obtenerNoticia(id) {
  const noticias = await obtenerNoticias();
  return noticias.find((noticia) => noticia.id === id) || null;
}

// Crea una noticia a partir de los datos del formulario y la guarda.
export async function crearNoticia(datos) {
  const base = await cargarBase();
  const creadas = leer(CLAVE_CREADAS, []);
  const idMaximo = Math.max(0, ...base.map((n) => n.id), ...creadas.map((n) => n.id));

  const noticia = {
    id: idMaximo + 1,
    titulo: datos.titulo,
    categoria: datos.categoria,
    resumen: datos.resumen,
    cuerpo: datos.cuerpo.split(/\n+/).map((p) => p.trim()).filter(Boolean),
    autor: datos.autor,
    fecha: new Date().toISOString().slice(0, 10),
    lectura: Math.max(1, Math.round(datos.cuerpo.split(/\s+/).length / 200)),
    imagen: datos.imagen || '',
    pieFoto: '',
    destacada: false
  };

  guardar(CLAVE_CREADAS, [noticia, ...creadas]);
  return noticia;
}

// Elimina una noticia: si la creó el usuario se borra; si viene del JSON se oculta.
export function eliminarNoticia(id) {
  const creadas = leer(CLAVE_CREADAS, []);
  if (creadas.some((n) => n.id === id)) {
    guardar(CLAVE_CREADAS, creadas.filter((n) => n.id !== id));
  } else {
    const eliminadas = leer(CLAVE_ELIMINADAS, []);
    guardar(CLAVE_ELIMINADAS, [...eliminadas, id]);
  }
  quitarFavorito(id);
}

// Vuelve al estado original del JSON.
export function restaurarNoticias() {
  borrar(CLAVE_CREADAS);
  borrar(CLAVE_ELIMINADAS);
}
