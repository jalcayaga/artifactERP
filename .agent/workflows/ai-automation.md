---
description: Guía de uso de los estándares de IA y MCPs en Artifact ERP
---

# Flujo de Trabajo: Automatización con IA (AI Standards)

Este flujo de trabajo describe cómo utilizar los estándares de IA implementados para maximizar la eficiencia y consistencia en el desarrollo de Artifact ERP.

## 1. Contexto Inicial
Cada vez que inicies una nueva tarea, la IA leerá automáticamente los archivos fundamentales:
- `agents.md`: Proporciona la visión global del rascacielos.
- `llms.txt`: Ubicado en cada app, describe el propósito específico de ese módulo.

## 2. Uso de Skills Personalizados
Cuando trabajes en áreas específicas, invoca o consulta los skills en `.agent/skills/`:

### erp_forms
Úsalo cuando necesites:
- Crear un nuevo formulario de negocio.
- Validar layouts de alta densidad.
- Implementar validaciones con Zod y React Hook Form.

### chilean_compliance
Úsalo cuando trabajes con:
- RUTs (validación y formateo).
- Cálculos de IVA (19%).
- Tipos de documentos tributarios (Boletas 39, Facturas 33, etc.).
- Moneda CLP.

### multi_tenant_patterns
Úsalo para asegurar el aislamiento de datos:
- Verificar que las queries incluyan el filtro de tenant.
- Asegurar que los headers `x-tenant-slug` se envíen en las peticiones API.
- Mantener la lógica de subdominios consistente.

### artifact_ui_patterns
Úsalo para mantener la estética premium:
- Aplicar tokens de color correctos (`slate-950`).
- Implementar efectos de glassmorphism (`backdrop-blur-md`, `border-white/10`).
- Usar iconos y espaciado estandarizados.

## 3. Integración con MCPs
Aprovecha las capacidades externas a través de los servidores MCP:

### Supabase MCP
- Ejecuta queries SQL directamente para validar datos.
- Inspecciona esquemas de tablas sin abrir el dashboard de Supabase.
- Verifica políticas RLS (Row Level Security).

### GitHub MCP
- Crea issues automáticamente si encuentras un bug.
- Genera resúmenes de commits.
- Consulta el estado de builds en GitHub Actions.

## 4. Verificación y Calidad
Al finalizar una tarea, valida contra el checklist del skill correspondiente:
- ¿Cumple con el diseño premium? (`artifact_ui_patterns`)
- ¿Valida correctamente el RUT? (`chilean_compliance`)
- ¿Respeta el aislamiento de tenant? (`multi_tenant_patterns`)

---

// turbo
## Paso de Verificación Rápida
Ejecuta este comando para ver el estado de los archivos de estándares:
```bash
ls -la agents.md apps/*/public/llms.txt .agent/skills/*/SKILL.md
```
