# Poli Noticias

Maqueta visual (mockup) de un periódico digital, construida a partir de la
dirección de color **1b — "Archivo"** del sistema de diseño *Broadsheet*.

> **Estado: solo visual.** No hay JavaScript, ni backend, ni navegación real.
> Los enlaces de secciones son marcadores y las imágenes son placeholders
> rayados. La idea es ver la dirección de color y la retícula antes de
> construir la funcionalidad.

## Dirección 1b — Archivo

Papel prensa cálido, verde y bermellón. Tono de diario de registro.

| Rol | Token | Color |
|---|---|---|
| Fondo (papel) | `--color-bg` | `#f4efe3` |
| Texto (tinta) | `--color-text` | `#231f1a` |
| Acento | `--color-accent` | `#146b5b` |
| Acento 2 | `--color-accent-2` | `#b03a22` |

Tipografía: **Source Serif 4** (títulos en peso 600, cuerpo en 400, citas en
cursiva), cargada desde Google Fonts.

## Archivos

```
Pagina-de-noticias/
├── index.html      Portada
├── articulo.html   Página de artículo
├── css/
│   └── styles.css  Tokens del sistema + estilos de las dos páginas
└── README.md
```

## Cómo verlo

Abre `index.html` en el navegador. No hace falta instalar nada ni levantar un
servidor.

Si usas VS Code, la extensión **Live Server** da recarga automática al editar:
clic derecho sobre `index.html` → *Open with Live Server*.

## Siguientes pasos

- Reemplazar los placeholders rayados por fotografías reales.
- Convertir la barra de secciones en navegación real.
- Extraer las tarjetas de noticia a plantillas cuando llegue el contenido
  dinámico.
