import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import { NoticiasService } from '../../services/noticias.service';
import { ImagenNoticia } from '../../shared/imagen-noticia/imagen-noticia';
import { NoticiaCard } from '../../shared/noticia-card/noticia-card';

const CANTIDAD_DESTACADAS = 3;

/** Inicio: bienvenida, noticia de apertura (la más reciente) y destacadas. */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CapitalizarPipe, ImagenNoticia, NoticiaCard],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  protected readonly servicio = inject(NoticiasService);

  /** La noticia más reciente abre la portada. */
  readonly apertura = computed(() => this.servicio.noticias()[0] ?? null);

  /** Primero las marcadas como destacadas; si faltan, se completa con las más recientes. */
  readonly destacadas = computed(() => {
    const resto = this.servicio.noticias().slice(1);
    return [...resto.filter((n) => n.destacada), ...resto.filter((n) => !n.destacada)].slice(
      0,
      CANTIDAD_DESTACADAS
    );
  });
}
