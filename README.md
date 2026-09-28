# Poli Noticias · Entrega 2 (HTML + CSS)

Estructura:
- index.html, noticias.html, detalle.html, favoritos.html, contacto.html
- css/styles.css (único archivo de estilos, variables en :root)
- js/main.js  -> lo desarrolla el resto del equipo
- data/noticias.json -> lo desarrolla el resto del equipo

Ganchos para JS:
- #destacadas-grid, #noticias-grid, #favoritos-grid: contenedores de tarjetas
- .card[data-id][data-categoria] + .fav (aria-pressed) + enlace detalle.html?id=N
- #filtros .chip[data-categoria], #paginacion, #sin-resultados
- detalle: #d-categoria, #d-titulo, #d-meta, #d-cuerpo, #btn-favorito, #relacionadas
- favoritos: #contador-favoritos, #favoritos-vacio
- contacto: #form-contacto, campos nombre/correo/asunto/mensaje;
  para errores agregar la clase .invalido al .campo; para éxito la clase .visible a #mensaje-exito
- #fecha-edicion: fecha del encabezado
