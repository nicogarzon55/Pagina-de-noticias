/**
 * Utilidades de texto compartidas.
 */

/** Quita tildes y mayúsculas para comparar: "tecnologica" encuentra "Tecnológica". */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
