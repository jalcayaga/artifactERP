---
name: chilean_compliance
description: Guidelines for Chilean business compliance including SII regulations, RUT formatting, and regional considerations.
---

# Chilean Compliance Skill

This skill ensures that Artifact ERP adheres to the specific legal and technical requirements of the Chilean market.

## Standard Formats
1. **RUT (Rol Único Tributario)**:
   - Format: `XX.XXX.XXX-K` or `XXXXXXXX-K`.
   - Persistence: Store without dots or hyphens (clean string) for easier indexing.
   - Validation: Always validate the check digit (DV).
2. **Currency**:
   - Primary: CLP (Chilean Peso).
   - Format: No decimals, use dot as thousands separator (e.g., "$ 1.250.000").
3. **Dates**:
   - Visual Format: DD/MM/YYYY.
   - System Format: ISO 8601 (YYYY-MM-DD) for database storage.

## SII (Servicio de Impuestos Internos) Requirements
1. **Document Types**: 
   - 33: Factura Electrónica
   - 39: Boleta Electrónica
   - 52: Guía de Despacho
   - 61: Nota de Crédito
2. **Mandatory Fields**: 
   - Razon Social, RUT, Giro, Dirección, Comuna, Ciudad.
3. **IVA**: Standard rate is 19%. Handle Exempt (Exento) and Taxable (Afecto) items properly.

## Regional Logic
- **Comunas/Regiones**: Use standardized lists for dropdowns to ensure compatibility with SII codes.
- **Timezone**: Always use `America/Santiago`. Handle Summer/Winter time changes (CLT/CLST).

## Checklist
* [ ] Is the RUT validated and formatted correctly?
* [ ] Is the IVA calculation accurate (Net + 19%)?
* [ ] Are prices formatted as CLP by default?
* [ ] Does the document meet mandatory SII field requirements?
