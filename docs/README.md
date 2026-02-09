# 📚 Artifact ERP - Documentación

Toda la documentación del proyecto está organizada en esta carpeta.

## 📋 Índice

### Deployment
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de deployment (GitHub Actions y manual)
- **[PORTAINER.md](./PORTAINER.md)** - Configuración de Portainer con webhooks

### Instrucciones Completas
- **[INSTRUCCIONES_COMPLETAS.md](./INSTRUCCIONES_COMPLETAS.md)** - Documentación histórica completa

---

## 🚀 Quick Start

**Para hacer deploy:**
1. Lee [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Configura Portainer según [PORTAINER.md](./PORTAINER.md)
3. Usa las variables de entorno de `/.env.production.example`

**Para desarrollo local:**
1. Lee el [README.md](../README.md) principal
2. Ejecuta `npx turbo run dev`

---

## 🗂️ Estructura del Proyecto

```
artifactERP/
├── docs/              # 📚 Documentación (estás aquí)
├── apps/              # 🚀 Aplicaciones
│   ├── backend/       # API NestJS
│   ├── admin/         # Panel ERP
│   └── storefront/    # E-commerce + Marketing
├── packages/          # 📦 Paquetes compartidos
│   ├── core/          # Lógica compartida
│   └── ui/            # Componentes UI
└── scripts/           # 🛠️ Scripts de utilidad
```

---

## 📊 Stack Tecnológico

- **Backend**: NestJS + Prisma + Supabase PostgreSQL
- **Frontend**: Next.js 14 + TailwindCSS + Shadcn/ui
- **Deployment**: Docker Swarm + Traefik + Portainer
- **CI/CD**: GitHub Actions
