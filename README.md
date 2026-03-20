# Gabi — Seguimiento Bariátrico 🫶

App de seguimiento nutricional para la cirugía bariátrica de **Gabriela Robles González**, desarrollada con cariño para acompañarla en cada paso del proceso.

## Contexto del proyecto

Gabriela se someterá a una cirugía bariátrica en Interclínica Cordillera (Santiago, Chile). Su nutricionista tratante es **Camila Sembler Bustos**. El proceso incluye una dieta preoperatoria de 5 días y un régimen líquido postoperatorio de 7 días, cada uno con fases y comidas específicas.

### Datos clínicos relevantes

| Campo | Valor |
|-------|-------|
| IMC | 35 kg/m² (→ 5 días preoperatorios) |
| Peso | 86.5 kg |
| Estatura | 157 cm |
| Diagnóstico | Obesidad Grado II |
| Comorbilidades | Hígado Graso, Resistencia Insulina, Dislipidemia |

## Fases del proceso

| Fase | Días | Descripción |
|------|------|-------------|
| **Preoperatorio** | -5 a -1 | Dieta de papilla rica en proteínas para reducir hígado graso |
| **Cirugía** | 0 | Seguir indicaciones del equipo quirúrgico |
| **Post-op Fase 1** | +1 a +2 | Solo líquidos claros: té, jaleas sin azúcar, consomé colado (100-150cc) |
| **Post-op Fase 2** | +3 a +7 | Se incorporan lácteos descremados sin lactosa + batido proteico |

## Funcionalidades de la app

- **📋 Hoy**: Timeline intercalado de comidas + hidratación, opciones detalladas por comida, progreso y notas diarias
- **📅 Calendario**: Vista de los 13 días con porcentaje de avance por día
- **🍲 Recetas**: 4 recetas desplegables con contexto de fase y comida (papillas, consomé, compota)
- **🛒 Compras**: Lista de supermercado interactiva con tags pre-op/post-op
- **🔔 Alertas**: Sincronización con calendario nativo (.ics) + recordatorios in-app

### Sistema de alertas

La app genera archivos `.ics` que se importan al calendario del teléfono. Cada evento incluye el nombre de la comida, la fase, y una alarma. Las alertas del calendario suenan incluso con la pantalla bloqueada, a diferencia de las notificaciones web que solo funcionan con la app activa.

## Stack técnico

- **HTML/CSS/JS** con React 18 (CDN, Babel standalone) — single-file app
- **PWA** con manifest.json, iconos PNG 192/512, Service Worker con cache offline
- **Service Worker**: cache de assets y Google Fonts, network-first para HTML (actualizaciones inmediatas)
- **localStorage** para persistencia de datos
- **Dark mode** automático via CSS media query
- **Mobile-first** max-width 520px

## Hosting

- **Netlify** — URL: https://gabi-bariatrica.netlify.app
- Site ID: `61f3eeef-b340-459f-9920-f2ae478fe433`
- Deploy: `npx netlify deploy --prod --dir=public`

## Estructura del repositorio

```
gabriela_diet/
├── README.md                       # Este archivo
├── CLAUDE.md                       # Instrucciones para Claude Code
├── public/                         # Archivos para deploy (Netlify)
│   ├── index.html                  # App completa (React + CSS + lógica)
│   ├── sw.js                       # Service Worker (cache offline + notificaciones)
│   ├── manifest.json               # PWA manifest
│   ├── icon-192.png                # Icono PWA 192x192
│   └── icon-512.png                # Icono PWA 512x512
├── docs/                           # Documentación nutricional (fuente de verdad)
│   ├── 01_pase_nutricional.md      # Datos clínicos de Gabriela
│   ├── 02_dieta_preoperatoria.md   # Dieta pre-op detallada
│   ├── 03_regimen_postoperatorio.md # Régimen líquido 7 días
│   ├── 04_recetas.md               # Recetas para papillas y consomé
│   └── originales/                 # PDFs originales de la nutricionista
├── src/                            # Código fuente (referencia para migración)
│   └── app.jsx                     # Componente React principal
├── netlify.toml                    # Configuración Netlify
└── package.json                    # Metadata del proyecto
```

## Instalación en el teléfono (Samsung Android)

1. Abrir https://gabi-bariatrica.netlify.app en **Chrome**
2. Menu (⋮) → **"Añadir a pantalla de inicio"** o **"Instalar app"**
3. Para alertas confiables: ir a Alertas → **"Descargar fase actual"** → importar al calendario
4. Configurar en el teléfono:
   - Ajustes → Apps → Calendario → Batería → **"Sin restricciones"**
   - Ajustes → Apps → Chrome → Batería → **"Sin restricciones"**

## Próximos pasos sugeridos

1. **Exportar progreso** — Generar PDF o link para compartir con la nutricionista
2. **Countdown a cirugía** — Indicador visible en pantalla principal
3. **Indicador de próxima comida** — Tiempo restante para la siguiente toma
4. **Registro de volumen** — Que Gabi registre cuántos cc tomó realmente
5. **Migrar a Vite + React** — Build real con hot reload para desarrollo
6. **Fase 3+ alimentaria** — Agregar etapas siguientes cuando la nutricionista las indique

## Licencia

Proyecto personal, no público.
