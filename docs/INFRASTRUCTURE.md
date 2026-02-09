# Artifact ERP - Información de Infraestructura Actual

## 🗄️ Base de Datos

**Proveedor:** Supabase PostgreSQL  
**Región:** AWS US-East-2  
**Tipo:** Managed PostgreSQL con Connection Pooling

### Conexiones

```bash
# Connection Pooling (para aplicaciones)
DATABASE_URL=postgresql://postgres.igscuchfztqvzwtehqag:X4SSwd1NdSyqIoKm@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct Connection (para migraciones Prisma)
DIRECT_URL=postgresql://postgres.igscuchfztqvzwtehqag:X4SSwd1NdSyqIoKm@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**Notas:**
- Puerto 6543: Connection pooling (PgBouncer) - Usar para queries normales
- Puerto 5432: Conexión directa - Usar solo para migraciones Prisma
- No hay PostgreSQL local en Docker

---

## 🌐 Arquitectura de Producción

### Servicios Activos

| Servicio | Imagen | Dominio | Puerto Interno |
|----------|--------|---------|----------------|
| Backend | `ghcr.io/jalcayaga/artifacterp-backend:latest` | `api.artifact.cl` | 3000 |
| Admin | `ghcr.io/jalcayaga/artifacterp-admin:latest` | `app.artifact.cl` | 3000 |
| Storefront | `ghcr.io/jalcayaga/artifacterp-storefront:latest` | `artifact.cl` | 3000 |

### Red

- **Nombre:** `MangoNet` (Docker overlay network)
- **Tipo:** External (compartida con Traefik y otros servicios)

### Reverse Proxy

- **Traefik** maneja el routing de dominios a servicios
- Certificados SSL automáticos con Let's Encrypt
- Entry point: `websecure` (HTTPS)

---

## 🔧 Servicios Externos (Otros Stacks)

- **Chatwoot** - Stack separado (chat.artifact.cl)
- **Traefik** - Stack de infraestructura
- Posiblemente otros servicios en MangoNet

---

## 📊 Estado Actual (Febrero 2026)

### Aplicaciones

✅ **3 apps activas:**
- Backend (NestJS + Prisma)
- Admin (Next.js)
- Storefront (Next.js - consolidado con Marketing)

❌ **Eliminadas:**
- Marketing (consolidado en Storefront)

### Mejoras Recientes

- ✅ Health checks en todos los servicios
- ✅ Resource limits configurados
- ✅ Restart policies mejoradas
- ✅ Nuevo branding (logos + favicon)
- ✅ Pricing actualizado (sin plan gratuito)

---

## 🚀 Deployment

### GitHub Actions

- **Trigger:** Push a `main`
- **Build:** 3 imágenes (backend, admin, storefront)
- **Registry:** GitHub Container Registry (ghcr.io)
- **Deploy:** Manual en Portainer (por ahora)

### Portainer

- **Stack:** `artifact`
- **Compose:** `docker-compose.prod.yml` (con health checks y limits)
- **Update:** Manual via Web Editor

---

## 📝 Variables de Entorno Requeridas

Ver archivo `.env.production.example` en la raíz del proyecto.

**Críticas:**
- `DATABASE_URL` - Supabase connection pooling
- `DIRECT_URL` - Supabase direct connection
- `JWT_SECRET` - Autenticación
- `NEXT_PUBLIC_API_URL` - URL del backend

---

## 🔍 Verificación Rápida

```bash
# Ver servicios activos
docker service ls | grep artifact

# Ver logs
docker service logs artifact_backend --tail 50

# Ver health status
docker service ps artifact_backend
```

---

**Última actualización:** Febrero 2026  
**Mantenedor:** @jalcayaga
