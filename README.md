# Marcos García — Portfolio

Portfolio estático para GitHub Pages (`marcosgarciaguerra.github.io`). Sin servidor ni base de datos.

La versión **full stack** (Go + API + admin) está en la rama [`fullstack`](https://github.com/marcosgarciaguerra/marcosgarciaguerra.github.io/tree/fullstack).

## Estructura

```
.
├── index.html       # Página principal
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── favicon.svg
│   └── cv.pdf
├── robots.txt
├── sitemap.xml
└── README.md
```

## Vista previa local

Abre `index.html` en el navegador, o:

```bash
npx --yes serve .
```

## Personalizar

| Qué | Dónde |
| --- | --- |
| Proyectos | Tarjetas en `index.html` (`#projects`) |
| Email | `index.html` y `CONTACT_EMAIL` en `js/main.js` |
| Teléfono / bio | `#contact` y `#about` en `index.html` |
| CV | `assets/cv.pdf` |
| Foto | URL del avatar en `index.html` |

## Publicar

Este repo es un *user site*. Con **Settings → Pages → Deploy from branch → `main` / root (`/`)**, la web queda en https://marcosgarciaguerra.github.io/

## Notas

- El formulario abre el cliente de correo (`mailto:`).
- Tailwind, fuentes e iconos van por CDN.
