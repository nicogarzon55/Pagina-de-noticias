import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Página 404: cualquier ruta que no exista. */
@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink],
  template: `
    <section class="vacio">
      <h1 class="pagina-titulo">Página no encontrada</h1>
      <p>La dirección que escribiste no existe en Poli Noticias.</p>
      <a class="btn btn--acento" routerLink="/">Volver al inicio</a>
    </section>
  `
})
export class NoEncontrada {}
