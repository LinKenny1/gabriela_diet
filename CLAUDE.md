# CLAUDE.md — Instrucciones para Claude Code

## Proyecto

App de seguimiento nutricional para la cirugía bariátrica de Gabriela Robles González. El usuario es su pareja y quien la acompaña en el proceso. Toda la comunicación es en español (Chile).

## Contexto médico-nutricional

La app está basada en indicaciones reales de la nutricionista Camila Sembler (Interclínica Cordillera, Santiago). Los datos nutricionales NO deben modificarse sin instrucción explícita del usuario — están alineados con las indicaciones médicas de los documentos en `docs/`.

### Reglas alimentarias clave

- **Pre-op (5 días)**: Papillas de 200-250cc con 80-100g proteína + 150g verduras. Verduras PROHIBIDAS: brócoli, coliflor, choclo, arvejas, habas.
- **Post-op Fase 1 (días 1-2)**: Solo líquidos claros. Máx 100-150cc por toma. Sin azúcar, sin gas, sin cafeína.
- **Post-op Fase 2 (días 3-7)**: Se agregan lácteos descremados sin lactosa Protein y batido proteico (½ scoop).
- **Hidratación**: Separada de comidas (15-20 min antes/después), a sorbos pequeños, mínimo 1L/día.

## Estado técnico actual

- App HTML single-file con React 18 via CDN + Babel standalone
- PWA básica (manifest.json, sin service worker aún)
- Datos persisten en localStorage
- Notificaciones via Notification API del navegador
- Dark mode via CSS media query
- Diseño mobile-first, max-width 520px
- Deploy target: Netlify (site ID: `61f3eeef-b340-459f-9920-f2ae478fe433`, nombre: `gabi-bariatrica`)

## Archivos principales

- `public/index.html` — App completa, lista para deploy
- `public/manifest.json` — PWA manifest
- `src/app.jsx` — Código fuente React extraído (referencia para migración a Vite)
- `docs/` — Toda la documentación nutricional en Markdown

## Convenciones de diseño

- **Fuentes**: Outfit (UI) + JetBrains Mono (horarios/datos)
- **Colores por fase**: Pre-op=#7F77DD, Cirugía=#E24B4A, Post1=#1D9E75, Post2=#378ADD, Done=#639922
- **Bordes**: redondeados 10-14px, bordes sutiles 1px #EEEEE8
- **UI patterns**: cards con fondo #FAFAF8, checkboxes personalizados, progress bars

## Qué NO hacer

- No cambiar las comidas, horarios ni cantidades sin instrucción del usuario
- No agregar features de consejo médico o nutricional — la app solo trackea lo indicado por la nutricionista
- No usar frameworks pesados innecesariamente — la app debe ser ligera y rápida en móvil
- No perder compatibilidad PWA (debe funcionar como app standalone en iOS/Android)

## Migración sugerida

Si se migra a Vite + React:
```bash
npm create vite@latest . -- --template react
# Mover lógica de public/index.html a src/App.jsx
# Mantener manifest.json en public/
# Agregar service worker para offline + push notifications
```
