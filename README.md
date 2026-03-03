# Raulopoly

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Despliegue a GitHub Pages

Este proyecto ahora está configurado para desplegar automáticamente a GitHub Pages usando GitHub Actions.

1. En GitHub, ve a **Settings > Pages**.
2. En **Build and deployment**, selecciona **Source: GitHub Actions**.
3. Haz push a `main`; el workflow `.github/workflows/deploy-pages.yml` construirá `dist` y lo publicará.

Configuración relevante:
- `vite.config.js` usa `base: '/Raulopoly/'` para servir assets correctamente desde la subruta del repositorio.
- El workflow de GitHub Actions compila y despliega la carpeta `dist`.
