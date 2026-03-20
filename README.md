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

- **📋 Hoy**: Checklist de comidas con horarios, progreso, hidratación y notas diarias
- **📅 Calendario**: Vista de los 13 días con porcentaje de avance por día
- **🍲 Recetas**: 4 recetas desplegables (papillas, consomé, compota)
- **🛒 Compras**: Lista de supermercado interactiva con tags pre-op/post-op
- **🔔 Alertas**: Recordatorios con notificaciones del navegador

## Stack técnico actual

- **HTML/CSS/JS** con React 18 (CDN, Babel standalone)
- **PWA** con manifest.json para instalación en pantalla de inicio
- **localStorage** para persistencia de datos
- **Notificaciones del navegador** para recordatorios
- **Dark mode** automático

## Hosting

- **Netlify** — sitio creado: `gabi-bariatrica.netlify.app`
- Site ID: `61f3eeef-b340-459f-9920-f2ae478fe433`
- Deploy: arrastrar carpeta `public/` en [app.netlify.com/drop](https://app.netlify.com/drop) o usar `netlify deploy --dir=public --prod`

## Estructura del repositorio

```
gabi-repo/
├── README.md                    # Este archivo
├── CLAUDE.md                    # Instrucciones para Claude Code
├── public/                      # Archivos para deploy (Netlify)
│   ├── index.html               # App completa (PWA)
│   └── manifest.json            # PWA manifest
├── docs/                        # Documentación nutricional
│   ├── 01_pase_nutricional.md   # Datos clínicos de Gabriela
│   ├── 02_dieta_preoperatoria.md # Dieta pre-op detallada
│   ├── 03_regimen_postoperatorio.md # Régimen líquido 7 días
│   └── 04_recetas.md            # Recetas para papillas y consomé
├── src/                         # Código fuente (para migración futura)
│   └── app.jsx                  # Componente React principal
├── netlify.toml                 # Configuración Netlify
└── package.json                 # Metadata del proyecto
```

## Próximos pasos sugeridos

1. **Migrar a Vite + React** — Pasar del build inline (Babel CDN) a un proyecto Vite con hot reload
2. **Service Worker** — Para notificaciones offline y push notifications reales
3. **Registro de peso** — Tracking de peso diario con gráfico de progreso
4. **Contador de líquidos** — Registro preciso de cc consumidos por toma
5. **Export de datos** — Generar resumen PDF para la nutricionista
6. **Fase 3+ alimentaria** — Agregar las etapas siguientes post régimen líquido cuando la nutricionista las indique

## Licencia

Proyecto personal, no público.
