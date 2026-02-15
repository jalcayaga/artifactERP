---
description: Guía de flujo de Git para el proyecto Artifact ERP
---

// turbo-all
Para asegurar un historial de cambios limpio y evitar acumulaciones innecesarias, seguiremos este flujo:

1. **Estado Actual**: Antes de empezar cualquier tarea, verificar el estado de git.
   ```bash
   git status
   ```

2. **Commits Atómicos**: Implementar commits pequeños y frecuentes al finalizar cada tarea de `task.md`.
   ```bash
   git add .
   git commit -m "tipo: descripción breve"
   ```

3. **Convenciones**:
   - `feat`: Nueva funcionalidad
   - `fix`: Corrección de errores
   - `refactor`: Mejora de código
   - `style`: Cambios visuales/estilo
   - `docs`: Documentación

4. **Sincronización**: Al final de la sesión, asegurar que todo esté commiteado.
