# SubRed ERP - Sistema de Planificación de Recursos Empresariales

Bienvenido a SubRed ERP, un sistema en desarrollo diseñado para gestionar los procesos clave de tu negocio, desde la administración de clientes y proveedores hasta la gestión de inventario por lotes y el ciclo de ventas. Este proyecto busca proporcionar una solución robusta y adaptable a las necesidades específicas de tu operación.

## 🎯 Objetivo del Proyecto

Desarrollar un sistema ERP modular y escalable que permita una gestión eficiente de los recursos empresariales, con un enfoque en la trazabilidad del inventario, la optimización de procesos de compra y venta, y la integración con flujos de negocio específicos, como la gestión de cotizaciones y facturación electrónica (futuras fases).

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
*   **Gestión de Clientes:**
    *   Creación, lectura, actualización y eliminación de registros de clientes.
    *   Validación de clientes existentes al crear ventas.
*   **Gestión de Proveedores:**
    *   **NUEVO:** Modelo `Supplier` en la base de datos.
    *   Módulo de backend (`SuppliersModule`) con servicios y controladores para la gestión CRUD de proveedores.
    *   Validación de proveedores existentes al crear compras.
*   **Gestión de Productos:**
    *   Creación, lectura, actualización y eliminación de productos.
    *   Diferenciación entre `PRODUCT` (físico con stock) y `SERVICE` (sin stock).
    *   **NUEVO:** Gestión de inventario a nivel de **Lotes (`Lot`)**:
        *   Cada entrada de producto físico (compra) genera un nuevo lote con su cantidad y precio de compra.
        *   El stock total de un producto se calcula sumando las cantidades disponibles en sus lotes.
        *   Funcionalidad para obtener detalles de lotes (`getProductLots`) para facilitar la negociación de precios de venta.
*   **Gestión de Compras (Órdenes a Proveedores):**
    *   Creación de órdenes de compra (`Purchase`).
    *   Validación de proveedores y productos/servicios existentes al crear una compra.
    *   **NUEVO:** Incremento automático del stock de lotes al registrar una compra.
*   **Gestión de Ventas (Órdenes de Clientes):**
    *   Creación de órdenes de venta (`Order`).
    *   Validación de clientes y productos/servicios existentes al crear una venta.
    *   **NUEVO:** Verificación de stock por lote antes de la venta.
    *   **NUEVO:** Disminución automática del stock de lotes (estrategia FIFO) al registrar una venta.
    *   Vinculación de ítems de venta a los lotes específicos de los que provienen (`OrderItemLot`).
    *   Formulario de ventas en el frontend que permite la selección de clientes y productos, y muestra información de lotes para la negociación.

---

## 🏗 Estructura de Carpetas

```
subred-erp/
├── frontend/                  # Código fuente del frontend Next.js
│   ├── app/                   # Rutas y layouts principales (App Router)
│   ├── components/            # Componentes reutilizables (UI y de lógica)
│   ├── contexts/              # Contextos de React (ej. AuthContext)
│   ├── lib/                   # Librerías, utilidades, servicios (ej. productService, saleService, supplierService), tipos, constantes
│   ├── public/                # Archivos estáticos (ej. favicons, imágenes)
│   ├── package.json           # Dependencias y scripts del frontend
│   ├── next.config.js         # Configuración de Next.js
│   ├── tsconfig.json          # Configuración de TypeScript para el frontend
│   └── tailwind.config.js     # Configuración de Tailwind CSS
├── backend/                   # Código fuente del backend NestJS
│   ├── prisma/                # Esquema de Prisma y migraciones
│   ├── src/                   # Módulos de la aplicación (auth, users, products, orders, sales, purchases, clients, suppliers)
│   │   ├── auth/
│   │   ├── clients/
│   │   ├── common/
│   │   ├── config/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── purchases/
│   │   ├── sales/
│   │   ├── suppliers/         # NUEVO: Módulo de gestión de proveedores
│   │   ├── users/
│   │   └── app.module.ts      # Módulo principal de la aplicación
│   ├── nest-cli.json
│   ├── package.json           # Dependencias y scripts del backend
│   ├── tsconfig.json          # Configuración de TypeScript para el backend
│   └── yarn.lock
├── docker-compose.prod.yml    # Configuración de Docker Compose para producción (si aplica)
├── docker-compose.yml         # Define los servicios de base de datos (PostgreSQL) y Redis para desarrollo
└── README.md                  # Este archivo
```

---

## 🚀 Configuración Inicial

Sigue estos pasos en orden para configurar y ejecutar el proyecto en tu máquina local.

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

### 3. Configurar y Ejecutar el Backend (NestJS)

*   **Ubicación:** Abre una **nueva terminal** y navega a la carpeta `backend`:
    ```bash
    cd backend
    ```
*   **Crear archivo `.env`:** Si no existe, créalo a partir de `backend/.env.example` (si se proporciona uno) o con el contenido mínimo (ajustar `DATABASE_URL` si el nombre del servicio de BD en `docker-compose.yml` cambió):
    ```env
    # backend/.env
    DATABASE_URL="postgresql://user:password@localhost:5432/subred_db?schema=public"
    JWT_SECRET="tu_super_secreto_jwt_aqui_cambialo"
    JWT_EXPIRES_IN="1h"
    PORT=3001
    ```
*   **Instalar dependencias del backend:**
    ```bash
    yarn install
    ```
    (o `npm install`)
*   **Aplicar migraciones de la base de datos:**
    ```bash
    npx prisma migrate dev
    ```
    (o `yarn prisma migrate dev`)
    **Nota:** Si es la primera vez o has hecho cambios en `schema.prisma`, este comando te pedirá un nombre para la migración y la aplicará.
*   **Iniciar el servidor de desarrollo del backend:**
    ```bash
    yarn start:dev
    ```
    (o `npm run start:dev`)
    **Resultado:** Tu backend estará corriendo en `http://localhost:3001`.

### 4. Configurar y Ejecutar el Frontend (Next.js)

*   **Ubicación:** Abre una **nueva terminal** y navega a la carpeta `frontend`:
    ```bash
    cd frontend
    ```
*   **Instalar dependencias del frontend:**
    ```bash
    yarn install
    ```
    (o `npm install`)
    **Asegúrate de instalar `sonner`:**
    ```bash
    npm install sonner
    # o si usas yarn
    # yarn add sonner
    ```
*   **Iniciar el servidor de desarrollo de Next.js:**
    ```bash
    yarn dev
    ```
    (o `npm run dev`)
    **Resultado:** Tu frontend Next.js estará disponible en una URL como `http://localhost:3000`. Abre esta URL en tu navegador.

---

## ⚙️ Scripts Útiles

### Backend (desde la carpeta `backend/`)
*   `yarn start:dev`: Inicia el servidor en modo desarrollo.
*   `yarn prisma:migrate:dev`: Aplica migraciones de Prisma.
*   `yarn prisma:generate`: Genera Prisma Client.
*   `yarn prisma:studio`: Abre Prisma Studio.
*   `yarn lint`: Ejecuta el linter.
*   `yarn format`: Formatea el código.

### Frontend (desde la carpeta `frontend/`)
*   `yarn dev`: Inicia el servidor de desarrollo de Next.js.
*   `yarn build`: Compila el frontend para producción.
*   `yarn start`: Inicia el servidor de producción de Next.js.
*   `yarn lint`: Ejecuta el linter de Next.js.

---

## 🚧 Próximos Pasos y Mejoras

Siguiendo el flujo de negocio definido, las próximas mejoras planificadas incluyen:

1.  **Gestión de Cotizaciones:**
    *   **Backend:** Crear módulo (`QuotesModule`), servicio (`QuotesService`) y controlador (`QuotesController`) para la gestión CRUD de cotizaciones y sus estados (`Borrador`, `Enviada`, `Aceptada`, `Rechazada`, `Expirada`, `Facturada`).
    *   **Frontend:** Desarrollar la interfaz de usuario para crear, visualizar y gestionar cotizaciones.
2.  **Envío de Correos Electrónicos:**
    *   Integrar un servicio de envío de correos para poder enviar cotizaciones y otras comunicaciones.
3.  **Módulo de Facturación Electrónica:**
    *   Desarrollar la funcionalidad para generar facturas electrónicas a partir de las ventas confirmadas, considerando la normativa chilena (ej. integración con el SII).
4.  **Seguimiento de Pago / Conciliación:**
    *   Implementar un módulo para registrar y conciliar pagos.
5.  **Gestión de Entregas:**
    *   Desarrollar un sistema para gestionar el estado de la entrega de productos/servicios.
6.  **Reportes y Análisis:**
    *   Aprovechar la gestión de lotes para generar reportes de rentabilidad (COGS) y otros indicadores clave de rendimiento.
7.  **Mejoras en la Edición:**
    *   Implementar la lógica de edición para compras y ventas, considerando la complejidad de la gestión de lotes.
8.  **Optimización y Performance:**
    *   Implementar caching (ej. con Redis), optimización de consultas DB, compresión de assets, etc.
9.  **Seguridad Avanzada:**
    *   Implementar rate limiting, configuración de CORS, headers de seguridad, sanitización de datos, etc.
10. **Control de Crédito y Morosidad:**
    *   **SUGERENCIA:** Implementar una validación que impida generar nuevas ventas a clientes que tengan facturas vencidas o que hayan superado un límite de crédito predefinido.
11. **Testing y Calidad:**
    *   Aumentar la cobertura de pruebas unitarias, de integración y E2E.

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