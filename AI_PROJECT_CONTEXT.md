# AI PROJECT CONTEXT

> **Última Actualización:** 2026-02-13
> **Rol:** Arquitecto Principal artifactERP

## 1. Resumen del Stack
*   **Frontend:** React + Tailwind CSS (Diseños vía Stitch).
*   **Backend:** NestJS + Prisma ORM + Supabase (PostgreSQL).
*   **Infraestructura:** Supabase Auth (Multi-tenant), Supabase Storage.
*   **Herramientas AI:** GitHub MCP, Supabase MCP.

## 2. Estado de la Base de Datos (Snapshot)
Tablas confirmadas en Supabase (`public` schema):

### Core & Auth
*   `tenants`: Gestión multi-empresa.
*   `users`: Usuarios con acceso (vinculados a tenant).
*   `roles`, `permissions`, `role_permissions`: RBAC.
*   `tenant_branding`: Personalización por tenant.

### Negocio Core
*   `companies`: Empresas/Entidades (Clientes/Proveedores).
*   `branches`: Sucursales físicas.
*   `contact_people`: Contactos.
*   `regions`, `communes`: Localización Chile.
*   `economic_indicators`: UF, USD, UTM (Sync diario).

### Inventario & Precios
*   `products`: Catálogo maestro.
*   `categories`: Jerarquía de productos.
*   `warehouses`: Bodegas.
*   `lots`: Trazabilidad y stock (Lotes).
*   `price_lists`, `product_prices`: Listas de precios diferenciadas.

### Ventas & Facturación
*   `orders`, `order_items`: Pedidos (Web/POS/Admin).
*   `invoices`, `invoice_items`: Documentos tributarios.
*   `payments`: Registro de pagos.
*   `subscriptions`: Modelos de suscripción.

### Compras & Logística
*   `purchases`, `purchase_items`: Compras a proveedores.
*   `purchase_orders`, `purchase_order_items`: Órdenes de compra.
*   `receptions`, `reception_items`: Recepción de mercadería.

> [!IMPORTANT]
> **Sincronización POS:** Las tablas del módulo POS (`cash_registers`, `pos_shifts`) han sido creadas exitosamente mediante migración manual.


## 3. Reglas de Negocio CHILE (Inmutables)
*   **Moneda:** CLP (Pesos Chilenos) - **Sin decimales** en visualización, enteros en BD (o decimal 0).
*   **Impuestos:** IVA 19%.
    *   En BD: Se almacenan valores netos y brutos por línea para trazabilidad.
    *   Cálculo: `Neto * 1.19 = Bruto`.
*   **Identificador:** RUT (Rol Único Tributario) con validación Módulo 11 estricta.
*   **Documentos DTE:**
    *   **Factura Electrónica (33):** B2B, requiere giro y detalles completos.
    *   **Boleta Electrónica (39/41):** B2C, consumidor final.
    *   **Nota de Crédito (61):** Anulaciones/Devoluciones.

## 4. Mapa de Progreso

### ✅ Módulos Listos (Backend Implemented)
*   **Core:** Multi-tenant, RBAC, Localización CL, Indicadores.
*   **Inventario:** SKU, Stock (Lotes), Precios Múltiples, Bodegas.
*   **DTE (Backend):** Estructura de Factura (campos DTE), Adapter Pattern para timbraje, Mock Provider.
*   **POS (Backend):** Servicios para Cajas, Turnos y Ventas (Código listo, falta sync BD).

### 🚧 Módulos Pendientes / En Desarrollo
*   **POS (Frontend):** Interfaz visual para punto de venta (React).
*   **Marketplace:** Storefront público, CMS visual.
*   **Logística Avanzada:** OMS, Picking/Packing, Etiquetas.
*   **Asistente IA:** Catalogación automática, Chatbot.
*   **Finanzas:** Conciliación bancaria avanzada.

---
*Este archivo sirve como memoria a largo plazo para el Agente AI. No borrar ni modificar sin autorización del Arquitecto.*
