import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pie de página común a todas las vistas. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="contenedor footer__fila">
        <div>
          <strong>Poli Noticias</strong><br />
          © {{ anio }} Politécnico Grancolombiano · Proyecto académico Front-end
        </div>
        <div>
          <nav aria-label="Pie de página">
            <a routerLink="/">Inicio</a>
            <a routerLink="/noticias">Noticias</a>
            <a routerLink="/favoritos">Favoritos</a>
            <a routerLink="/contacto">Contacto</a>
          </nav>
          <div class="puntos" aria-hidden="true"><i class="verde"></i><i class="rojo"></i><i class="tinta"></i></div>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .footer{border-top:2px solid var(--tinta);margin-top:2rem;padding:1.4rem 0 2rem;font-size:.8rem;color:var(--tinta-suave)}
    .footer__fila{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
    strong{color:var(--tinta)}
    nav{display:flex;gap:1rem}
    nav a:hover{color:var(--verde)}
    .puntos{display:flex;gap:.5rem;margin-top:.6rem;justify-content:flex-end}
    .puntos i{width:12px;height:12px;border-radius:50%;display:block}
    .verde{background:var(--verde)} .rojo{background:var(--rojo)} .tinta{background:var(--tinta)}
  `
})
export class Footer {
  readonly anio = new Date().getFullYear();
}
