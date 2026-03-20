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
  - Pre-op: 5 horarios (09:15, 12:00, 14:30, 17:30, 20:30)
  - Post-op Fase 1 y 2: 7 horarios (09:00, 11:00, 13:00, 15:00, 17:00, 19:00, 21:00)

## Estado técnico actual

- App HTML single-file con React 18 via CDN + Babel standalone
- PWA completa: manifest.json con iconos PNG + Service Worker (`sw.js`)
- Service Worker v2: cache offline (assets + Google Fonts), network-first para HTML
- Datos persisten en localStorage (confiable en PWA instalada, se pierde solo si se borra caché o desinstala)
- Notificaciones: Notification API (solo con app activa) + exportación .ics para calendario nativo
- Dark mode via CSS media query
- Diseño mobile-first, max-width 520px
- Deploy: Netlify via CLI (`npx netlify deploy --prod --dir=public`)
- URL producción: https://gabi-bariatrica.netlify.app
- Site ID Netlify: `61f3eeef-b340-459f-9920-f2ae478fe433`

## Archivos principales

- `public/index.html` — App completa (React + CSS + lógica), lista para deploy
- `public/sw.js` — Service Worker (cache offline, manejo de notificaciones)
- `public/manifest.json` — PWA manifest con iconos PNG
- `public/icon-192.png` / `public/icon-512.png` — Iconos PWA (fondo morado, corazón blanco)
- `src/app.jsx` — Código fuente React extraído (referencia para migración a Vite)
- `docs/` — Documentación nutricional en Markdown (fuente de verdad para datos médicos)

## Funcionalidades

- **📋 Hoy**: Timeline intercalado de comidas + hidratación, con opciones detalladas (A/B) para pre-op, checkboxes, progreso, notas
- **📅 Calendario**: Vista de 13 días con porcentaje de avance por día
- **🍲 Recetas**: 4 recetas con contexto de fase y comida específica (ej: "Almuerzo 13:00 y Cena 19:00")
- **🛒 Compras**: Lista de supermercado con tags pre-op/post-op
- **🔔 Alertas**: Sincronización con calendario (.ics) + recordatorios in-app

### Sistema de alertas (.ics)

- Genera archivos `.ics` importables al calendario nativo del teléfono
- Dos modos: "fase actual" (solo días de la fase en curso) o "todo el proceso" (13 días)
- Cada evento incluye nombre de comida, fase, y alarma (5 min antes para comidas, instantánea para hidratación)
- UIDs consistentes por día/slot para que re-importar actualice en vez de duplicar
- Las alertas del calendario suenan con pantalla bloqueada (a diferencia de las notificaciones web)

## Convenciones de diseño

- **Fuentes**: Outfit (UI) + JetBrains Mono (horarios/datos)
- **Colores por fase**: Pre-op=#7F77DD, Cirugía=#E24B4A, Post1=#1D9E75, Post2=#378ADD, Done=#639922
- **Bordes**: redondeados 10-14px, bordes sutiles 1px #EEEEE8
- **UI patterns**: cards con fondo #FAFAF8, checkboxes personalizados, progress bars
- **Hidratación en timeline**: borde punteado azul, diferenciada visualmente de comidas

## Qué NO hacer

- No cambiar las comidas, horarios ni cantidades sin instrucción del usuario
- No agregar features de consejo médico o nutricional — la app solo trackea lo indicado por la nutricionista
- No usar frameworks pesados innecesariamente — la app debe ser ligera y rápida en móvil
- No perder compatibilidad PWA (debe funcionar como app standalone en iOS/Android)
- No modificar los UIDs de los eventos .ics (rompe la actualización sin duplicados)

## Validación

Para verificar que el JSX es válido antes de hacer deploy:
```bash
npm install --save-dev @babel/core @babel/preset-react  # solo la primera vez
node -e "const fs=require('fs'),html=fs.readFileSync('public/index.html','utf8'),m=html.match(/<script type=\"text\/babel\">([\s\S]*?)<\/script>/),b=require('@babel/core');b.transformSync(m[1],{presets:['@babel/preset-react']});console.log('JSX OK')"
```

## Migración sugerida

Si se migra a Vite + React:
```bash
npm create vite@latest . -- --template react
# Mover lógica de public/index.html a src/App.jsx
# Mantener manifest.json y sw.js en public/
# Copiar iconos PNG a public/
```
