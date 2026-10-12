import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { CATEGORIAS, Categoria } from '../../models/noticia';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import { normalizar } from '../../utils/texto';

/** Pausa (ms) antes de saltar a resultados cuando se escribe fuera del listado. */
const ESPERA_BUSQUEDA = 400;

/**
 * Encabezado común: logotipo, fecha de la edición, menú, buscador y categorías.
 *
 * Como vive fuera del <router-outlet>, no se destruye al cambiar de página: el
 * buscador conserva el foco y lo escrito mientras se navega al listado.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FormsModule, DatePipe, CapitalizarPipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private readonly router = inject(Router);

  readonly categorias = CATEGORIAS;
  readonly hoy = new Date();

  /** Texto del buscador, enlazado en ambos sentidos con [(ngModel)]. */
  readonly busqueda = signal('');

  /** URL actual como señal, para saber en qué página y con qué filtros estamos. */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );
  private readonly arbolUrl = computed(() => this.router.parseUrl(this.url()));
  private readonly enListado = computed(
    () => this.arbolUrl().root.children['primary']?.toString() === 'noticias'
  );
  readonly categoriaActiva = computed(() => this.arbolUrl().queryParams['categoria'] ?? '');

  private espera?: ReturnType<typeof setTimeout>;

  constructor() {
    // Mantiene el buscador sincronizado con ?q= del listado y lo limpia en las demás páginas.
    effect(() => {
      const q = this.enListado() ? (this.arbolUrl().queryParams['q'] ?? '') : '';
      // untracked: el efecto solo debe reaccionar a la URL, no a lo que se escribe.
      if (untracked(this.busqueda).trim() !== q) this.busqueda.set(q);
    });
  }

  /** ¿La categoría del enlace es la que se está filtrando? */
  esCategoriaActiva(categoria: Categoria): boolean {
    return normalizar(categoria) === normalizar(this.categoriaActiva());
  }

  /** Un clic sobre la categoría activa la desactiva y vuelve a mostrar todas. */
  parametrosCategoria(categoria: Categoria) {
    return {
      categoria: this.esCategoriaActiva(categoria) ? null : categoria,
      q: this.enListado() ? this.busqueda().trim() || null : null
    };
  }

  /** En el listado filtra al instante; en otras páginas espera a que se deje de escribir. */
  alEscribir(): void {
    clearTimeout(this.espera);
    if (this.enListado()) {
      this.irAResultados();
    } else if (this.busqueda().trim()) {
      this.espera = setTimeout(() => this.irAResultados(), ESPERA_BUSQUEDA);
    }
  }

  alEnviar(): void {
    clearTimeout(this.espera);
    this.irAResultados();
  }

  private irAResultados(): void {
    const termino = this.busqueda().trim();
    this.router.navigate(['/noticias'], {
      queryParams: { q: termino || null },
      // En el listado se conserva la categoría y no se llena el historial con cada letra.
      queryParamsHandling: this.enListado() ? 'merge' : '',
      replaceUrl: this.enListado()
    });
  }
}
