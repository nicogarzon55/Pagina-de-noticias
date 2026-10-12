import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pone en mayúscula la primera letra.
 * Uso: {{ noticia.categoria | capitalizar }} → "Educación".
 */
@Pipe({ name: 'capitalizar' })
export class CapitalizarPipe implements PipeTransform {
  transform(texto: string | null | undefined): string {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}
