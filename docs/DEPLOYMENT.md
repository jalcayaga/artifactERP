# 🚀 Guía de Deployment a VPS

Esta guía te explica cómo subir los cambios a tu VPS.

---

## 📋 Opciones de Deployment

Tienes **2 opciones** para hacer deploy:

### Opción 1: GitHub Actions (Automático) ⭐ Recomendado
### Opción 2: Manual (Script local)

---

## 🤖 Opción 1: GitHub Actions (Automático)

### Paso 1: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Agrega estos secrets:

```
NEXT_PUBLIC_API_URL=https://api.artifact.cl
NEXT_PUBLIC_ADMIN_URL=https://app.artifact.cl
NEXT_PUBLIC_API_BASE_URL=https://api.artifact.cl
NEXT_PUBLIC_CHATWOOT_TOKEN=tu_token_aqui
NEXT_PUBLIC_CHATWOOT_BASE_URL=https://chat.artifact.cl
NEXT_PUBLIC_N8N_WEBHOOK_URL=tu_webhook_url
```

### Paso 2: Push a main

```bash
git add .
git commit -m "feat: production hardening + marketing consolidation"
git push origin main
```

### Paso 3: Verificar Build

1. Ve a Actions en GitHub
2. Verás el workflow "Docker Image CI" ejecutándose
3. Espera a que termine (construye 3 imágenes: backend, admin, storefront)

### Paso 4: Deploy en VPS

**Conéctate a tu VPS:**
```bash
ssh root@tu-vps-ip
```

**Actualiza el stack:**
```bash
cd /ruta/donde/esta/docker-compose.prod.yml

# Pull las nuevas imágenes
docker pull ghcr.io/jalcayaga/artifacterp-backend:latest
docker pull ghcr.io/jalcayaga/artifacterp-admin:latest
docker pull ghcr.io/jalcayaga/artifacterp-storefront:latest

# Deploy
docker stack deploy -c docker-compose.prod.yml artifact

# Verificar
docker service ls | grep artifact
```

---

## 🔧 Opción 2: Manual (Script Local)

### Requisitos Previos

1. **GitHub Personal Access Token** con permiso `write:packages`
   - Crear en: https://github.com/settings/tokens
   - Guardar el token

2. **Docker instalado** localmente

### Paso 1: Configurar Token

```bash
export CR_PAT=tu_github_token_aqui
```

### Paso 2: Ejecutar Script

```bash
./scripts/deploy.sh
```

El script te pedirá:
- GitHub username (default: jalcayaga)
- VPS IP/hostname
- VPS username (default: root)

### Paso 3: Verificar

El script automáticamente:
1. ✅ Hace login en GitHub Container Registry
2. ✅ Construye las 3 imágenes (backend, admin, storefront)
3. ✅ Sube las imágenes al registry
4. ✅ Se conecta al VPS y hace deploy

---

## 🔍 Verificación Post-Deploy

### Verificar Servicios

```bash
# En el VPS
docker service ls | grep artifact

# Ver logs de un servicio
docker service logs artifact_backend --tail 50
docker service logs artifact_admin --tail 50
docker service logs artifact_storefront --tail 50
```

### Verificar Health

```bash
# Verificar que todos estén healthy
docker service ps artifact_backend
docker service ps artifact_admin
docker service ps artifact_storefront
```

### Probar Endpoints

```bash
# API
curl https://api.artifact.cl/health

# Storefront
curl -I https://artifact.cl

# Admin
curl -I https://app.artifact.cl
```

---

## 🐛 Troubleshooting

### Problema: Servicio no inicia

```bash
# Ver logs detallados
docker service logs artifact_backend --tail 100 --follow

# Ver eventos del servicio
docker service ps artifact_backend --no-trunc
```

### Problema: Health check falla

```bash
# Entrar al contenedor
docker exec -it $(docker ps -q -f name=artifact_backend) sh

# Probar health check manualmente
wget --quiet --tries=1 --spider http://localhost:3000/health
echo $?  # Debe ser 0
```

### Problema: Imagen no se actualiza

```bash
# Forzar pull
docker service update --force artifact_backend

# O eliminar y recrear
docker service rm artifact_backend
docker stack deploy -c docker-compose.prod.yml artifact
```

---

## 📊 Cambios en Este Deploy

### Eliminado
- ❌ App Marketing (consolidada en Storefront)

### Actualizado
- ✅ docker-compose.prod.yml con health checks
- ✅ Resource limits configurados
- ✅ Restart policies mejoradas
- ✅ Nuevo branding (logos)
- ✅ Pricing actualizado

### Nuevo
- ✅ Script de backup automático
- ✅ README completo
- ✅ Walkthrough detallado

---

## 🔄 Workflow Recomendado

### Para Cambios Pequeños
```bash
git add .
git commit -m "fix: descripción del cambio"
git push origin main
# GitHub Actions construye automáticamente
# Luego SSH al VPS y hacer docker stack deploy
```

### Para Cambios Grandes
1. Crear rama feature
2. Probar localmente
3. Merge a main
4. GitHub Actions construye
5. Deploy a VPS

---

## 📝 Checklist Pre-Deploy

- [ ] Código compilado localmente sin errores
- [ ] Variables de entorno actualizadas en VPS
- [ ] Backup de base de datos realizado
- [ ] GitHub Actions pasando (si usas opción 1)
- [ ] docker-compose.prod.yml actualizado en VPS

---

## 🆘 Rollback

Si algo sale mal:

```bash
# Ver versiones anteriores
docker image ls | grep artifacterp

# Volver a versión anterior (por SHA)
docker service update --image ghcr.io/jalcayaga/artifacterp-backend:sha-abc123 artifact_backend

# O hacer rollback completo
docker service rollback artifact_backend
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `docker service logs artifact_[servicio]`
2. Verifica health checks
3. Revisa el walkthrough.md para detalles de implementación
