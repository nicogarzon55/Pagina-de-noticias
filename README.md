# Poli Noticias

Periódico digital hecho en **Angular 21**: explorar noticias de educación, tecnología,
turismo y comercio, ver su detalle, guardarlas en favoritos, publicar o eliminar noticias y
escribir al equipo por el formulario de contacto.

Proyecto del módulo **Desarrollo de Front-end** · Politécnico Grancolombiano.
Equipo: David Cubides, Bairon Amaya y Johan Garzón.

| Entrega | Contenido | Dónde está |
| --- | --- | --- |
| 1 | Maquetación en Figma | Documento de la entrega 1 |
| 2 | Prototipo funcional en HTML, CSS y JavaScript | [`prototipo-js/`](prototipo-js/) |
| 3 | Aplicación completa en Angular, desplegada | Raíz del repositorio (`src/`) |

## Cómo ejecutarlo

Requisitos: **Node.js 20.19 o superior** (recomendado 22 LTS) y npm.

```bash
npm install      # instala las dependencias (solo la primera vez)
npm start        # servidor de desarrollo en http://localhost:4200
npm run build    # versión de producción en dist/poli-noticias/browser
```

## Despliegue en Vercel

El archivo `vercel.json` ya trae la configuración, así que basta con importar el repositorio
en Vercel y pulsar *Deploy*:

- Build command: `npm run build`
- Output directory: `dist/poli-noticias/browser`
- Una regla *rewrite* envía todas las rutas a `index.html`, para que recargar la página en
  `/noticias/3` o `/favoritos` no dé error 404 (las rutas las resuelve Angular en el navegador).

## Estructura

```
public/
  data/noticias.json        Catálogo de noticias (10 registros)
  img/noticias/             Fotografías de las noticias
  favicon.svg
src/
  index.html                Página única que carga la aplicación
  main.ts                   Punto de entrada: arranca el componente raíz
  styles.css                Variables de diseño y clases compartidas
  app/
    app.ts                  Componente raíz: header + <router-outlet> + footer
    app.config.ts           Router, HttpClient e idioma es-CO
    app.routes.ts           Rutas (cada página se carga de forma diferida)
    models/noticia.ts       Interfaces Noticia y NuevaNoticia, lista de categorías
    services/
      storage.service.ts    Lectura/escritura segura en localStorage
      noticias.service.ts   Carga del JSON y mini CRUD (crear, eliminar, restaurar)
      favoritos.service.ts  Guardar/quitar favoritos
    validators/validaciones.ts  Validadores personalizados de los formularios
    pipes/capitalizar.pipe.ts   Pipe para poner en mayúscula la primera letra
    utils/texto.ts          normalizar(): compara sin tildes ni mayúsculas
    shared/                 Componentes reutilizables
      header/               Logo, fecha, menú, buscador y categorías
      footer/               Pie de página
      noticia-card/         Tarjeta de noticia (inicio, listado y favoritos)
      imagen-noticia/       Imagen con recuadro de respaldo si no carga
      boton-favorito/       Corazón de la tarjeta
      paginacion/           Botones de paginación
    pages/                  Una carpeta por vista
      inicio/               Bienvenida, noticia de apertura y destacadas
      noticias/             Listado con filtros, búsqueda y paginación
        form-noticia/       Formulario para publicar noticias
      detalle/              Detalle de una noticia y relacionadas
      favoritos/            Noticias guardadas
      contacto/             Formulario de contacto
      no-encontrada/        Página 404
prototipo-js/               Versión de la entrega 2 (HTML, CSS y JS sin framework)
vercel.json                 Configuración del despliegue
```

## Rutas

| Ruta | Vista |
| --- | --- |
| `/` | Inicio |
| `/noticias` | Listado. Acepta `?q=texto` y `?categoria=turismo` |
| `/noticias/:id` | Detalle de una noticia |
| `/favoritos` | Mis favoritos |
| `/contacto` | Contacto. Acepta `?noticia=Título` para precargar el mensaje |
| cualquier otra | Página no encontrada |

## Conceptos de Angular aplicados

- **Componentes standalone**: cada vista y cada pieza reutilizable es un componente con su
  plantilla y sus estilos encapsulados.
- **Data binding**:
  - Interpolación: `{{ noticia.titulo }}`
  - Property binding: `[noticia]="destacada"`, `[class.activo]="activo()"`, `[attr.aria-pressed]`
  - Event binding: `(click)="alternarFavorito(noticia.id)"`, `(ngSubmit)="enviar()"`
  - Two-way binding: `[(ngModel)]="busqueda"` en el buscador del encabezado
- **Comunicación entre componentes**: `input()` para pasar datos al hijo (la tarjeta recibe la
  noticia) y `output()` para avisar al padre (la tarjeta emite `eliminar`, la paginación emite
  `cambiar`, el formulario emite `publicada`).
- **Servicios e inyección de dependencias**: `NoticiasService`, `FavoritosService` y
  `StorageService` se comparten entre todas las vistas con `inject()`.
- **Señales (signals)**: el estado (noticias, favoritos, página actual) vive en señales y
  `computed()`, por eso al guardar un favorito o publicar una noticia todas las vistas se
  actualizan solas.
- **Router**: rutas con parámetros (`/noticias/:id`), parámetros de consulta como inputs
  (`withComponentInputBinding`), carga diferida y títulos por ruta.
- **Formularios reactivos** con validadores propios (obligatorio sin espacios, longitudes,
  correo y URL), mensajes de error accesibles y foco en el primer campo inválido.
- **HttpClient** para leer `data/noticias.json`, con estados de carga, error y botón *Reintentar*.
- **Control de flujo** en las plantillas: `@if`, `@for`, `@switch`, `@empty`.
- **Pipes**: `date` en español (`es-CO`) y el pipe propio `capitalizar`.

## Funcionalidades

- **Renderizado dinámico:** tarjetas, detalle y relacionadas se generan desde el JSON.
- **Favoritos:** el corazón de cada tarjeta y el botón del detalle guardan el id en `localStorage`.
- **Mini CRUD:** en *Noticias → Publicar una noticia* se crean noticias (validadas) y cada tarjeta
  del listado tiene *Eliminar*. Como el JSON es de solo lectura, los cambios se guardan en
  `localStorage`; *Restaurar noticias originales* los deshace.
- **Búsqueda y filtros:** por texto (sin importar tildes) y por categoría, reflejados en la URL.
  Un segundo clic sobre la categoría activa la quita.
- **Accesibilidad:** etiquetas semánticas, `aria-current`, `aria-pressed`, `aria-invalid`,
  enlace *Saltar al contenido*, foco visible y respeto por `prefers-reduced-motion`.
- **Diseño adaptable:** tres columnas en escritorio, dos en tabletas y una en celulares.

## Datos de una noticia

```json
{
  "id": 1,
  "titulo": "…",
  "categoria": "educación | tecnológica | turismo | comercio",
  "resumen": "Descripción breve para la tarjeta",
  "cuerpo": ["Párrafo 1", "Párrafo 2"],
  "autor": "…",
  "fecha": "AAAA-MM-DD",
  "lectura": 5,
  "imagen": "img/noticias/1-tablets.jpg",
  "pieFoto": "…",
  "destacada": true
}
```

Si una imagen no carga o la noticia no tiene foto, se muestra el recuadro rayado de la maqueta.
