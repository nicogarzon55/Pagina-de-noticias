/**
 * Modelo de datos de Poli Noticias.
 * Estas interfaces describen la forma de cada registro de public/data/noticias.json
 * y de los datos que se capturan en el formulario "Publicar una noticia".
 */

/** Categorías disponibles. Se escriben igual que en el JSON (con tilde). */
export type Categoria = 'educación' | 'tecnológica' | 'turismo' | 'comercio';

/** Lista ordenada de categorías: alimenta el menú y el selector del formulario. */
export const CATEGORIAS: readonly Categoria[] = ['educación', 'tecnológica', 'turismo', 'comercio'];

/** Una noticia del catálogo o creada por el usuario. */
export interface Noticia {
  /** Identificador único; se usa en la ruta /noticias/:id. */
  id: number;
  titulo: string;
  categoria: Categoria;
  /** Descripción breve que se muestra en la tarjeta. */
  resumen: string;
  /** Párrafos del contenido completo. */
  cuerpo: string[];
  autor: string;
  /** Fecha de publicación en formato AAAA-MM-DD; define el orden del listado. */
  fecha: string;
  /** Tiempo estimado de lectura en minutos. */
  lectura: number;
  /** Ruta o URL de la imagen. Vacía si la noticia no tiene foto. */
  imagen: string;
  /** Texto que acompaña la imagen en la vista de detalle. */
  pieFoto: string;
  /** Si es true, aparece entre las destacadas del inicio. */
  destacada: boolean;
}

/** Datos que entrega el formulario para crear una noticia. */
export interface NuevaNoticia {
  titulo: string;
  categoria: Categoria;
  resumen: string;
  /** Texto libre: cada salto de línea separa un párrafo. */
  cuerpo: string;
  autor: string;
  imagen: string;
}

/** Estado de la carga del archivo JSON. */
export type EstadoCarga = 'cargando' | 'listo' | 'error';
