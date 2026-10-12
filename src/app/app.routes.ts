import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación. Cada página se carga de forma diferida (loadComponent),
 * así el navegador solo descarga el código de la vista que se abre.
 * `title` define el texto de la pestaña del navegador.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'Inicio · Poli Noticias',
    loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio)
  },
  {
    path: 'noticias',
    title: 'Noticias · Poli Noticias',
    loadComponent: () => import('./pages/noticias/noticias').then((m) => m.Noticias)
  },
  {
    // El título lo pone el propio componente con el de la noticia.
    path: 'noticias/:id',
    title: 'Detalle de la noticia · Poli Noticias',
    loadComponent: () => import('./pages/detalle/detalle').then((m) => m.Detalle)
  },
  {
    path: 'favoritos',
    title: 'Favoritos · Poli Noticias',
    loadComponent: () => import('./pages/favoritos/favoritos').then((m) => m.Favoritos)
  },
  {
    path: 'contacto',
    title: 'Contacto · Poli Noticias',
    loadComponent: () => import('./pages/contacto/contacto').then((m) => m.Contacto)
  },
  {
    path: '**',
    title: 'Página no encontrada · Poli Noticias',
    loadComponent: () => import('./pages/no-encontrada/no-encontrada').then((m) => m.NoEncontrada)
  }
];
