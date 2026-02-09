# Artifact Platform – Comercio, ERP y Facturación en uno

Artifact es una plataforma SaaS pensada para pymes chilenas que necesitan vender online, controlar su operación y cumplir con el SII desde un solo panel.

## 🌐 Arquitectura de Producción

### Dominios y Servicios

| Servicio | Dominio Producción | Puerto Interno | Puerto Dev | Propósito |
|----------|-------------------|----------------|------------|-----------|
| **Storefront** | `artifact.cl` / `www.artifact.cl` | 3000 | 3001 | Landing + E-commerce |
| **Admin** | `app.artifact.cl` | 3000 | 3002 | Panel ERP |
| **Backend** | `api.artifact.cl` | 3000 | 3000 | API REST |
| **Chatwoot** | `chat.artifact.cl` | 3000 | - | Soporte en vivo |

### Estructura de Aplicaciones

```
artifact.cl (Storefront)
├─ / → Landing page marketing + E-commerce
├─ /products → Catálogo
├─ /login → Login clientes
└─ /cart, /checkout, /orders, etc.

app.artifact.cl (Admin)
├─ /login → Login staff
└─ / → Dashboard admin

api.artifact.cl (Backend)
└─ API REST + Swagger docs

chat.artifact.cl (Chatwoot)
└─ Soporte en vivo
```

### Apps Activas

**3 aplicaciones principales:**
- ✅ `apps/admin` - Panel administrativo ERP
- ✅ `apps/backend` - API NestJS
- ✅ `apps/storefront` - E-commerce + Marketing (consolidado)

**Eliminadas:**
- ❌ `apps/marketing` - Consolidado en Storefront (Feb 2026)

---

## 🚀 Mejoras de Producción Implementadas

### ✅ Health Checks (Febrero 2026)

Todos los servicios ahora tienen health checks configurados:

```yaml
# Ejemplo: Backend
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Beneficios:**
- Docker reinicia automáticamente contenedores no saludables
- Traefik solo rutea tráfico a instancias saludables
- Mejor visibilidad del estado del sistema

### ✅ Resource Limits (Febrero 2026)

Límites de CPU y memoria para prevenir crashes:

| Servicio | CPU Limit | Memory Limit | CPU Reserved | Memory Reserved |
|----------|-----------|--------------|--------------|-----------------|
| Backend | 1.0 | 1GB | 0.5 | 512MB |
| Admin | 0.5 | 512MB | 0.25 | 256MB |
| Storefront | 0.5 | 512MB | 0.25 | 256MB |
| Chatwoot App | 0.5 | 512MB | 0.25 | 256MB |
| PostgreSQL | 0.5 | 512MB | 0.25 | 256MB |
| Redis | 0.25 | 256MB | 0.1 | 128MB |

**Beneficios:**
- Previene que un servicio consuma todos los recursos del VPS
- Garantiza recursos mínimos para servicios críticos
- Mejor estabilidad general del sistema

### ✅ Restart Policies (Febrero 2026)

Políticas de reinicio configuradas:

```yaml
restart_policy:
  condition: on-failure
  delay: 5s
  max_attempts: 3
```

**Beneficios:**
- Recuperación automática de fallos temporales
- Evita loops infinitos de reinicio
- Reduce downtime

---

## 📊 Roadmap de Mejoras

### 🔴 Crítico (Implementar ASAP)

- [x] **Health Checks** - Implementado Feb 2026
- [x] **Resource Limits** - Implementado Feb 2026
- [x] **Restart Policies** - Implementado Feb 2026
- [ ] **Backups Automáticos** - Configurar backup diario de PostgreSQL
- [ ] **Monitoreo Básico** - Logs centralizados (Loki) + Métricas (Prometheus)

### 🟡 Importante (Próximas 2 semanas)

- [ ] **Alertas** - Notificaciones cuando servicios caen
- [ ] **CI/CD** - GitHub Actions para deploy automático
- [ ] **Staging Environment** - Ambiente de pruebas separado
- [ ] **Rate Limiting** - Protección contra abuso de API
- [ ] **SSL Monitoring** - Alertas de expiración de certificados

### 🟢 Mejoras (Cuando haya tiempo)

- [ ] **CDN** - CloudFlare para assets estáticos
- [ ] **Auto-scaling** - Escalar servicios según carga
- [ ] **Database Replicas** - Read replicas para mejor performance
- [ ] **Caching Layer** - Redis para cache de queries frecuentes
- [ ] **APM** - Application Performance Monitoring (New Relic/Datadog)

---

## 🔐 Seguridad

### Autenticación

**Storefront (Clientes):**
- Google OAuth
- Email + Password
- URL: `http://localhost:3001/login` (dev) / `https://artifact.cl/login` (prod)

**Admin (Staff):**
- Google OAuth
- Magic Link por email (sin password)
- URL: `http://localhost:3002/login` (dev) / `https://app.artifact.cl/login` (prod)

### RBAC (Control de Acceso Basado en Roles)

5 roles implementados:
- `SUPERADMIN` - Gestión de tenants y plataforma
- `ADMIN` - Gestión de empresa
- `EDITOR` - Crear/editar recursos
- `VIEWER` - Solo lectura
- `CLIENT` - Clientes del e-commerce

---

## 🎨 Branding (Febrero 2026)

### Nuevo Sistema de Logos

**Logos creados:**
- ✅ `logo-navbar.svg` - Logo principal con badge "ERP"
- ✅ `favicon.svg` - Favicon 512x512px
- ✅ `logo.svg` - Logo cuadrado para redes sociales

**Diseño:**
- Ícono en capas (representa 3 módulos del ERP)
- Verde brand: `#00e074`
- Badge "ERP" destacado
- Marca "CL" (Chile)

### Metadata SEO

```tsx
title: 'Artifact ERP - E-commerce + Admin + Facturación SII'
description: 'La plataforma completa para vender online en Chile. E-commerce profesional, panel admin y facturación electrónica SII integrada.'
```

---

## 💰 Modelo de Precios

**Sin plan gratuito** (costos reales de Facto API + VPS):

| Plan | Precio | Facturas SII | Destacado |
|------|--------|--------------|-----------|
| **Starter** | $49.990/mes | 50 incluidas | - |
| **Business** | $99.990/mes | 200 incluidas + $150 c/u adicional | ⭐ Más Popular |
| **Enterprise** | Desde $249.990/mes | Ilimitadas | - |

---

## 🚀 Deployment

### Desarrollo Local

```bash
# Levantar todo
npx turbo run dev

# O individual
cd apps/storefront && npm run dev  # Puerto 3001
cd apps/admin && npm run dev        # Puerto 3002
cd apps/backend && npm run dev      # Puerto 3000
```

### Producción (VPS con Docker Swarm)

```bash
# Build images
docker build -t ghcr.io/jalcayaga/artifacterp-backend:latest -f apps/backend/Dockerfile .
docker build -t ghcr.io/jalcayaga/artifacterp-admin:latest -f apps/admin/Dockerfile .
docker build -t ghcr.io/jalcayaga/artifacterp-storefront:latest -f apps/storefront/Dockerfile .

# Push to registry
docker push ghcr.io/jalcayaga/artifacterp-backend:latest
docker push ghcr.io/jalcayaga/artifacterp-admin:latest
docker push ghcr.io/jalcayaga/artifacterp-storefront:latest

# Deploy to VPS
docker stack deploy -c docker-compose.prod.yml artifact
```

### Variables de Entorno Requeridas

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
DIRECT_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=your-secret-here
JWT_EXPIRATION=1h

# URLs
STOREFRONT_URL=https://artifact.cl
ADMIN_URL=https://app.artifact.cl
NEXT_PUBLIC_API_URL=https://api.artifact.cl

# Chatwoot
CHATWOOT_DB_PASSWORD=secure-password
CHATWOOT_SECRET_KEY=your-secret-key

# Integrations (optional)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.example.com/webhook
NEXT_PUBLIC_CHATWOOT_TOKEN=your-token
```

---

## 📋 Cambios Recientes

### 2026-02-08 (Actualidad)

- ✅ **Consolidación Marketing → Storefront**: App Marketing eliminada, todo el contenido migrado a Storefront
- ✅ **Nuevo Branding**: Logo moderno con ícono en capas + favicon optimizado
- ✅ **Pricing Actualizado**: Eliminado plan gratuito, precios realistas ($49.990 - $249.990/mes)
- ✅ **Production Hardening**: Health checks, resource limits y restart policies implementados
- ✅ **Docker Compose Optimizado**: Eliminadas referencias a Marketing, configuración production-ready

### 2026-01-30

- ✅ **Admin UI Completo**: Implementación final de vistas para Ventas, Compras, Inventario y Facturación
- ✅ **Hub de Integraciones**: Nueva página `/integrations` para gestión de APIs (Facto, Webpay)
- ✅ **Corrección de Build**: Resolución de conflictos `use client` y migración a `lucide-react`
- ✅ **Estandarización UI**: Uso generalizado de `@artifact/ui`

---

## 📊 Métricas del Proyecto

**Código:**
- Módulos NestJS: 20
- Modelos Prisma: 16
- Migraciones: 15
- Apps activas: 3 (Admin, Backend, Storefront)

**Performance:**
- Build time Storefront: ~40s
- First Load JS: 87.2 kB
- Páginas generadas: 14

**Infraestructura:**
- Contenedores en producción: 7 (Backend, Admin, Storefront, Chatwoot x2, PostgreSQL, Redis)
- Health checks: 7/7 servicios
- Resource limits: 7/7 servicios

---

## 🧪 Reset de Datos

Para volver a un estado limpio:

```bash
./scripts/reset-db.sh
```

Usuarios creados por defecto:

| Email | Rol | Contraseña |
|-------|-----|------------|
| `superadmin@artifact.cl` | SUPERADMIN | `Artifact!2025` |
| `artifact@artifact.cl` | ADMIN | `Artifact!2025` |

---

## 📚 Documentación Adicional

- **API Docs**: `https://api.artifact.cl/docs` (Swagger)
- **Walkthrough**: Ver `/brain/walkthrough.md` para detalles de implementación
- **Arquitectura Multi-tenant**: Ver sección "Arquitectura Multiempresa" abajo

---

## 🔌 Integración con Facturación Electrónica (Facto.cl)

El sistema está integrado con **Facto.cl** para emisión de DTE:

- **API SOAP**: Comunicación con Facto.cl
- **Emisión Automática**: Al generar factura desde orden de venta
- **Trazabilidad**: Folio, URLs de PDF/XML almacenados en BD

---

## 🚀 Arquitectura Multiempresa

El ERP soporta multi-tenant desde el diseño:

- **CompanyContext (Frontend)**: Gestiona empresa activa, persiste en navegador
- **Seguridad por Empresa (Backend)**: Todas las queries filtradas por `companyId`
- **Aislamiento de Datos**: Garantizado a nivel de base de datos

---

## 🛠 Stack Tecnológico

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/ui
- Zustand (estado)
- React Query (cache)

### Backend
- NestJS
- TypeScript
- PostgreSQL + Prisma
- Redis (cache)
- JWT (auth)
- SOAP (Facto.cl)

### DevOps
- Docker + Docker Compose
- Traefik (reverse proxy)
- GitHub Container Registry
- Docker Swarm (orchestration)

---

## 📈 Flujo Comercial Completo

### 0. Onboarding SaaS Automático
1. Cliente se registra en `/tenants/register`
2. Se crea Tenant + Usuario ADMIN
3. Se genera Orden de Venta automática en "Artifact SPA"
4. Al confirmar pago → Factura emitida → Cuenta activa

### 1. Creación de Entidades
- Clientes/Proveedores con RUT, razón social, giro
- Productos/Servicios con SKU, precios, stock, lotes

### 2. Proceso de Cotización y Venta
1. Cotización generada → Enviada al cliente
2. Recepción de OC del cliente
3. Verificación de stock → Si no hay, iniciar compra
4. Despacho → Guía de despacho electrónica
5. Emisión de factura electrónica SII
6. Seguimiento de pago → Conciliación → Cierre

---

## 📊 Modelo de Datos

16 modelos principales:

### Core Multi-Tenant (2)
- `Tenant` - Entidades multi-tenant
- `TenantBranding` - Personalización visual

### Usuarios y Empresas (3)
- `User` - Con 5 roles
- `Company` - Clientes/proveedores
- `ContactPerson` - Contactos por empresa

### Catálogo e Inventario (2)
- `Product` - Productos/servicios
- `Lot` - Control de inventario FIFO

### Compras y Ventas (5)
- `Order` + `OrderItem` + `OrderItemLot`
- `Purchase` + `PurchaseItem`

### Cotizaciones y Facturación (4)
- `Quote` + `QuoteItem`
- `Invoice` + `InvoiceItem`

### Pagos (1)
- `Payment` - Registro de pagos

---

## 🏗 Estructura de Carpetas

```
artifactERP/
├── apps/
│   ├── backend/          # API NestJS
│   ├── admin/            # Panel ERP
│   └── storefront/       # E-commerce + Marketing
├── packages/
│   ├── ui/               # Componentes compartidos
│   ├── core/             # Lógica compartida
│   └── types/            # Tipos TypeScript
├── docker-compose.yml         # Dev
├── docker-compose.prod.yml    # Producción
├── turbo.json            # Turborepo config
└── README.md
```

---

## ⚙️ Scripts Útiles

```bash
# Desarrollo
yarn dev                  # Levantar todo
yarn build               # Build producción
yarn lint                # Linter

# Backend específico
yarn workspace @artifact/backend prisma migrate dev
yarn workspace @artifact/backend prisma studio

# Storefront específico
yarn workspace @artifact/storefront build
```

---

## 🔐 Seguridad y Autenticación: RBAC

Sistema completo de Control de Acceso Basado en Roles:

### Modelo de Datos
- `Role` - Conjunto de responsabilidades
- `Permission` - Acción atómica (ej: `create:product`)
- `RolePermission` - Asignación de permisos a roles

### Aplicación en Backend
- `PermissionsGuard` - Guardián global
- `@RequiredPermissions()` - Decorador para endpoints

**Ejemplo:**
```typescript
@Post()
@RequiredPermissions(Permission.CreateProduct)
create(@Body() createProductDto: CreateProductDto) {
  return this.productsService.create(createProductDto);
}
```

### Roles por Defecto
- `SUPER_ADMIN` - Acceso total
- `ADMIN` - Admin de tenant
- `EDITOR` - Crear/modificar
- `VIEWER` - Solo lectura
- `CLIENT` - Cliente e-commerce

---

## 🧪 Testing

### Backend (ejemplo)
```typescript
describe('ProductsService', () => {
  it('should return filtered products', async () => {
    const mockProducts = [/* ... */];
    jest.spyOn(prisma.product, 'findMany').mockResolvedValue(mockProducts);
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result).toEqual(mockProducts);
  });
});
```

### Frontend (ejemplo)
```typescript
describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Cámara IP WiFi HD')).toBeInTheDocument();
  });
});
```

---

## 📞 Soporte y Contacto

- **Email**: soporte@artifact.cl
- **Documentación**: https://docs.artifact.cl
- **Status Page**: https://status.artifact.cl

---

## 📄 Licencia

Propietario - Artifact SPA © 2025-2026
