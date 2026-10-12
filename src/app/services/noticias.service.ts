import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { EstadoCarga, Noticia, NuevaNoticia } from '../models/noticia';
import { FavoritosService } from './favoritos.service';
import { StorageService } from './storage.service';

const URL_JSON = 'data/noticias.json';
const CLAVE_CREADAS = 'poli-noticias:creadas';
const CLAVE_ELIMINADAS = 'poli-noticias:eliminadas';
const PALABRAS_POR_MINUTO = 200;

/**
 * Fuente de datos de las noticias (mini CRUD).
 *
 * - Las noticias base se leen una sola vez de public/data/noticias.json con HttpClient.
 * - Como el JSON es de solo lectura, las noticias que crea el usuario y los ids
 *   que elimina se guardan en localStorage.
 * - `noticias` es una señal calculada que combina las tres fuentes; todas las
 *   vistas la leen, por lo que se actualizan solas al crear o eliminar.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly favoritos = inject(FavoritosService);

  private readonly base = signal<Noticia[]>([]);
  private readonly creadas = signal<Noticia[]>(this.storage.leer<Noticia[]>(CLAVE_CREADAS, []));
  private readonly eliminadas = signal<number[]>(this.storage.leer<number[]>(CLAVE_ELIMINADAS, []));
  private readonly _estado = signal<EstadoCarga>('cargando');

  /** 'cargando' | 'listo' | 'error': las vistas lo usan para mostrar avisos. */
  readonly estado = this._estado.asReadonly();

  /** Noticias visibles, de la más reciente a la más antigua. */
  readonly noticias = computed(() => {
    const eliminadas = this.eliminadas();
    return [...this.creadas(), ...this.base()]
      .filter((noticia) => !eliminadas.includes(noticia.id))
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  });

  constructor() {
    this.cargar();
  }

  /** Descarga el catálogo. Se puede volver a llamar desde el botón "Reintentar". */
  cargar(): void {
    this._estado.set('cargando');
    this.http.get<Noticia[]>(URL_JSON).subscribe({
      next: (datos) => {
        this.base.set(datos);
        this._estado.set('listo');
      },
      error: (error) => {
        console.error('No se pudo leer el catálogo de noticias', error);
        this._estado.set('error');
      }
    });
  }

  /** Busca una noticia visible por id; devuelve null si no existe o fue eliminada. */
  porId(id: number): Noticia | null {
    return this.noticias().find((noticia) => noticia.id === id) ?? null;
  }

  /** Crea una noticia a partir de los datos del formulario y la guarda. */
  crear(datos: NuevaNoticia): Noticia {
    const idMaximo = Math.max(0, ...this.base().map((n) => n.id), ...this.creadas().map((n) => n.id));
    const palabras = datos.cuerpo.trim().split(/\s+/).length;

    const noticia: Noticia = {
      id: idMaximo + 1,
      titulo: datos.titulo.trim(),
      categoria: datos.categoria,
      resumen: datos.resumen.trim(),
      cuerpo: datos.cuerpo.split(/\n+/).map((p) => p.trim()).filter(Boolean),
      autor: datos.autor.trim(),
      fecha: fechaDeHoy(),
      lectura: Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO)),
      imagen: datos.imagen.trim(),
      pieFoto: '',
      destacada: false
    };

    this.guardarCreadas([noticia, ...this.creadas()]);
    return noticia;
  }

  /** Si la noticia la creó el usuario se borra; si viene del JSON se oculta. */
  eliminar(id: number): void {
    if (this.creadas().some((n) => n.id === id)) {
      this.guardarCreadas(this.creadas().filter((n) => n.id !== id));
    } else {
      const eliminadas = [...this.eliminadas(), id];
      this.eliminadas.set(eliminadas);
      this.storage.guardar(CLAVE_ELIMINADAS, eliminadas);
    }
    this.favoritos.quitar(id);
  }

  /** Vuelve al estado original del JSON. */
  restaurar(): void {
    this.creadas.set([]);
    this.eliminadas.set([]);
    this.storage.borrar(CLAVE_CREADAS);
    this.storage.borrar(CLAVE_ELIMINADAS);
  }

  private guardarCreadas(creadas: Noticia[]): void {
    this.creadas.set(creadas);
    this.storage.guardar(CLAVE_CREADAS, creadas);
  }
}

/** Fecha local en formato AAAA-MM-DD (toISOString usaría la hora UTC). */
function fechaDeHoy(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}
