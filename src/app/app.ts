import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';
import { Header } from './shared/header/header';

/**
 * Componente raíz: estructura común a todas las vistas.
 * El encabezado y el pie son fijos; el <router-outlet> muestra la página de la ruta actual.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <a class="saltar" href="#contenido" (click)="saltarAlContenido($event)">Saltar al contenido</a>
    <app-header />
    <main class="contenedor" id="contenido" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `
})
export class App {
  /** Con <base href="/"> un href="#..." llevaría al inicio, por eso el foco se mueve a mano. */
  saltarAlContenido(evento: Event): void {
    evento.preventDefault();
    document.getElementById('contenido')?.focus();
  }
}
