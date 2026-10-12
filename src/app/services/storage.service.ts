import { Injectable } from '@angular/core';

/**
 * Lectura y escritura segura en localStorage.
 *
 * Todas las operaciones van dentro de try/catch: si el navegador bloquea el
 * almacenamiento (modo privado, cuota llena) la aplicación sigue funcionando,
 * solo que sin conservar los cambios al recargar.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /** Devuelve el valor guardado en `clave` o `valorPorDefecto` si no existe o falla. */
  leer<T>(clave: string, valorPorDefecto: T): T {
    try {
      const texto = localStorage.getItem(clave);
      return texto === null ? valorPorDefecto : (JSON.parse(texto) as T);
    } catch {
      return valorPorDefecto;
    }
  }

  guardar<T>(clave: string, valor: T): void {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Almacenamiento no disponible: se ignora.
    }
  }

  borrar(clave: string): void {
    try {
      localStorage.removeItem(clave);
    } catch {
      // Almacenamiento no disponible: se ignora.
    }
  }
}
