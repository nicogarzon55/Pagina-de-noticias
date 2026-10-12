import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

const CLAVE_FAVORITOS = 'poli-noticias:favoritos';

/**
 * Gestión de favoritos: una lista de ids de noticias guardada en localStorage.
 *
 * La lista vive en una señal (signal), así que cualquier componente que la lea
 * (el corazón de una tarjeta, el botón del detalle, la página de favoritos)
 * se actualiza solo cuando cambia.
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly storage = inject(StorageService);
  private readonly _ids = signal<number[]>(this.storage.leer<number[]>(CLAVE_FAVORITOS, []));

  /** Ids guardados, en el orden en que el usuario los agregó (solo lectura). */
  readonly ids = this._ids.asReadonly();
  readonly total = computed(() => this._ids().length);

  esFavorito(id: number): boolean {
    return this._ids().includes(id);
  }

  /** Agrega o quita la noticia. Devuelve true si quedó como favorita. */
  alternar(id: number): boolean {
    const yaEsta = this.esFavorito(id);
    this.actualizar(yaEsta ? this._ids().filter((f) => f !== id) : [...this._ids(), id]);
    return !yaEsta;
  }

  quitar(id: number): void {
    this.actualizar(this._ids().filter((f) => f !== id));
  }

  private actualizar(ids: number[]): void {
    this._ids.set(ids);
    this.storage.guardar(CLAVE_FAVORITOS, ids);
  }
}
