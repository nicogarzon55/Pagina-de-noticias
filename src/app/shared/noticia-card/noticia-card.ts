import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import { BotonFavorito } from '../boton-favorito/boton-favorito';
import { ImagenNoticia } from '../imagen-noticia/imagen-noticia';

/**
 * Tarjeta de noticia reutilizada en el inicio, el listado y favoritos.
 *
 * - Recibe la noticia por @Input (input()).
 * - Si `eliminable` es true muestra el botón Eliminar y avisa al padre con el
 *   evento (eliminar), que es quien decide qué hacer.
 */
@Component({
  selector: 'app-noticia-card',
  imports: [RouterLink, CapitalizarPipe, BotonFavorito, ImagenNoticia],
  host: { role: 'article', '[attr.data-id]': 'noticia().id' },
  template: `
    <app-imagen-noticia [noticia]="noticia()" />
    <app-boton-favorito [idNoticia]="noticia().id" />
    <p class="categoria" [class.categoria--comercio]="noticia().categoria === 'comercio'">
      {{ noticia().categoria | capitalizar }}
    </p>
    <h3>{{ noticia().titulo }}</h3>
    <p>{{ noticia().resumen }}</p>
    <div class="card__pie">
      <a class="card__enlace" [routerLink]="['/noticias', noticia().id]">Ver más →</a>
      @if (eliminable()) {
        <button type="button" class="card__eliminar" (click)="eliminar.emit(noticia())">Eliminar</button>
      }
    </div>
  `,
  styles: `
    :host{position:relative;display:flex;flex-direction:column}
    h3{font:400 1.2rem/1.3 var(--serif);margin:.2rem 0 .5rem}
    p{margin:0 0 .8rem;font-size:.9rem;color:var(--tinta-suave)}
    .categoria{margin-top:.8rem;color:var(--verde)}
    .categoria--comercio{color:var(--rojo)}
    .card__pie{margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:1rem}
    .card__eliminar{background:none;border:0;padding:0;font:700 .72rem var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--rojo);cursor:pointer}
    .card__eliminar:hover{text-decoration:underline}
  `
})
export class NoticiaCard {
  readonly noticia = input.required<Noticia>();
  readonly eliminable = input(false);

  /** Se emite con la noticia cuando el usuario pulsa Eliminar. */
  readonly eliminar = output<Noticia>();
}
