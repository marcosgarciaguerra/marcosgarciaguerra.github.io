# Marcos García — Portfolio

Portfolio estático para GitHub Pages: https://marcosgarciaguerra.github.io/

La versión **full stack** (Go + API + admin) está en la rama [`fullstack`](https://github.com/marcosgarciaguerra/marcosgarciaguerra.github.io/tree/fullstack).

## Estructura

```
.
├── index.html
├── css/styles.css
├── js/main.js
├── assets/          # favicon, avatar, OG image, CV
├── assets/projects/     # capturas del carrusel por proyecto
├── projects/pages/
│   ├── modelo.html      # plantilla para copiar
│   ├── openotas.html
│   ├── once-chess.html
│   └── mesaplay.html
├── robots.txt
├── sitemap.xml
└── README.md
```

## Nueva ficha de proyecto

1. Copia [`projects/pages/modelo.html`](projects/pages/modelo.html) → `projects/pages/mi-proyecto.html`
2. Sustituye los marcadores `[[...]]`
3. Añade capturas en `assets/projects/mi-proyecto/` (`1.jpg`, `2.jpg`, `3.jpg`…) y enlázalas en el carrusel
4. Enlaza la tarjeta en `index.html` y la URL en `sitemap.xml`

## Vista previa local

```bash
npx --yes serve .
```

## Personalizar

| Qué | Dónde |
| --- | --- |
| Proyectos | `#projects` en `index.html` |
| Email | `index.html` + `CONTACT_EMAIL` en `js/main.js` |
| Bio / stack | `#about` en `index.html` |
| CV | `assets/CV MarcosGarciaGuerra 2026-27.pdf` |
| Avatar / OG | `assets/avatar.png`, `assets/og-image.jpg` |

## Accesibilidad y SEO (resumen)

- Nav móvil, skip link, focus visible, `aria-*` en formulario
- Contenido visible sin JS (clase `no-js`)
- Meta OG/Twitter con imagen local, JSON-LD Person/WebSite/ProfilePage
- CSS propio (sin Tailwind CDN), fuentes con `display=swap`

## Publicar

**Settings → Pages → Deploy from branch → `main` / root (`/`)**
