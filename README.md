# SubRed ERP - Sistema de Planificación de Recursos Empresariales

Bienvenido a SubRed ERP, un sistema en desarrollo diseñado para gestionar los procesos clave de tu negocio, desde la administración de clientes y proveedores hasta la gestión de inventario por lotes y el ciclo de ventas. Este proyecto busca proporcionar una solución robusta y adaptable a las necesidades específicas de tu operación.

## 🆕 Cambios aplicados (2024-10-22)

- **Autorización corregida por usuario**: los controladores de órdenes y cotizaciones ahora utilizan `req.user.id` (`backend/src/orders/orders.controller.ts`, `backend/src/quotes/quotes.controller.ts`) para impedir accesos no autorizados y evitar registros huérfanos.
- **Gestión de usuarios fortalecida**: se añadieron `CreateUserDto`/`UpdateUserDto` revisados, actualización con hashing y borrado seguro (`backend/src/users/dto/*.ts`, `backend/src/users/users.controller.ts`, `backend/src/users/users.service.ts`), el esquema Prisma ahora expone `profilePictureUrl` (`backend/prisma/schema.prisma`) y el registro público asigna por defecto el rol `CLIENT` (`backend/src/auth/auth.controller.ts`).
- **Cargas protegidas**: los endpoints de `/uploads` ahora requieren JWT, validan tipo y tamaño de archivo y toleran borrados repetidos (`backend/src/uploads/uploads.controller.ts`, `backend/src/uploads/uploads.service.ts`, `frontend/lib/services/uploadService.ts`).
- **Cliente HTTP unificado**: `frontend/lib/api.ts` ahora resuelve la URL base con fallback, elimina el log del token y evita acceder a `localStorage` en SSR.
- **Perfil de usuario editable por el propio usuario**: se permite actualizar datos básicos y la foto de perfil sin privilegios de administrador, sincronizando DTOs y servicios (`backend/src/users/dto/update-user.dto.ts`, `backend/src/users/users.service.ts`, `frontend/lib/services/userService.ts`, `frontend/components/ProfileView.tsx`).
- **Catálogo con búsqueda real**: se implementó `/products/search` y filtros para los productos publicados (categoría, texto y rangos de precio) (`backend/src/products/products.controller.ts`, `backend/src/products/products.service.ts`).
- **Stub controlado para Facto**: `backend/src/dte/dte.service.ts` devuelve una respuesta simulada cuando no hay credenciales válidas, manteniendo operativo el flujo de facturación.
- **Migración registrada**: se añadió `backend/prisma/migrations/20251022_add_profile_picture_url/migration.sql` y se aplicó con `prisma migrate deploy` (usa `DATABASE_URL=postgresql://…@localhost:5432/…` si ejecutas el CLI fuera de los contenedores).
- **Puertos fijos**: se fijaron `PORT=3001` para el backend (`backend/.env`) y `PORT=3000` junto a `NEXT_PUBLIC_API_URL` en el frontend (`frontend/.env.local`), evitando conflictos entre servicios.
- **Gestor unificado**: se eliminó `package-lock.json` y se documentó el uso exclusivo de Yarn para instalar/ejecutar los paquetes (`yarn install`, `yarn start:dev`, etc.).
- **Monorepo Turborepo**: la solución se reorganizó en una estructura `apps/` (storefront Hydrogen, admin Next y backend Nest) y `packages/` compartidos, controlados por Turborepo.

> Referencias a archivos del antiguo frontend (`frontend/...`) se mantienen como nota histórica. Durante la migración a Hydrogen + dashboard propio, estos servicios se portarán a los nuevos workspaces.
- **Limpieza del repositorio**: se eliminaron archivos vacíos en la raíz y se agregó `frontend/.next` al `.gitignore`. Los artefactos existentes dentro de `frontend/.next` no pudieron borrarse desde esta sesión porque pertenecen al usuario `root`; eliminar manualmente esa carpeta dejará el árbol limpio.

> Nota rápida: `prisma migrate dev` requiere un entorno interactivo. Para aplicar migraciones desde tu máquina usa `DATABASE_URL=postgresql://subred_user:subred_password@localhost:5432/subred_erp_db npx prisma migrate deploy`. Después, corrige la propiedad de `backend/dist/` (`sudo chown -R astro:astro backend/dist`) para poder ejecutar `npm run build` sin `sudo`.

## 🚀 Arquitectura Multiempresa

El ERP ha sido refactorizado para soportar una arquitectura multiempresa, permitiendo a un solo usuario gestionar múltiples entidades de negocio (empresas) desde una única interfaz.

*   **Contexto de Empresa Activa (Frontend):** Se ha implementado un `CompanyContext` en el frontend que gestiona la empresa activa seleccionada por el usuario. Esta selección se persiste en el navegador y todas las vistas de datos (Dashboard, Ventas, Compras, etc.) se filtran automáticamente para mostrar solo la información de la empresa activa.
*   **Seguridad por Empresa (Backend):** El backend ha sido fortalecido para validar que cada petición del usuario corresponda a una empresa a la que tiene acceso. Todas las consultas a la base de datos están rigurosamente filtradas por el `companyId` de la empresa activa, garantizando el aislamiento y la seguridad de los datos.

## 🔌 Integración con Facturación Electrónica (Facto.cl)

El sistema está integrado con el proveedor de Documentos Tributarios Electrónicos (DTE) **Facto.cl** para la emisión de facturas en cumplimiento con la normativa chilena.

*   **API SOAP:** La comunicación se realiza a través de la API SOAP de Facto.cl.
*   **Emisión Automática:** Al generar una factura desde una orden de venta, el sistema se comunica automáticamente con Facto.cl para emitir el DTE correspondiente.
*   **Trazabilidad:** El estado de la emisión (folio, URLs de PDF/XML) se almacena en la base de datos para su posterior consulta.

## 📋 Tabla de Contenidos

1.  [Stack Tecnológico](#-stack-tecnológico)
2.  [Flujo de Negocio del ERP](#-flujo-de-negocio-del-erp)
3.  [Funcionalidades Implementadas](#-funcionalidades-implementadas)
4.  [Estructura de Carpetas](#-estructura-de-carpetas)
5.  [Configuración Inicial](#-configuración-inicial)
6.  [Scripts Útiles](#-scripts-útiles)
7.  [Próximos Pasos y Mejoras](#-próximos-pasos-y-mejoras)
8.  [Seguridad y Autenticación](#-seguridad-y-autenticación)
9.  [Testing](#-testing)
10. [Documentación de API](#-documentación-de-api)
11. [Soporte y Contacto](#-soporte-y-contacto)

---

## 🛠 Stack Tecnológico

### Frontend
*   **Next.js 14** (App Router)
*   **TypeScript**
*   **TailwindCSS**
*   **Shadcn/ui** (componentes)
*   **Framer Motion** (animaciones)
*   **Zustand** (gestión de estado)
*   **React Hook Form** (formularios)
*   **React Query/TanStack Query** (cache de datos)
*   **Sonner** (notificaciones toast)

### Backend
*   **NestJS**
*   **TypeScript**
*   **PostgreSQL** (base de datos principal)
*   **Prisma** (ORM)
*   **Redis** (cache y sesiones - *configurado en `docker-compose.yml` pero no activamente usado en la lógica actual*)
*   **JWT** (autenticación)
*   **Class-validator** y **class-transformer** (para validación y transformación de DTOs)
*   **soap** (para la integración con la API de Facto.cl)

### DevOps & Herramientas
*   **Docker** (containerización)
*   **Docker Compose** (para la base de datos y servicios)
*   **Vercel** (frontend deployment - *referencia de `detalle.txt`*)
*   **Railway/Heroku** (backend deployment - *referencia de `detalle.txt`*)
*   **GitHub Actions** (CI/CD - *referencia de `detalle.txt`*)

---

## 📈 Flujo Comercial Completo para Empresas en Chile (con compras, stock y facturación)

Este documento resume el flujo de trabajo completo y extendido para la gestión comercial en una empresa chilena que maneja ventas, compras e inventario.

### 📌 1. Creación de Entidades

**Cliente/Proveedor creado:**

*   Registro con RUT, razón social, giro, dirección, etc.

**Producto/Servicio creado:**

*   Incluye: nombre, SKU, precio de compra, precio de venta, afectación de IVA, lote/serie, fecha vencimiento, stock, ubicación en bodega.

### 📌 2. Proceso de Cotización y Venta

**Cotización generada:**

*   Documento enviado al cliente (PDF o vía sistema).
*   Puede tener estados: Borrador / Enviada / Aceptada / Rechazada.

**Recepción de Orden de Compra del cliente:**

*   OC formal emitida por el cliente en respuesta a la cotización.

**Verificación de stock disponible:**

*   Si hay stock suficiente, continuar con despacho.
*   Si no hay stock suficiente, iniciar proceso de compra:
    *   Orden de compra al proveedor.
    *   Recepción del producto y entrada a bodega.
    *   Asignación del stock a la venta pendiente.

**Despacho o ejecución del servicio:**

*   Guía de despacho electrónica si aplica.
*   Confirmación de entrega/recepción.

**Emisión de factura electrónica:**

*   Referencia a la OC del cliente.
*   Enviada vía sistema SII.

**Seguimiento del pago:**

*   Registro de pago parcial o total.
*   Conciliación bancaria.
*   Cierre de la venta.

### 📦 Consideraciones Adicionales

*   **Lotes/Series:** Para trazabilidad y vencimientos.
*   **Bodegas:** Manejo por sucursales o zonas.
*   **Sucursales:** Cada una puede tener inventario y facturación propia.
*   **Listas de precios:** Por cliente, canal o volumen.
*   **Traspasos de stock:** Entre bodegas o sucursales.
*   **Métricas clave:** Margen bruto, rentabilidad por venta, rotación de inventario.

---

## ✅ Funcionalidades Implementadas

Hasta la fecha, las siguientes funcionalidades clave han sido implementadas y/o mejoradas:

*   **Gestión de Usuarios y Autenticación:**
    *   Sistema de autenticación basado en JWT.
    *   Roles de usuario (`ADMIN`, `EDITOR`, `VIEWER`, `CLIENT`).
    *   Protección de rutas y endpoints por roles.
*   **Gestión Multiempresa:**
    *   Soporte para que un usuario gestione múltiples empresas.
    *   Contexto en frontend (`CompanyContext`) para filtrar vistas por empresa activa.
    *   Seguridad en backend para aislar los datos por empresa.
*   **Gestión de Clientes y Proveedores:**
    *   CRUD completo para clientes y proveedores.
    *   Validación de existencia al crear transacciones.
*   **Gestión de Productos y Lotes:**
    *   CRUD de productos y servicios.
    *   Gestión de inventario por lotes (`Lot`) para trazabilidad.
    *   El stock se calcula y actualiza automáticamente basado en compras y ventas.
*   **Ciclo de Compra y Venta:**
    *   Creación de órdenes de compra (`Purchase`) y venta (`Order`).
    *   La creación de compras incrementa el stock de los lotes.
    *   La creación de ventas verifica y descuenta el stock de los lotes (FIFO).
*   **Gestión de Cotizaciones:**
    *   Módulos de backend y componentes de frontend para la gestión CRUD de cotizaciones.
*   **Facturación y Pagos:**
    *   Integración con proveedor de DTE Facto.cl para emisión de facturas.
    *   Módulos para la gestión de facturas y registro de pagos.
*   **Reportes y Dashboard:**
    *   Vistas iniciales para reportes y visualización de datos clave.

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

*   **Ubicación:** Terminal en la **raíz del proyecto ERP** (donde está `docker-compose.yml`).
*   **Comando:**
    ```bash
    docker compose up -d
    ```
    Si encuentras problemas de permisos, puedes usar `sudo docker compose up -d`.
*   **Propósito:** Este comando levanta el contenedor de la base de datos PostgreSQL y Redis.
*   **Verificación:** `docker ps`. Deberías ver `subred_db` y `redis` (o los nombres definidos en tu docker-compose.yml) corriendo.

### 3. Instalar dependencias del monorepo

*   **Ubicación:** raíz del proyecto (`subred-erp`).
*   **Comando:**
    ```bash
    yarn install
    ```
    Esto instalará Turborepo y las dependencias base. Cada aplicación tendrá sus propias dependencias declaradas y se resolverán mediante workspaces.

### 4. Configurar y Ejecutar el Backend (NestJS)

*   **Ubicación:** Abre una **nueva terminal** y navega a `apps/backend`:
    ```bash
    cd apps/backend
    ```
*   **Crear archivo `.env`:** Si no existe, créalo a partir de `backend/.env.example` (si se proporciona uno) o con el contenido mínimo (ajustar `DATABASE_URL` si el nombre del servicio de BD en `docker-compose.yml` cambió):
    ```env
    # backend/.env
    DATABASE_URL="postgresql://user:password@localhost:5432/subred_db?schema=public"
    JWT_SECRET="tu_super_secreto_jwt_aqui_cambialo"
    JWT_EXPIRES_IN="1h"
    PORT=3001
    
    # Credenciales para la API de Facto.cl
    FACTO_API_USER="tu_usuario_api_facto"
    FACTO_API_PASS="tu_clave_api_facto"
    ```
*   **Instalar dependencias del backend:** se resuelven automáticamente con el comando de workspaces anterior. Si necesitas agregar paquetes específicos al backend, usa `yarn workspace @artifact/backend add <paquete>`.
    (o `npm install`)
*   **Aplicar migraciones de la base de datos:**
    ```bash
    npx prisma migrate dev
    ```
    (o `yarn prisma migrate dev`)
    **Nota:** Si es la primera vez o has hecho cambios en `schema.prisma`, este comando te pedirá un nombre para la migración y la aplicará.
*   **Iniciar el servidor de desarrollo del backend:**
    ```bash
    yarn dev:backend
    ```
    **Resultado:** Tu backend estará corriendo en `http://localhost:3001`.

### 5. Configurar y Ejecutar el Storefront (Hydrogen) – _en construcción_

El nuevo storefront vive en `apps/storefront` y se está migrando a Hydrogen + Tailwind. Una vez que definamos la estructura final:

*   **Instalación específica:**
    ```bash
    yarn workspace @artifact/storefront install
    ```
*   **Desarrollo:**
    ```bash
    yarn dev --filter=@artifact/storefront
    # o el alias: yarn dev:storefront
    ```
    Esto levantará el storefront multiempresa (dominio/subdominio) contra la API Nest.

> Actualmente este módulo está en fase de bootstrap; los comandos anteriores quedarán activos cuando terminemos de integrar Hydrogen.

### 6. Configurar y Ejecutar el Admin Panel – _en construcción_

El dashboard (Next.js) residirá en `apps/admin`. De forma análoga:

*   **Instalación específica:**
    ```bash
    yarn workspace @artifact/admin install
    ```
*   **Desarrollo:**
    ```bash
    yarn dev --filter=@artifact/admin
    # o el alias: yarn dev:admin
    ```

> El panel se encuentra en proceso de construcción aprovechando la misma línea visual de Hydrogen. Documentaremos los pasos definitivos en cuanto esté listo.

---

## ⚙️ Scripts Útiles

### Backend (desde `apps/backend/` o con Turborepo)
*   `yarn dev --filter=backend` / `yarn dev:backend`: Inicia el servidor en modo desarrollo (equivalente a `yarn start:dev` dentro del workspace).
*   `yarn workspace @artifact/backend prisma migrate dev`: Aplica migraciones de Prisma.
*   `yarn workspace @artifact/backend prisma generate`: Genera Prisma Client.
*   `yarn workspace @artifact/backend prisma studio`: Abre Prisma Studio.
*   `yarn workspace @artifact/backend lint`: Ejecuta el linter del backend.

### Storefront y Admin (workspaces)
*   `yarn dev --filter=@artifact/storefront` / `yarn dev:storefront`: Servidor de desarrollo Hydrogen.
*   `yarn dev --filter=@artifact/admin` / `yarn dev:admin`: Servidor de desarrollo del dashboard.
*   `yarn build --filter=<app>`: Compila la aplicación (storefront/admin/backend).
*   `yarn lint --filter=<app>`: Ejecuta el linter correspondiente.

---

## 🚧 Próximos Pasos y Mejoras

A continuación, se detallan las próximas mejoras planificadas:

1.  **Mejoras en Edición y Flujos:**
    *   Implementar la lógica de edición para compras y ventas, considerando la complejidad de la gestión de lotes.
    *   Refinar el flujo para convertir una cotización en una venta y luego en una factura.
2.  **Gestión de Entregas:**
    *   Desarrollar un sistema para gestionar el estado de la entrega de productos/servicios (guías de despacho).
3.  **Notificaciones y Comunicaciones:**
    *   Integrar un servicio de envío de correos para notificar sobre cotizaciones, facturas y otros eventos.
4.  **Control de Crédito y Morosidad:**
    *   Implementar una validación que impida generar nuevas ventas a clientes que tengan facturas vencidas o que hayan superado un límite de crédito predefinido.
5.  **Optimización y Performance:**
    *   Implementar caching (ej. con Redis), optimización de consultas a la base de datos y compresión de assets.
6.  **Seguridad Avanzada:**
    *   Implementar *rate limiting*, configuración de CORS más estricta, y sanitización de datos de entrada.
7.  **Testing y Calidad:**
    *   Aumentar la cobertura de pruebas unitarias, de integración y E2E para garantizar la robustez del sistema.

---

## 🔐 Seguridad y Autenticación

El sistema utiliza JSON Web Tokens (JWT) para la autenticación.

*   **Backend:**
    *   `AuthService` maneja el registro, login y validación de usuarios.
    *   `JwtAuthGuard` protege los endpoints, y `RolesGuard` asegura el acceso basado en roles (`ADMIN`, `EDITOR`, `VIEWER`, `CLIENT`).
*   **Frontend:**
    *   `AuthContext` gestiona el estado de autenticación y el token en `localStorage`.
    *   Middleware de Next.js (`middleware.ts`) protege las rutas y redirige a los usuarios no autenticados o no autorizados.

---

## 🧪 Testing

El proyecto incluye ejemplos de pruebas unitarias y de integración para el backend y el frontend.

### Backend (ejemplo)

```typescript
// src/products/products.service.spec.ts
describe('ProductsService', () => {
  let service: ProductsService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('findAll', () => {
    it('should return filtered products', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Cámara IP WiFi',
          price: 89990,
          salePrice: 79990,
          category: { name: 'Cámaras de Seguridad' }
        }
      ]
      
      jest.spyOn(prisma.product, 'findMany').mockResolvedValue(mockProducts)
      
      const result = await service.findAll({
        page: 1,
        limit: 10,
        categoryId: 'security'
      })
      
      expect(result).toEqual(mockProducts)
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true, categoryId: 'security' },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10
      })
    })
  })
})
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

## 📞 Soporte y Contacto

Para dudas sobre la implementación o contribuciones, por favor, contacta a:
*   📧 Email: dev@subred.cl
*   💬 Slack: #subred-ingenieria-dev
*   📚 Documentación: [docs.subred.cl](https://docs.subred.cl) (futura implementación)

**¡Que tengas un excelente desarrollo! 🚀**
