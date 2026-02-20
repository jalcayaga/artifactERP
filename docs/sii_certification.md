# Proceso de Certificación SII para Artifact ERP 🧾✅

Para que **Artifact ERP** pueda emitir Documentos Tributarios Electrónicos (DTE) válidos en producción, debe pasar por un proceso de **Certificación de Software** ante el Servicio de Impuestos Internos (SII).

Este proceso valida que nuestro software cumple con los formatos XML, firmas digitales y protocolos de comunicación exigidos.

## 1. Etapa de Certificación (Ambiente de Pruebas: Maullín) 🧪

Actualmente, el sistema está configurado para operar en este ambiente.

### Pasos a seguir:
1.  **Postulación**: En el sitio del SII (maullin.sii.cl), se debe inscribir la empresa para "Certificación de Software de Mercado" o "Sistema Propio".
2.  **Obtención de Set de Pruebas**: El SII entregará un "Set de Pruebas" específico que contiene casos de uso que debemos replicar.
    *   Ejemplo: "Emitir una Factura Afecta por $1000 al RUT X".
    *   Ejemplo: "Emitir una Nota de Crédito que anula la factura anterior".
3.  **Ejecución de Pruebas**: Usando Artifact ERP, generamos y enviamos estos DTEs al ambiente de certificación.
    *   **Fase 18 (Tests)**: Nuestros tests de integración están diseñados para asegurar que generamos estos XMLs correctamente antes de enviarlos.
4.  **Validación**: El SII revisa automáticamente los envíos. Si están correctos, se aprueba el set.

## 2. Intercambio de Información 📧

Una vez aprobados los DTEs básicos, se debe probar el intercambio de información con otros contribuyentes.
*   El SII nos pedirá enviar un correo con el DTE (XML + PDF) a una casilla de prueba.
*   Debemos demostrar que podemos recibir y procesar los "Acuses de Recibo" (ACK).

## 3. Declaración de Cumplimiento ✅

Al finalizar las pruebas técnicas:
*   Se firma una **Declaración Jurada** ante el SII indicando que el software cumple con la normativa.
*   El SII autoriza a la empresa a **pasar a Producción**.

## 4. Pase a Producción 🚀

*   Se cambian las URLs de la API del SII en el backend (`sii.service.ts`) de Maullín a Producción (`palena.sii.cl` o similar).
*   Se genera y envía el primer Folio real.

---

**Nota**: Artifact ERP ya implementa la generación de XML, Firma Digital, Envío (Semilla/Token) y consulta de estado. La Fase 18 (Tests) y una eventual Fase 19 (Ejecución de Set de Pruebas) cerrarán este ciclo.
