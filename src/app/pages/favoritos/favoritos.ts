import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';
import { NoticiaCard } from '../../shared/noticia-card/noticia-card';

/**
 * Mis favoritos: noticias cuyos ids están guardados en localStorage.
 * Al quitar un corazón la tarjeta desaparece sola, porque la lista es una señal calculada.
 */
@Component({
  selector: 'app-favoritos',
  imports: [RouterLink, NoticiaCard],
  template: `
    <h1 class="pagina-titulo">Mis favoritos</h1>
    <p class="meta">Noticias que has guardado para leer más tarde. Esta lista se conserva en tu navegador.</p>

    <section class="seccion" aria-labelledby="contador-favoritos">
      <h2 class="seccion__titulo" id="contador-favoritos" aria-live="polite">
        {{ favoritas().length }} {{ favoritas().length === 1 ? 'noticia guardada' : 'noticias guardadas' }}
      </h2>

      @switch (servicio.estado()) {
        @case ('cargando') {
          <p class="vacio">Cargando noticias…</p>
        }
        @case ('error') {
          <div class="vacio" role="alert">
            <p>No se pudieron cargar las noticias.</p>
            <button class="btn btn--borde" type="button" (click)="servicio.cargar()">Reintentar</button>
          </div>
        }
        @default {
          <div class="grid grid--2">
            @for (noticia of favoritas(); track noticia.id) {
              <app-noticia-card [noticia]="noticia" />
            } @empty {
              <p class="vacio">
                Aún no tienes favoritos. Toca el corazón de una noticia para guardarla.
                <a class="card__enlace" routerLink="/noticias">Ir a noticias</a>
              </p>
            }
          </div>
        }
      }
    </section>
  `
})
export class Favoritos {
  protected readonly servicio = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);

  /** Respeta el orden en que se guardaron e ignora ids de noticias eliminadas. */
  readonly favoritas = computed(() =>
    this.favoritos
      .ids()
      .map((id) => this.servicio.noticias().find((n) => n.id === id))
      .filter((n): n is Noticia => n !== undefined)
  );
}
