import { Component, input, linkedSignal } from '@angular/core';
import { Noticia } from '../../models/noticia';

/**
 * Imagen de una noticia. Si la noticia no tiene foto o la imagen no carga
 * (sin internet, URL rota) muestra el recuadro rayado de la maqueta.
 */
@Component({
  selector: 'app-imagen-noticia',
  template: `
    @if (noticia().imagen && !fallo()) {
      <img class="img" [src]="noticia().imagen" [alt]="noticia().titulo" loading="lazy" (error)="fallo.set(true)" />
    } @else {
      <div class="ph" [attr.data-etiqueta]="etiqueta()" role="img" [attr.aria-label]="'Sin imagen: ' + noticia().titulo"></div>
    }
  `,
  styles: `
    :host{display:block}
    .img,.ph{background:repeating-linear-gradient(135deg,var(--fondo-2) 0 8px,#ddd4bd 8px 16px);aspect-ratio:16/10;width:100%;object-fit:cover;position:relative;display:block}
    .ph::after{content:attr(data-etiqueta);position:absolute;left:10px;bottom:10px;background:var(--fondo);font-size:.65rem;letter-spacing:.1em;padding:.2rem .5rem;text-transform:uppercase}
  `
})
export class ImagenNoticia {
  readonly noticia = input.required<Noticia>();
  /** Texto del recuadro cuando no hay imagen. */
  readonly etiqueta = input('Imagen');

  /** Se vuelve false cada vez que cambia la noticia (por ejemplo, al pasar a otra en el detalle). */
  readonly fallo = linkedSignal({ source: this.noticia, computation: () => false });
}
