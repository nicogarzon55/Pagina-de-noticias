import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias.service';
import { NoticiaCard } from '../../shared/noticia-card/noticia-card';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { normalizar } from '../../utils/texto';
import { FormNoticia } from './form-noticia/form-noticia';

const POR_PAGINA = 6;

/**
 * Listado de noticias con búsqueda, filtro por categoría, paginación y mini CRUD.
 *
 * Los filtros viven en la URL (/noticias?categoria=turismo&q=bogota). Gracias a
 * withComponentInputBinding() el router los entrega como inputs del componente,
 * así que basta con cambiar la URL para que el listado se recalcule.
 */
@Component({
  selector: 'app-noticias',
  imports: [NoticiaCard, Paginacion, FormNoticia],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css'
})
export class Noticias {
  protected readonly servicio = inject(NoticiasService);
  private readonly router = inject(Router);

  /** ?q= de la URL (texto buscado). */
  readonly q = input<string | undefined>();
  /** ?categoria= de la URL. */
  readonly categoria = input<string | undefined>();

  /** El panel de publicar se abre si se llega con #panel-crear (botón del inicio). */
  readonly panelAbierto = inject(ActivatedRoute).snapshot.fragment === 'panel-crear';

  /** Página actual; vuelve a 1 cada vez que cambia la búsqueda o la categoría. */
  readonly pagina = linkedSignal({
    source: () => [this.q(), this.categoria()],
    computation: () => 1
  });

  readonly titulo = computed(() =>
    this.q()?.trim() ? `Resultados para «${this.q()!.trim()}»` : 'Todas las noticias'
  );

  /** Noticias que cumplen la búsqueda (sin tildes ni mayúsculas) y la categoría. */
  readonly filtradas = computed(() => {
    const busqueda = normalizar(this.q()?.trim() ?? '');
    const categoria = normalizar(this.categoria() ?? '');
    return this.servicio.noticias().filter((noticia) => {
      const coincideCategoria = !categoria || normalizar(noticia.categoria) === categoria;
      const coincideBusqueda =
        !busqueda || normalizar(`${noticia.titulo} ${noticia.resumen}`).includes(busqueda);
      return coincideCategoria && coincideBusqueda;
    });
  });

  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtradas().length / POR_PAGINA)));

  /** Tarjetas de la página visible. Si se borra la última de una página, se retrocede. */
  readonly visibles = computed(() => {
    const pagina = Math.min(this.pagina(), this.totalPaginas());
    const inicio = (pagina - 1) * POR_PAGINA;
    return this.filtradas().slice(inicio, inicio + POR_PAGINA);
  });

  readonly paginaVisible = computed(() => Math.min(this.pagina(), this.totalPaginas()));

  irAPagina(numero: number): void {
    this.pagina.set(numero);
    document.getElementById('titulo-listado')?.scrollIntoView({ behavior: 'smooth' });
  }

  eliminar(noticia: Noticia): void {
    if (confirm(`¿Eliminar la noticia «${noticia.titulo}»?`)) {
      this.servicio.eliminar(noticia.id);
    }
  }

  /** Tras publicar se quitan los filtros para que la noticia nueva quede de primera. */
  alPublicar(): void {
    this.router.navigate(['/noticias'], { replaceUrl: true });
  }
}
