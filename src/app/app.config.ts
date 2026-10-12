import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localeEsCo from '@angular/common/locales/es-CO';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

// Fechas y números en español de Colombia (pipe date: "12 de octubre de 2026").
registerLocaleData(localeEsCo);

/** Configuración global: router, cliente HTTP e idioma. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Los parámetros de la ruta (:id) y de la URL (?q=, ?categoria=) llegan como inputs.
      withComponentInputBinding(),
      // Al cambiar de página se vuelve arriba; los enlaces con #fragmento hacen scroll.
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })
    ),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ]
};
