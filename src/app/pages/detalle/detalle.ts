import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';
import { ImagenNoticia } from '../../shared/imagen-noticia/imagen-noticia';

const CANTIDAD_RELACIONADAS = 3;

/**
 * Detalle de una noticia: /noticias/:id.
 * El parámetro :id llega como input gracias a withComponentInputBinding().
 */
@Component({
  selector: 'app-detalle',
  imports: [RouterLink, DatePipe, CapitalizarPipe, ImagenNoticia],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class Detalle {
  protected readonly servicio = inject(NoticiasService);
  protected readonly favoritos = inject(FavoritosService);
  private readonly title = inject(Title);

  /** Parámetro :id de la ruta (siempre llega como texto). */
  readonly id = input.required<string>();

  readonly noticia = computed(() => this.servicio.porId(Number(this.id())));

  readonly esFavorita = computed(() => {
    const noticia = this.noticia();
    return noticia !== null && this.favoritos.ids().includes(noticia.id);
  });

  /** Primero las de la misma categoría; si faltan, se completa con las demás. */
  readonly relacionadas = computed(() => {
    const actual = this.noticia();
    if (!actual) return [];
    const otras = this.servicio.noticias().filter((n) => n.id !== actual.id);
    return [
      ...otras.filter((n) => n.categoria === actual.categoria),
      ...otras.filter((n) => n.categoria !== actual.categoria)
    ].slice(0, CANTIDAD_RELACIONADAS);
  });

  constructor() {
    // El título de la pestaña cambia con la noticia abierta.
    effect(() => {
      const noticia = this.noticia();
      if (noticia) this.title.setTitle(`${noticia.titulo} · Poli Noticias`);
    });
  }

  alternarFavorito(id: number): void {
    this.favoritos.alternar(id);
  }
}
