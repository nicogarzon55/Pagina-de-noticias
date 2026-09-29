# Poli Noticias

Aplicación web tipo periódico: explorar noticias (educación, tecnología, turismo y
comercio), ver su detalle, guardarlas en favoritos, publicar o eliminar noticias y
escribir al equipo por el formulario de contacto.

## Cómo ejecutarlo

Las noticias se cargan con `fetch` desde `data/noticias.json` y el JavaScript usa
módulos (`type="module"`), así que **hay que abrirlo con un servidor local**; con
doble clic sobre el HTML (`file://`) no carga.

- VS Code: extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.
- O desde la terminal: `python -m http.server` y abrir http://localhost:8000

## Estructura

```
index.html        Inicio: bienvenida, noticia de apertura, destacadas y llamados a la acción
noticias.html     Listado con filtros, búsqueda, paginación y panel para publicar/eliminar
detalle.html      Detalle de una noticia (detalle.html?id=N), favorito, contacto y relacionadas
favoritos.html    Noticias guardadas por el usuario
contacto.html     Formulario de contacto con validaciones
css/styles.css    Único archivo de estilos (variables en :root)
data/noticias.json  Noticias base
js/
  main.js         Punto de entrada: fecha, buscador del header y arranque de cada página
  storage.js      Lectura/escritura segura en localStorage
  datos.js        Carga del JSON y mini CRUD (crear, eliminar, restaurar)
  favoritos.js    Guardar/quitar favoritos (localStorage)
  render.js       Plantillas de tarjetas y utilidades de presentación
  validacion.js   Reglas y validación reutilizable de formularios
  paginas/        Lógica propia de cada página (inicio, noticias, detalle, favoritos, contacto)
```

Cada HTML indica su página con `<body data-pagina="...">` y `main.js` ejecuta el
módulo correspondiente.

## Funcionalidades

- **Renderizado dinámico:** todas las tarjetas, el detalle y las relacionadas se generan desde el JSON.
- **Favoritos:** el corazón de cada tarjeta y el botón del detalle guardan el id en `localStorage`.
- **Mini CRUD:** en *Noticias → Publicar una noticia* se crean noticias (validadas) y cada
  tarjeta tiene *Eliminar*. Como el JSON es de solo lectura, los cambios se guardan en
  `localStorage`; *Restaurar noticias originales* los deshace.
- **Validaciones:** campos obligatorios, correo válido, longitudes mínimas y URL de imagen;
  los errores se corrigen en vivo y se muestra un mensaje de confirmación.
- **Búsqueda y filtros:** por texto (sin importar tildes) y por categoría, reflejados en la URL.

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
  "imagen": "URL (opcional)",
  "pieFoto": "…",
  "destacada": true
}
```

Las imágenes están en `img/noticias/` (nombre: `<id>-<tema>`). Si una imagen no carga se
muestra el recuadro rayado de la maqueta.
