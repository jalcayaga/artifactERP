# Artifact Platform – Comercio, ERP y Facturación en uno

Artifact es una plataforma SaaS pensada para pymes chilenas que necesitan vender online, controlar su operación y cumplir con el SII desde un solo panel.

## 📍 Objetivo Actual: Estabilización y QA

> Fase final de integración de módulos administrativos y validación de flujos de negocio.

- [x] **Punto 1 – Auditoría del Admin**: módulos de ventas, compras, usuarios, permisos e inventario revisados.
- [x] **Punto 2 – CRUD de productos integrado**: InventoryView conectado a servicios @artifact/core.
- [x] **Punto 3 – UX de tablas y formularios**: Vistas de Ventas (SalesView), Compras (PurchasesView) y Facturación (InvoicesView) unificadas.
- [x] **Punto 4 – Hub de Integraciones**: Interfaz centralizada para configurar Facto, Webpay y Factoring.
- [ ] **Punto 5 – Validación End-to-End**: Pruebas de flujo completo desde Cotización -> Venta -> Factura -> Pago.

## 🆕 Cambios Recientes

### 2026-01-30 (Actualidad)

- ✅ **Admin UI Completo**: Implementación final de vistas para Ventas, Compras, Inventario y Facturación con UX consistente.
- ✅ **Hub de Integraciones**: Nueva página (`/integrations`) para gestión centralizada de llaves de API (Facto, Webpay, etc.).
- ✅ **Corrección de Build**: Resolución de conflictos de `use client` y limpieza de dependencias de iconos (migración a `lucide-react`).
- ✅ **Estandarización UI**: Uso generalizado de `@artifact/ui` para componentes base (Cards, Inputs, DataTables).

### 2025-11-03

- ✅ **Landing del Storefront**: página pública renovada con hero, verticales, testimonios y llamada a la acción para pymes (`apps/storefront/app/page.tsx`).
- ✅ **Login del Admin**: nueva experiencia visual con cards y métrica comercial, conectado al flujo de `useAuth` (`apps/admin/app/login/page.tsx`).
- ✅ **Renombrado de base de datos**: credenciales y volumen ahora usan `artifact_user`/`artifact_password`/`artifact_erp_db` (ver [Reset de datos](#-reset-de-datos)).
- ✅ **Usuario inicial**: se crea automáticamente `artifact@artifact.cl` con rol `ADMIN` y la empresa “Artifact SPA”.
- ✅ **Narrativa actualizada**: README y textos posicionan a Artifact como plataforma de comercio + ERP + facturación electrónica.

### 2025-01-11 (Hito Anterior)

- ✅ **Documentación API con Swagger**: Configurado Swagger/OpenAPI en `/api/docs` con autenticación JWT
- ✅ **Corrección de errores TypeScript**: Corregidos 8 errores de compilación relacionados con relaciones Prisma multi-tenant
- ✅ **Filtro global de excepciones**: Implementado `AllExceptionsFilter` para manejo seguro de errores
- ✅ **Migración multi-tenant aplicada**: Tabla `tenants` creada y todos los registros existentes asignados al tenant por defecto (`artifact`)
- ✅ **Documentación de endpoints Storefront**: Endpoints públicos y de branding documentados

### 2024-10-22 (Histórico)

- **Autorización corregida por usuario**: los controladores de órdenes y cotizaciones ahora utilizan `req.user.id` (`backend/src/orders/orders.controller.ts`, `backend/src/quotes/quotes.controller.ts`) para impedir accesos no autorizados y evitar registros huérfanos.
- **Gestión de usuarios fortalecida**: se añadieron `CreateUserDto`/`UpdateUserDto` revisados, actualización con hashing y borrado seguro (`backend/src/users/dto/*.ts`, `backend/src/users/users.controller.ts`, `backend/src/users/users.service.ts`), el esquema Prisma ahora expone `profilePictureUrl` (`backend/prisma/schema.prisma`) y el registro público asigna por defecto el rol `CLIENT` (`backend/src/auth/auth.controller.ts`).
- **Cargas protegidas**: los endpoints de `/uploads` ahora requieren JWT, validan tipo y tamaño de archivo y toleran borrados repetidos (`backend/src/uploads/uploads.controller.ts`, `backend/src/uploads/uploads.service.ts`, `packages/core/src/lib/services/uploadService.ts`).
- **Cliente HTTP unificado**: `apps/storefront/lib/api.ts` ahora resuelve la URL base con fallback, elimina el log del token y evita acceder a `localStorage` en SSR.
- **Perfil de usuario editable por el propio usuario**: se permite actualizar datos básicos y la foto de perfil sin privilegios de administrador, sincronizando DTOs y servicios (`backend/src/users/dto/update-user.dto.ts`, `backend/src/users/users.service.ts`, `packages/core/src/lib/services/userService.ts`).
- **Catálogo con búsqueda real**: se implementó `/products/search` y filtros para los productos publicados (categoría, texto y rangos de precio) (`backend/src/products/products.controller.ts`, `backend/src/products/products.service.ts`).
- **Stub controlado para Facto**: `backend/src/dte/dte.service.ts` devuelve una respuesta simulada cuando no hay credenciales válidas, manteniendo operativo el flujo de facturación.
- **Migración registrada**: se añadió `backend/prisma/migrations/20251022_add_profile_picture_url/migration.sql` y se aplicó con `prisma migrate deploy` (usa `DATABASE_URL=postgresql://…@localhost:5432/…` si ejecutas el CLI fuera de los contenedores).
- **Puertos fijos**: se fijaron `PORT=3001` para el backend (`backend/.env`) y `PORT=3000` junto a `NEXT_PUBLIC_API_URL` en el frontend (`apps/storefront/.env.local`), evitando conflictos entre servicios.
- **Gestor unificado**: se eliminó `package-lock.json` y se documentó el uso exclusivo de Yarn para instalar/ejecutar los paquetes (`yarn install`, `yarn start:dev`, etc.).
- **Monorepo Turborepo**: la solución se reorganizó en una estructura `apps/` (storefront Hydrogen, admin Next con estilo hydrogen y backend Nest) y `packages/` compartidos, controlados por Turborepo.

> Referencias a archivos del antiguo frontend (`frontend/...`) se mantienen como nota histórica. Durante la migración a Hydrogen + dashboard propio, estos servicios se portarán a los nuevos workspaces.

- **Limpieza del repositorio**: se eliminaron archivos vacíos en la raíz y se agregó `frontend/.next` al `.gitignore`. Los artefactos existentes dentro de `frontend/.next` no pudieron borrarse desde esta sesión porque pertenecen al usuario `root`; eliminar manualmente esa carpeta dejará el árbol limpio.

> Nota rápida: `prisma migrate dev` requiere un entorno interactivo. Para aplicar migraciones desde tu máquina usa `DATABASE_URL=postgresql://subred_user:subred_password@localhost:5432/subred_erp_db npx prisma migrate deploy`. Después, corrige la propiedad de `backend/dist/` (`sudo chown -R astro:astro backend/dist`) para poder ejecutar `npm run build` sin `sudo`.

## 🚀 Arquitectura Multiempresa

El ERP está diseñado desde cero para soportar una arquitectura multi-empresa (multi-tenant), permitiendo a un solo usuario gestionar múltiples entidades de negocio (empresas) desde una única interfaz.

- **Contexto de Empresa Activa (Frontend):** Se ha implementado un `CompanyContext` en el frontend que gestiona la empresa activa seleccionada por el usuario. Esta selección se persiste en el navegador y todas las vistas de datos (Dashboard, Ventas, Compras, etc.) se filtran automáticamente para mostrar solo la información de la empresa activa.
- **Seguridad por Empresa (Backend):** El backend ha sido fortalecido para validar que cada petición del usuario corresponda a una empresa a la que tiene acceso. Todas las consultas a la base de datos están rigurosamente filtradas por el `companyId` de la empresa activa, garantizando el aislamiento y la seguridad de los datos.

## 🧪 Reset de datos

Para volver a un estado limpio con la base de datos `artifact_erp_db` y los usuarios/seeds por defecto:

```bash
./scripts/reset-db.sh
```

El script realiza los siguientes pasos:

1. `docker compose down`
2. Elimina el volumen `artifacterp_artifact_erp_postgres_data` si existe.
3. Levanta el stack con `POSTGRES_USER=artifact_user`, `POSTGRES_PASSWORD=artifact_password`, `POSTGRES_DB=artifact_erp_db`.
4. Ejecuta `npx prisma migrate deploy` y el seed (`ts-node prisma/seed.ts`).
5. Crea/actualiza el usuario `artifact@artifact.cl` (`Artifact!2025`) y la empresa “Artifact SPA”.

Usuarios creados por defecto tras el reset:

| Email                  | Rol         | Contraseña      |
|------------------------|-------------|-----------------|
| `superadmin@artifact.cl` | SUPERADMIN | `Artifact!2025` |
| `artifact@artifact.cl`   | ADMIN      | `Artifact!2025` |

> Nota: `superadmin@artifact.cl` gestiona toda la plataforma (tenants, planes); `artifact@artifact.cl` gestiona la compañía “Artifact SPA”.

## 🗺️ Roadmap & Objetivo Final

**Objetivo:** Consolidar Artifact como la plataforma SaaS definitiva para PYMEs chilenas, integrando ERP, Ecommerce y Facturación Electrónica en una experiencia de usuario premium, libre de fricción técnica.

### ✅ Completado (Core & UI)
- [x] Storefront inicial con hero, verticales y testimonios.
- [x] Admin Panel con UX/UI renovada (Shadcn + Lucide).
- [x] Gestión Multi-tenant y RBAC (Roles y Permisos).
- [x] Módulos de gestión: Productos, Ventas, Compras, Usuarios.
- [x] Configuración de Integraciones (Frontend).
- [x] Documentación API (Swagger).

### 🚧 En Progreso (Lógica de Negocio Deep)
- [ ] **Facturación Electrónica**: Cierre del ciclo de emisión con Facto (envío real de DTE, manejo de errores SOAP, webhooks de estado).
- [ ] **Pasarela de Pagos**: Conexión real con Webpay/MercadoPago en checkout y botón de pago de facturas.
- [ ] **Ciclo de Inventario Avanzado**: Manejo de devoluciones, mermas y ajustes manuales de stock.

### 🔮 Pendiente (Growth & Scale)
- [x] **Onboarding Automatizado**: Flujo guiado para que una nueva PYME configure su branding y credenciales (Backend implementado, Venta Automática activada).
- [ ] **Checkout Storefront**: Flujo de compra completo en el ecommerce público.
- [ ] **Dashboard Analítico**: Métricas en tiempo real (Ventas del día, Productos más vendidos, Flujo de caja).
- [ ] **CI/CD & Tests**: Pipeline de despliegue automatizado y tests E2E críticos (Playwright).

## 🔌 Integración con Facturación Electrónica (Facto.cl)

El sistema está integrado con el proveedor de Documentos Tributarios Electrónicos (DTE) **Facto.cl** para la emisión de facturas en cumplimiento con la normativa chilena.

- **API SOAP:** La comunicación se realiza a través de la API SOAP de Facto.cl.
- **Emisión Automática:** Al generar una factura desde una orden de venta, el sistema se comunica automáticamente con Facto.cl para emitir el DTE correspondiente.
- **Trazabilidad:** El estado de la emisión (folio, URLs de PDF/XML) se almacena en la base de datos para su posterior consulta.

## 📋 Tabla de Contenidos

1.  [Stack Tecnológico](#-stack-tecnológico)
2.  [Estado del Proyecto](#-estado-del-proyecto)
3.  [Flujo de Negocio del ERP](#-flujo-de-negocio-del-erp)
4.  [Funcionalidades Implementadas](#-funcionalidades-implementadas)
5.  [Modelo de Datos](#-modelo-de-datos)
6.  [Estructura de Carpetas](#-estructura-de-carpetas)
7.  [Configuración Inicial](#-configuración-inicial)
8.  [Scripts Útiles](#-scripts-útiles)
9.  [API Storefront](#-api-storefront)
10. [Documentación de API (Swagger)](#-documentación-de-api-swagger)
11. [Próximos Pasos y Mejoras](#-próximos-pasos-y-mejoras)
12. [Seguridad y Autenticación](#-seguridad-y-autenticación)
13. [Testing](#-testing)
14. [Soporte y Contacto](#-soporte-y-contacto)

---

## 📊 Estado del Proyecto

### Estado Actual (Enero 2025)

- ✅ **Backend**: Completamente funcional con 20 módulos NestJS
- ✅ **Base de Datos**: Schema Prisma completo con 16 modelos y 15 migraciones
- ✅ **Multi-tenancy**: Implementado con middleware de resolución de tenant
- ✅ **Autenticación**: JWT con 5 roles (SUPERADMIN, ADMIN, EDITOR, VIEWER, CLIENT)
- ✅ **Documentación API**: Swagger disponible en `/api/docs`
- ✅ **Storefront**: UI completa implementada (Next.js) 
- ✅ **Admin Panel**: UI completa implementada (Next.js)

### Métricas del Código

- **Módulos NestJS**: 20 módulos
- **Modelos de Datos**: 16 modelos Prisma
- **Migraciones**: 15 migraciones aplicadas
- **Archivos TypeScript**: ~95 archivos
- **Endpoints API**: Documentados en Swagger

---

## 🛠 Stack Tecnológico

### Frontend

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Shadcn/ui** (componentes)
- **Framer Motion** (animaciones)
- **Zustand** (gestión de estado)
- **React Hook Form** (formularios)
- **React Query/TanStack Query** (cache de datos)
- **Sonner** (notificaciones toast)

### Backend

- **NestJS**
- **TypeScript**
- **PostgreSQL** (base de datos principal)
- **Prisma** (ORM)
- **Redis** (cache y sesiones - _configurado en `docker-compose.yml` pero no activamente usado en la lógica actual_)
- **JWT** (autenticación)
- **Class-validator** y **class-transformer** (para validación y transformación de DTOs)
- **soap** (para la integración con la API de Facto.cl)

### DevOps & Herramientas

- **Docker** (containerización)
- **Docker Compose** (para la base de datos y servicios)
- **Vercel** (frontend deployment - _referencia de `detalle.txt`_)
- **Railway/Heroku** (backend deployment - _referencia de `detalle.txt`_)
- **GitHub Actions** (CI/CD - _referencia de `detalle.txt`_)

---

## 📈 Flujo Comercial Completo para Empresas en Chile (con compras, stock y facturación)

Este documento resume el flujo de trabajo completo y extendido para la gestión comercial en una empresa chilena que maneja ventas, compras e inventario.

### 📌 0. Onboarding SaaS Automático (B2B)

**Registro de Nueva Empresa (Cliente SaaS):**

1.  **Landing Page:** El cliente se registra en el formulario público (`/tenants/register`).
2.  **Provisión Automática:**
    *   Se crea el **Tenant** (instancia aislada).
    *   Se crea el usuario **ADMIN**.
    *   Se configuran automáticamente las compañías internas.
3.  **Venta de Suscripción:**
    *   El sistema genera automáticamente una **Orden de Venta** en la "Empresa Madre" (Artifact SPA) contra la nueva empresa.
    *   Estado inicial: `PENDING_PAYMENT`.
    *   Monto: Calculado según el plan (ej. Plan PRO Mensual).
4.  **Activación:**
    *   Al confirmar el pago (Webpay/MercadoPago), se emite la **Factura/Boleta** automáticamente.
    *   La cuenta queda 100% operativa.

### 📌 1. Creación de Entidades

**Cliente/Proveedor creado:**

- Registro con RUT, razón social, giro, dirección, etc.

**Producto/Servicio creado:**

- Incluye: nombre, SKU, precio de compra, precio de venta, afectación de IVA, lote/serie, fecha vencimiento, stock, ubicación en bodega.

### 📌 2. Proceso de Cotización y Venta

**Cotización generada:**

- Documento enviado al cliente (PDF o vía sistema).
- Puede tener estados: Borrador / Enviada / Aceptada / Rechazada.

**Recepción de Orden de Compra del cliente:**

- OC formal emitida por el cliente en respuesta a la cotización.

**Verificación de stock disponible:**

- Si hay stock suficiente, continuar con despacho.
- Si no hay stock suficiente, iniciar proceso de compra:
  - Orden de compra al proveedor.
  - Recepción del producto y entrada a bodega.
  - Asignación del stock a la venta pendiente.

**Despacho o ejecución del servicio:**

- Guía de despacho electrónica si aplica.
- Confirmación de entrega/recepción.

**Emisión de factura electrónica:**

- Referencia a la OC del cliente.
- Enviada vía sistema SII.

**Seguimiento del pago:**

- Registro de pago parcial o total.
- Conciliación bancaria.
- Cierre de la venta.

### 📦 Consideraciones Adicionales

- **Lotes/Series:** Para trazabilidad y vencimientos.
- **Bodegas:** Manejo por sucursales o zonas.
- **Sucursales:** Cada una puede tener inventario y facturación propia.
- **Listas de precios:** Por cliente, canal o volumen.
- **Traspasos de stock:** Entre bodegas o sucursales.
- **Métricas clave:** Margen bruto, rentabilidad por venta, rotación de inventario.

---

## ✅ Funcionalidades Implementadas

Hasta la fecha, las siguientes funcionalidades clave han sido implementadas y/o mejoradas:

- **Gestión de Usuarios y Autenticación:**
  - Sistema de autenticación basado en JWT.
  - Roles de usuario (`ADMIN`, `EDITOR`, `VIEWER`, `CLIENT`).
  - Protección de rutas y endpoints por roles.
- **Gestión Multiempresa:**
  - Soporte para que un usuario gestione múltiples empresas.
  - Contexto en frontend (`CompanyContext`) para filtrar vistas por empresa activa.
  - Seguridad en backend para aislar los datos por empresa.
- **Gestión de Clientes y Proveedores:**
  - CRUD completo para clientes y proveedores.
  - Validación de existencia al crear transacciones.
- **Gestión de Productos y Lotes:**
  - CRUD de productos y servicios.
  - Gestión de inventario por lotes (`Lot`) para trazabilidad.
  - El stock se calcula y actualiza automáticamente basado en compras y ventas.
- **Ciclo de Compra y Venta:**
  - Creación de órdenes de compra (`Purchase`) y venta (`Order`).
  - La creación de compras incrementa el stock de los lotes.
  - La creación de ventas verifica y descuenta el stock de los lotes (FIFO).
- **Gestión de Cotizaciones:**
  - Módulos de backend y componentes de frontend para la gestión CRUD de cotizaciones.
- **Facturación y Pagos:**
  - Integración con proveedor de DTE Facto.cl para emisión de facturas.
  - Módulos para la gestión de facturas y registro de pagos.
- **Reportes y Dashboard:**
  - Vistas iniciales para reportes y visualización de datos clave.

---

## 🎨 Implementación del Frontend (Storefront y Admin)

Se ha completado la implementación de la capa visual para las aplicaciones `storefront` y `admin`, siguiendo el "look & feel" del Medusa Next.js Starter y utilizando Next.js (App Router), React y Tailwind CSS.

### 🚀 Características Clave Implementadas

#### Configuración General

-   **Gestión de Puertos**: `storefront` (3000), `admin` (3001), `backend` (3002) configurados para evitar conflictos.
-   **Estilo Global**: Tailwind CSS configurado en ambas aplicaciones.
-   **Temas Dinámicos**: `theme.ts` creado e inyectado en `layout.tsx` para branding (colores, logo, radio de bordes, fuente).
-   **Resolución de Módulos**: `tsconfig.json` configurado para alias de rutas (`@/*`).
-   **Gestión de Estado**: TanStack Query para fetching de datos y Zustand para estado local (carrito).
-   **Mocks**: Se eliminó la configuración de MSW por solicitud, las aplicaciones ahora intentan conectar directamente al backend.

#### Storefront (`apps/storefront`)

-   **Estructura de Páginas**:
    -   `/` (Home): Página principal con `HeroSection` y `ProductGrid`.
    -   `/products`: Listado de productos (PLP) con paginación y filtros dummy.
    -   `/products/[handle]`: Detalles del producto (PDP) con galería, precio, selector de cantidad y botón "Agregar al Carrito".
    -   `/cart`: Página del carrito con listado de ítems, totales y acciones (eliminar, vaciar, proceder al pago).
    -   `/checkout`: Formulario de checkout dummy sin procesamiento real.
    -   `/login`: UI básica para iniciar sesión y registrarse.
-   **Componentes de UI**:
    -   `Header`: Con logo dinámico, navegación principal, botón de carrito y login.
    -   `Footer`: Con enlaces básicos.
    -   `HeroSection`: Sección destacada en la página de inicio.
    -   `ProductCard`, `ProductGrid`, `Price`, `AddToCartButton`, `CartDrawer`.
    -   Componentes genéricos (`Button`, `Input`, `Badge`, `Drawer`, `Modal`).
-   **Funcionalidad de Carrito**: Implementado con el hook `useCart` de Zustand, con persistencia en `localStorage`.

#### Admin Panel (`apps/admin`)

-   **Estructura de Páginas**:
    -   `/` (Dashboard): Página principal con tarjetas de métricas estáticas (`StatsCard`).
    -   `/users`: Gestión de usuarios con tabla, búsqueda, paginación y acciones condicionales.
    -   `/roles`: Matriz visual de roles y permisos (`RoleMatrix`).
    -   `/branding`: Editor de tema (`ThemeEditor`) para modificar el `theme_json` local.
-   **Componentes de UI**:
    -   `Sidebar`: Navegación principal del panel de administración.
    -   `StatsCard`, `Table`, `UserForm`, `RoleMatrix`, `ThemeEditor`.
    -   `Can`: Componente placeholder para simulación de RBAC (control de acceso basado en roles).

### ⚠️ Comportamiento Actual (Sin Backend Implementado)

Dado que la lógica de la API del backend aún no ha sido implementada para devolver datos reales, las aplicaciones frontend se comportarán de la siguiente manera:

-   **Errores de Red**: Se observarán errores `404` o `500` en la consola del navegador y en la terminal de desarrollo cuando las aplicaciones intenten obtener datos.
-   **Estados de UI**: La interfaz de usuario mostrará los estados de carga (skeletons), mensajes de "no hay datos" o "error" en las secciones que dependen de la información del backend.

---

## ✅ Funcionalidades Implementadas

Hasta la fecha, las siguientes funcionalidades clave han sido implementadas y/o mejoradas:

- **Gestión de Usuarios y Autenticación:**
  - Sistema de autenticación basado en JWT.
  - Roles de usuario (`ADMIN`, `EDITOR`, `VIEWER`, `CLIENT`).
  - Protección de rutas y endpoints por roles.
- **Gestión Multiempresa:**
  - Soporte para que un usuario gestione múltiples empresas.
  - Contexto en frontend (`CompanyContext`) para filtrar vistas por empresa activa.
  - Seguridad en backend para aislar los datos por empresa.
- **Gestión de Clientes y Proveedores:**
  - CRUD completo para clientes y proveedores.
  - Validación de existencia al crear transacciones.
- **Gestión de Productos y Lotes:**
  - CRUD de productos y servicios.
  - Gestión de inventario por lotes (`Lot`) para trazabilidad.
  - El stock se calcula y actualiza automáticamente basado en compras y ventas.
- **Ciclo de Compra y Venta:**
  - Creación de órdenes de compra (`Purchase`) y venta (`Order`).
  - La creación de compras incrementa el stock de los lotes.
  - La creación de ventas verifica y descuenta el stock de los lotes (FIFO).
- **Gestión de Cotizaciones:**
  - Módulos de backend y componentes de frontend para la gestión CRUD de cotizaciones.
- **Facturación y Pagos:**
  - Integración con proveedor de DTE Facto.cl para emisión de facturas.
  - Módulos para la gestión de facturas y registro de pagos.
- **Reportes y Dashboard:**
  - Vistas iniciales para reportes y visualización de datos clave.

---

## 🎨 Implementación del Frontend (Storefront y Admin)

Se ha completado la implementación de la capa visual para las aplicaciones `storefront` y `admin`, siguiendo el "look & feel" del Medusa Next.js Starter y utilizando Next.js (App Router), React y Tailwind CSS.

### 🚀 Características Clave Implementadas

#### Configuración General

-   **Gestión de Puertos**: `storefront` (3000), `admin` (3001), `backend` (3002) configurados para evitar conflictos.
-   **Estilo Global**: Tailwind CSS configurado en ambas aplicaciones.
-   **Temas Dinámicos**: `theme.ts` creado e inyectado en `layout.tsx` para branding (colores, logo, radio de bordes, fuente).
-   **Resolución de Módulos**: `tsconfig.json` configurado para alias de rutas (`@/*`).
-   **Gestión de Estado**: TanStack Query para fetching de datos y Zustand para estado local (carrito).
-   **Mocks**: Se eliminó la configuración de MSW por solicitud, las aplicaciones ahora intentan conectar directamente al backend.

#### Storefront (`apps/storefront`)

-   **Estructura de Páginas**:
    -   `/` (Home): Página principal con `HeroSection` y `ProductGrid`.
    -   `/products`: Listado de productos (PLP) con paginación y filtros dummy.
    -   `/products/[handle]`: Detalles del producto (PDP) con galería, precio, selector de cantidad y botón "Agregar al Carrito".
    -   `/cart`: Página del carrito con listado de ítems, totales y acciones (eliminar, vaciar, proceder al pago).
    -   `/checkout`: Formulario de checkout dummy sin procesamiento real.
    -   `/login`: UI básica para iniciar sesión y registrarse.
-   **Componentes de UI**:
    -   `Header`: Con logo dinámico, navegación principal, botón de carrito y login.
    -   `Footer`: Con enlaces básicos.
    -   `HeroSection`: Sección destacada en la página de inicio.
    -   `ProductCard`, `ProductGrid`, `Price`, `AddToCartButton`, `CartDrawer`.
    -   Componentes genéricos (`Button`, `Input`, `Badge`, `Drawer`, `Modal`).
-   **Funcionalidad de Carrito**: Implementado con el hook `useCart` de Zustand, con persistencia en `localStorage`.

#### Admin Panel (`apps/admin`)

-   **Estructura de Páginas**:
    -   `/` (Dashboard): Página principal con tarjetas de métricas estáticas (`StatsCard`).
    -   `/users`: Gestión de usuarios con tabla, búsqueda, paginación y acciones condicionales.
    -   `/roles`: Matriz visual de roles y permisos (`RoleMatrix`).
    -   `/branding`: Editor de tema (`ThemeEditor`) para modificar el `theme_json` local.
-   **Componentes de UI**:
    -   `Sidebar`: Navegación principal del panel de administración.
    -   `StatsCard`, `Table`, `UserForm`, `RoleMatrix`, `ThemeEditor`.
    -   `Can`: Componente placeholder para simulación de RBAC (control de acceso basado en roles).

### ⚠️ Comportamiento Actual (Sin Backend Implementado)

Dado que la lógica de la API del backend aún no ha sido implementada para devolver datos reales, las aplicaciones frontend se comportarán de la siguiente manera:

-   **Errores de Red**: Se observarán errores `404` o `500` en la consola del navegador y en la terminal de desarrollo cuando las aplicaciones intenten obtener datos.
-   **Estados de UI**: La interfaz de usuario mostrará los estados de carga (skeletons), mensajes de "no hay datos" o "error" en las secciones que dependen de la información del backend.

---

## 📊 Modelo de Datos

El proyecto utiliza **Prisma ORM** con **PostgreSQL**. El schema contiene **16 modelos principales**:

### Core Multi-Tenant (2 modelos)

- `Tenant` - Entidades multi-tenant (empresas)
- `TenantBranding` - Personalización visual por tenant (colores, logos, temas)

### Usuarios y Empresas (3 modelos)

- `User` - Usuarios con roles (SUPERADMIN, ADMIN, EDITOR, VIEWER, CLIENT)
- `Company` - Clientes y proveedores unificados
- `ContactPerson` - Personas de contacto por empresa

### Catálogo e Inventario (2 modelos)

- `Product` - Productos y servicios con categorías
- `Lot` - Control de inventario por lotes (trazabilidad FIFO)

### Compras y Ventas (5 modelos)

- `Order` - Órdenes de venta
- `OrderItem` - Items de órdenes
- `OrderItemLot` - Trazabilidad de lotes en ventas
- `Purchase` - Órdenes de compra
- `PurchaseItem` - Items de compras

### Cotizaciones y Facturación (4 modelos)

- `Quote` - Cotizaciones con estados (DRAFT, SENT, ACCEPTED, etc.)
- `QuoteItem` - Items de cotizaciones
- `Invoice` - Facturas electrónicas con integración Facto.cl
- `InvoiceItem` - Items de facturas

### Pagos (1 modelo)

- `Payment` - Registro de pagos por factura

**Total**: 16 modelos con relaciones complejas, 45+ índices para optimización, y soporte completo multi-tenant.

---

## ✅ Funcionalidades Implementadas

Hasta la fecha, las siguientes funcionalidades clave han sido implementadas y/o mejoradas:

- **Gestión de Usuarios y Autenticación:**
  - Sistema de autenticación basado en JWT.
  - Roles de usuario (`ADMIN`, `EDITOR`, `VIEWER`, `CLIENT`).
  - Protección de rutas y endpoints por roles.
- **Gestión Multiempresa:**
  - Soporte para que un usuario gestione múltiples empresas.
  - Contexto en frontend (`CompanyContext`) para filtrar vistas por empresa activa.
  - Seguridad en backend para aislar los datos por empresa.
- **Gestión de Clientes y Proveedores:**
  - CRUD completo para clientes y proveedores.
  - Validación de existencia al crear transacciones.
- **Gestión de Productos y Lotes:**
  - CRUD de productos y servicios.
  - Gestión de inventario por lotes (`Lot`) para trazabilidad.
  - El stock se calcula y actualiza automáticamente basado en compras y ventas.
- **Ciclo de Compra y Venta:**
  - Creación de órdenes de compra (`Purchase`) y venta (`Order`).
  - La creación de compras incrementa el stock de los lotes.
  - La creación de ventas verifica y descuenta el stock de los lotes (FIFO).
- **Gestión de Cotizaciones:**
  - Módulos de backend y componentes de frontend para la gestión CRUD de cotizaciones.
- **Facturación y Pagos:**
  - Integración con proveedor de DTE Facto.cl para emisión de facturas.
  - Módulos para la gestión de facturas y registro de pagos.
- **Reportes y Dashboard:**
  - Vistas iniciales para reportes y visualización de datos clave.

---

## 🏗 Estructura de Carpetas

```
subred-erp/
├── apps/
│   ├── backend/               # API NestJS multi-tenant (reestructurado desde `backend/`)
│   ├── storefront/            # Storefront Hydrogen + Tailwind (Next.js)
│   └── admin/                 # Dashboard Next.js con el mismo estilo
├── packages/
│   ├── ui/                    # Biblioteca compartida de componentes React/Tailwind
│   ├── types/                 # Tipos y contratos compartidos
│   ├── config/                # Configuración multi-tenant (branding, dominios, etc.)
│   └── utils/                 # Funciones reutilizables en apps
├── docker-compose.prod.yml    # Configuración de Docker Compose para producción (si aplica)
├── docker-compose.yml         # Define los servicios de base de datos (PostgreSQL) y Redis para desarrollo
├── package.json               # Turborepo + workspaces Yarn
├── turbo.json                 # Pipeline de Turborepo
└── README.md                  # Este archivo
```

---

## 🚀 Configuración Inicial

Sigue estos pasos en orden para configurar y ejecutar el proyecto en tu máquina local.

> **Nota:** El proyecto usa **Yarn 1.x** como gestor de paquetes. No mezcles npm/pnpm para evitar inconsistencias en las dependencias.

### 1. Clonar el Repositorio (si aplica)

Si estás obteniendo el código de un repositorio Git:

```bash
git clone <url_del_repositorio>
cd subred-erp
```

Si ya tienes los archivos, simplemente navega a la carpeta raíz del proyecto.

### 2. Configurar y Levantar la Base de Datos (PostgreSQL con Docker)

- **Ubicación:** Terminal en la **raíz del proyecto ERP** (donde está `docker-compose.yml`).
- **Comando:**
  ```bash
  docker compose up -d
  ```
  Si encuentras problemas de permisos, puedes usar `sudo docker compose up -d`.
- **Propósito:** Este comando levanta el contenedor de la base de datos PostgreSQL y Redis.
- **Verificación:** `docker ps`. Deberías ver `subred_db` y `redis` (o los nombres definidos en tu docker-compose.yml) corriendo.

### 3. Instalar dependencias del monorepo

- **Ubicación:** raíz del proyecto (`subred-erp`).
- **Comando:**
  ```bash
  yarn install
  ```
  Esto instalará Turborepo y las dependencias base. Cada aplicación tendrá sus propias dependencias declaradas y se resolverán mediante workspaces.

### 4. Configurar y Ejecutar las Aplicaciones (Backend, Storefront y Admin)

Una vez instaladas las dependencias, puedes levantar todas las aplicaciones del monorepo (Backend, Storefront y Admin) con un solo comando desde la raíz del proyecto.

-   **Ubicación:** Raíz del proyecto (`subred-erp`).
-   **Comando:**
    ```bash
    yarn dev
    ```
-   **Resultado:**
    -   El **Backend** estará corriendo en `http://localhost:3002`.
    -   El **Storefront** estará corriendo en `http://localhost:3000`.
    -   El **Admin Panel** estará corriendo en `http://localhost:3001`.

    **Nota:** Las aplicaciones frontend (Storefront y Admin) intentarán conectarse al backend. Como la lógica de la API del backend aún no está implementada para devolver datos reales, verás errores `404` o `500` en la consola y la UI mostrará estados de carga o mensajes de "no hay datos".

-   **Configuración del Backend (`apps/backend`)**:
    -   **Crear archivo `.env`:** Si no existe, créalo a partir de `backend/.env.example` (si se proporciona uno) o con el contenido mínimo (ajustar `DATABASE_URL` si el nombre del servicio de BD en `docker-compose.yml` cambió):

        ```env
        # backend/.env
        DATABASE_URL="postgresql://user:password@localhost:5432/subred_db?schema=public"
        JWT_SECRET="tu_super_secreto_jwt_aqui_cambialo"
        JWT_EXPIRES_IN="1h"
        PORT=3002 # Puerto del backend
        # Credenciales para la API de Facto.cl
        FACTO_API_USER="tu_usuario_api_facto"
        FACTO_API_PASS="tu_clave_api_facto"
        ```
    -   **Aplicar migraciones de la base de datos:**
        ```bash
        npx prisma migrate dev
        ```
        (o `yarn prisma migrate dev`)
        **Nota:** Si es la primera vez o has hecho cambios en `schema.prisma`, este comando te pedirá un nombre para la migración y la aplicará.

---

## ⚙️ Scripts Útiles

Estos comandos se ejecutan desde la **raíz del proyecto**.

-   `yarn dev`: Inicia todas las aplicaciones (Backend, Storefront, Admin) en modo desarrollo.
-   `yarn build`: Compila todas las aplicaciones para producción.
-   `yarn start`: Inicia las aplicaciones compiladas en modo producción.
-   `yarn lint`: Ejecuta el linter en todas las aplicaciones.

### Comandos Específicos de Workspaces (ejecutar desde la raíz)

-   `yarn workspace @artifact/backend prisma migrate dev`: Aplica migraciones de Prisma para el backend.
-   `yarn workspace @artifact/backend prisma generate`: Genera Prisma Client para el backend.
-   `yarn workspace @artifact/backend prisma studio`: Abre Prisma Studio para el backend.
-   `yarn workspace @artifact/backend lint`: Ejecuta el linter del backend.
-   `yarn workspace @artifact/storefront lint`: Ejecuta el linter del storefront.
-   `yarn workspace @artifact/admin lint`: Ejecuta el linter del admin.

---

## 🚧 Próximos Pasos y Mejoras

A continuación, se detallan las próximas mejoras planificadas:

1.  **Mejoras en Edición y Flujos:**
    - Implementar la lógica de edición para compras y ventas, considerando la complejidad de la gestión de lotes.
    - Refinar el flujo para convertir una cotización en una venta y luego en una factura.
2.  **Gestión de Entregas:**
    - Desarrollar un sistema para gestionar el estado de la entrega de productos/servicios (guías de despacho).
3.  **Notificaciones y Comunicaciones:**
    - Integrar un servicio de envío de correos para notificar sobre cotizaciones, facturas y otros eventos.
4.  **Control de Crédito y Morosidad:**
    - Implementar una validación que impida generar nuevas ventas a clientes que tengan facturas vencidas o que hayan superado un límite de crédito predefinido.
5.  **Optimización y Performance:**
    - Implementar caching (ej. con Redis), optimización de consultas a la base de datos y compresión de assets.
6.  **Seguridad Avanzada:**
    - Implementar _rate limiting_, configuración de CORS más estricta, y sanitización de datos de entrada.
7.  **Testing y Calidad:**
    - Aumentar la cobertura de pruebas unitarias, de integración y E2E para garantizar la robustez del sistema.

---

## 🔐 Seguridad y Autenticación: RBAC (Control de Acceso Basado en Roles)

El sistema ha migrado de una lista estática de roles a un modelo completo de **Control de Acceso Basado en Roles (RBAC)**, proporcionando una gestión de permisos granular y flexible. La autenticación sigue basándose en **JSON Web Tokens (JWT)**.

### Modelo de Datos RBAC

El nuevo modelo se compone de tres entidades principales en `prisma/schema.prisma`:

- `Role`: Define un conjunto de responsabilidades (ej: "Administrador", "Editor de Contenidos").
- `Permission`: Representa una acción atómica que un usuario puede realizar (ej: `create:product`, `read:users`, `delete:invoice`).
- `RolePermission`: Tabla de unión que asigna permisos específicos a cada rol.

Un `User` puede tener asignados múltiples `Role`s, y la suma de los permisos de todos sus roles determina sus capacidades en el sistema.

### Aplicación en el Backend

- **`PermissionsGuard`**: Este es el guardián principal que protege los endpoints. Se activa globalmente y trabaja junto con el `JwtAuthGuard`.
- **`@RequiredPermissions()`**: Decorador personalizado que se utiliza a nivel de controlador o de ruta para especificar los permisos necesarios para acceder a un recurso.

**Ejemplo de uso en un controlador:**

```typescript
// backend/src/products/products.controller.ts

import { RequiredPermissions } from "../common/decorators/required-permissions.decorator";
import { Permission } from "../common/types/permissions.types";

@Controller("products")
export class ProductsController {
  // ...

  @Post()
  @RequiredPermissions(Permission.CreateProduct) // Solo usuarios con el permiso 'create:product' pueden acceder
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // ...
}
```

### Roles y Permisos por Defecto

El fichero `backend/prisma/seed.ts` se encarga de inicializar la base de datos con un conjunto de roles y permisos predeterminados, asegurando que el sistema sea funcional desde el primer momento. Los roles base son:

- **`SUPER_ADMIN`**: Acceso total a todo el sistema, incluyendo la gestión de tenants y roles.
- **`ADMIN`**: Acceso administrativo dentro de un tenant específico.
- **`EDITOR`**: Puede crear y modificar recursos (productos, órdenes, etc.).
- **`VIEWER`**: Solo puede leer la información.

### Próximos Pasos

Se implementarán endpoints CRUD para gestionar Roles y Permisos dinámicamente desde una interfaz de administrador, permitiendo a los `SUPER_ADMIN` personalizar el sistema de autorización sin necesidad de modificar el código.

---

## 🧪 Testing

El proyecto incluye ejemplos de pruebas unitarias y de integración para el backend y el frontend.

### Backend (ejemplo)

```typescript
// src/products/products.service.spec.ts
describe("ProductsService", () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe("findAll", () => {
    it("should return filtered products", async () => {
      const mockProducts = [
        {
          id: "1",
          name: "Cámara IP WiFi",
          price: 89990,
          salePrice: 79990,
          category: { name: "Cámaras de Seguridad" },
        },
      ];

      jest.spyOn(prisma.product, "findMany").mockResolvedValue(mockProducts);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        categoryId: "security",
      });

      expect(result).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true, categoryId: "security" },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
    });
  });
});
```

### Frontend (ejemplo)

```typescript
// src/components/product/product-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from './product-card'
import { useCart } from '@/store/cart-store'

jest.mock('@/store/cart-store')

const mockProduct = {
  id: '1',
  name: 'Cámara IP WiFi HD',
  price: 89990,
  salePrice: 79990,
  images: ['/camera1.jpg'],
  stock: 5,
  slug: 'camara-ip-wifi-hd'
}

describe('ProductCard', () => {
  const mockAddToCart = jest.fn()

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      addToCart: mockAddToCart
    })
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Cámara IP WiFi HD')).toBeInTheDocument()
    expect(screen.getByText('$79.990')).toBeInTheDocument()
    expect(screen.getByText('$89.990')).toBeInTheDocument()
    expect(screen.getByText('Stock: 5')).toBeInTheDocument()
  })

  it('calculates discount percentage correctly', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('-11%')).toBeInTheDocument()
  })

  it('calls addToCart when button is clicked', () => {
    render(<ProductCard product={mockProduct} />)

    const addButton = screen.getByText('Agregar al Carrito')
    fireEvent.click(addButton)

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct)
  })
})
```

---

## 🛍️ API Storefront

El módulo `StorefrontModule` proporciona endpoints públicos para la tienda sin requerir autenticación.

### Endpoints Públicos

#### Obtener tema/branding del tenant

```bash
GET /storefront/theme
```

Devuelve el branding personalizado del tenant (colores, logos, temas).

#### Listar productos publicados

```bash
GET /storefront/products?page=1&limit=12&category=electronica&search=laptop&minPrice=100&maxPrice=500
```

**Parámetros opcionales:**

- `page`: Número de página (default: 1)
- `limit`: Productos por página (default: 12)
- `category`: Filtrar por categoría
- `search`: Buscar por texto
- `minPrice` / `maxPrice`: Rango de precios

#### Obtener producto por ID

```bash
GET /storefront/products/:id
```

### Gestión de Branding (Requiere autenticación)

#### Obtener branding actual

```bash
GET /admin/branding
Authorization: Bearer <token>
```

Requiere rol: ADMIN, EDITOR o SUPERADMIN

#### Actualizar branding

```bash
PUT /admin/branding
Authorization: Bearer <token>
Content-Type: application/json

{
  "logoUrl": "https://ejemplo.com/logo.png",
  "primaryColor": "#FF5733",
  "secondaryColor": "#33FF57",
  "accentColor": "#3357FF",
  "socialLinks": {
    "facebook": "https://facebook.com/mitienda"
  }
}
```

### Ejemplo de uso desde frontend

```typescript
// Obtener tema
const theme = await fetch("/storefront/theme").then((r) => r.json());

// Listar productos
const products = await fetch("/storefront/products?page=1&limit=12").then((r) =>
  r.json()
);

// Aplicar branding dinámicamente
if (theme?.branding?.primaryColor) {
  document.documentElement.style.setProperty(
    "--primary-color",
    theme.branding.primaryColor
  );
}
```

**Nota**: Los endpoints del storefront detectan automáticamente el tenant mediante el middleware `TenantResolverMiddleware` (por header `x-tenant-slug` o subdominio).

---

## 📚 Documentación de API (Swagger)

El proyecto incluye documentación automática de la API usando **Swagger/OpenAPI**.

### Acceso a la Documentación

Una vez que el backend esté corriendo:

```
http://localhost:3001/api/docs
```

### Características

- ✅ Documentación interactiva de todos los endpoints
- ✅ Prueba de endpoints directamente desde el navegador
- ✅ Autenticación JWT configurada (botón "Authorize")
- ✅ Ejemplos de request/response
- ✅ Código de ejemplo para diferentes lenguajes

### Uso

1. Abre `http://localhost:3001/api/docs` en tu navegador
2. Explora los endpoints por categorías (auth, products, storefront, etc.)
3. Para probar endpoints protegidos:
   - Haz clic en el botón "Authorize"
   - Ingresa tu token JWT obtenido de `/auth/login`
   - Prueba los endpoints protegidos

---

## 📞 Soporte y Contacto

Para dudas sobre la implementación o contribuciones, por favor, contacta a:

- 📧 Email: dev@subred.cl
- 💬 Slack: #subred-ingenieria-dev
- 📚 Documentación: [docs.subred.cl](https://docs.subred.cl) (futura implementación)

**¡Que tengas un excelente desarrollo! 🚀**
