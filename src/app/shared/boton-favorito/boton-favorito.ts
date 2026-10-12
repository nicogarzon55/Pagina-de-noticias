import { Component, computed, inject, input } from '@angular/core';
import { FavoritosService } from '../../services/favoritos.service';

/**
 * Corazón circular para guardar o quitar una noticia de favoritos.
 * Se ubica en la esquina superior de la tarjeta.
 */
@Component({
  selector: 'app-boton-favorito',
  template: `
    <button
      type="button"
      class="fav"
      [class.activo]="activo()"
      [attr.aria-pressed]="activo()"
      [attr.aria-label]="texto()"
      [title]="texto()"
      (click)="favoritos.alternar(idNoticia())"
    >{{ activo() ? '♥' : '♡' }}</button>
  `,
  styles: `
    .fav{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;border:1.5px solid var(--tinta);background:var(--fondo);color:var(--tinta);font-size:1rem;line-height:1;cursor:pointer}
    .fav:hover{background:#fff}
    .fav.activo{background:var(--rojo);border-color:var(--rojo);color:#fff}
  `
})
export class BotonFavorito {
  protected readonly favoritos = inject(FavoritosService);

  readonly idNoticia = input.required<number>();

  readonly activo = computed(() => this.favoritos.ids().includes(this.idNoticia()));
  readonly texto = computed(() => (this.activo() ? 'Quitar de favoritos' : 'Agregar a favoritos'));
}
