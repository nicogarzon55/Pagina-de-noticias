import { Component, computed, input, output } from '@angular/core';

/**
 * Botones numerados de paginación.
 * Recibe el total de páginas y la actual; emite (cambiar) con el número elegido.
 * Si solo hay una página no muestra nada.
 */
@Component({
  selector: 'app-paginacion',
  template: `
    @if (totalPaginas() > 1) {
      <nav class="paginacion" aria-label="Paginación">
        @for (numero of numeros(); track numero) {
          <button
            type="button"
            [class.activo]="numero === paginaActual()"
            [attr.aria-current]="numero === paginaActual() ? 'page' : null"
            [attr.aria-label]="'Página ' + numero"
            (click)="cambiar.emit(numero)"
          >{{ numero }}</button>
        }
      </nav>
    }
  `,
  styles: `
    .paginacion{display:flex;justify-content:center;gap:.4rem;margin-top:2.5rem}
    button{width:38px;height:38px;border:1px solid var(--linea);background:transparent;cursor:pointer;font:inherit;color:var(--tinta)}
    button:hover{border-color:var(--tinta)}
    .activo{background:var(--tinta);color:var(--fondo);border-color:var(--tinta)}
  `
})
export class Paginacion {
  readonly totalPaginas = input.required<number>();
  readonly paginaActual = input.required<number>();
  readonly cambiar = output<number>();

  readonly numeros = computed(() => Array.from({ length: this.totalPaginas() }, (_, i) => i + 1));
}
