# 🐳 Portainer + GitHub Actions - Guía de Configuración

Esta guía te explica cómo configurar Portainer para que se actualice automáticamente cuando GitHub Actions construya nuevas imágenes.

---

## 🎯 Arquitectura

```
GitHub Actions → Build Images → GitHub Container Registry
                                        ↓
                                   Portainer Webhook
                                        ↓
                                   Pull & Redeploy
```

---

## 📋 Opción 1: Webhooks de Portainer (Recomendado)

### Paso 1: Crear Webhooks en Portainer

1. **Accede a Portainer:**
   - URL: `https://portainer.tu-vps.com` (o IP:9000)
   - Login con tus credenciales

2. **Para cada servicio (Backend, Admin, Storefront):**

   a. Ve a **Stacks** → Selecciona tu stack `artifact`
   
   b. Click en el servicio (ej: `artifact_backend`)
   
   c. Scroll hasta **Service webhooks**
   
   d. Click en **Add webhook**
   
   e. Copia la URL del webhook (algo como):
      ```
      https://portainer.tu-vps.com/api/webhooks/xxx-xxx-xxx
      ```

3. **Guarda los 3 webhooks:**
   ```
   BACKEND_WEBHOOK=https://portainer.tu-vps.com/api/webhooks/xxx-backend-xxx
   ADMIN_WEBHOOK=https://portainer.tu-vps.com/api/webhooks/xxx-admin-xxx
   STOREFRONT_WEBHOOK=https://portainer.tu-vps.com/api/webhooks/xxx-storefront-xxx
   ```

---

### Paso 2: Agregar Webhooks a GitHub Secrets

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Agrega cada uno:

   ```
   Name: PORTAINER_WEBHOOK_BACKEND
   Value: https://portainer.tu-vps.com/api/webhooks/xxx-backend-xxx
   ```

   ```
   Name: PORTAINER_WEBHOOK_ADMIN
   Value: https://portainer.tu-vps.com/api/webhooks/xxx-admin-xxx
   ```

   ```
   Name: PORTAINER_WEBHOOK_STOREFRONT
   Value: https://portainer.tu-vps.com/api/webhooks/xxx-storefront-xxx
   ```

---

### Paso 3: Actualizar GitHub Actions Workflow

El workflow ya está actualizado en `.github/workflows/docker-image.yml`, pero aquí está la parte clave que necesitas agregar:

```yaml
# Al final del job build-and-push, después de Build and push Docker image

- name: Trigger Portainer Webhook
  if: matrix.service == 'backend'
  run: |
    curl -X POST ${{ secrets.PORTAINER_WEBHOOK_BACKEND }}

- name: Trigger Portainer Webhook
  if: matrix.service == 'admin'
  run: |
    curl -X POST ${{ secrets.PORTAINER_WEBHOOK_ADMIN }}

- name: Trigger Portainer Webhook
  if: matrix.service == 'storefront'
  run: |
    curl -X POST ${{ secrets.PORTAINER_WEBHOOK_STOREFRONT }}
```

---

## 📋 Opción 2: Watchtower (Automático sin webhooks)

Si prefieres que los contenedores se actualicen automáticamente sin webhooks:

### Paso 1: Agregar Watchtower al docker-compose.prod.yml

```yaml
services:
  # ... tus servicios existentes ...

  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_POLL_INTERVAL=300  # Revisa cada 5 minutos
      - WATCHTOWER_CLEANUP=true       # Limpia imágenes viejas
      - WATCHTOWER_INCLUDE_STOPPED=false
      - WATCHTOWER_LABEL_ENABLE=true  # Solo actualiza contenedores con label
    networks:
      - MangoNet
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
```

### Paso 2: Agregar Labels a tus Servicios

En cada servicio que quieras auto-actualizar:

```yaml
backend:
  image: ghcr.io/jalcayaga/artifacterp-backend:latest
  labels:
    - "com.centurylinklabs.watchtower.enable=true"
  # ... resto de la config ...
```

**Ventajas:**
- ✅ Completamente automático
- ✅ No necesitas webhooks

**Desventajas:**
- ⚠️ Actualiza sin control manual
- ⚠️ Puede causar downtime inesperado

---

## 🔧 Opción 3: Script Manual en VPS

Si prefieres control total, crea un script en el VPS:

### Paso 1: Crear Script de Update

```bash
# En el VPS
nano /root/update-artifact.sh
```

```bash
#!/bin/bash

set -e

echo "🔄 Updating Artifact ERP..."

# Pull latest images
echo "📦 Pulling images..."
docker pull ghcr.io/jalcayaga/artifacterp-backend:latest
docker pull ghcr.io/jalcayaga/artifacterp-admin:latest
docker pull ghcr.io/jalcayaga/artifacterp-storefront:latest

# Update services
echo "🚀 Updating services..."
docker service update --image ghcr.io/jalcayaga/artifacterp-backend:latest artifact_backend
docker service update --image ghcr.io/jalcayaga/artifacterp-admin:latest artifact_admin
docker service update --image ghcr.io/jalcayaga/artifacterp-storefront:latest artifact_storefront

echo "✅ Update complete!"
docker service ls | grep artifact
```

### Paso 2: Hacer Ejecutable

```bash
chmod +x /root/update-artifact.sh
```

### Paso 3: Ejecutar Después de GitHub Actions

```bash
# Localmente, después de que GitHub Actions termine
ssh root@tu-vps "/root/update-artifact.sh"
```

---

## 🎯 Recomendación

**Para tu caso, recomiendo Opción 1 (Webhooks de Portainer):**

✅ **Ventajas:**
- Control total desde Portainer UI
- Actualización automática después de build
- Puedes ver logs y estado en Portainer
- Rollback fácil si algo falla

❌ **Desventajas:**
- Requiere configuración inicial de webhooks

---

## 📝 Workflow Completo Recomendado

1. **Desarrollas localmente**
2. **Haces commit y push a main**
3. **GitHub Actions se activa automáticamente:**
   - Construye 3 imágenes (backend, admin, storefront)
   - Sube a GitHub Container Registry
   - Llama a webhooks de Portainer
4. **Portainer recibe webhook:**
   - Pull de nueva imagen
   - Redeploy del servicio
   - Health check automático
5. **Verificas en Portainer** que todo esté OK

---

## 🔍 Verificación

### Después de cada deploy:

```bash
# SSH al VPS
ssh root@tu-vps

# Ver servicios
docker service ls | grep artifact

# Ver logs
docker service logs artifact_backend --tail 50
docker service logs artifact_admin --tail 50
docker service logs artifact_storefront --tail 50

# Ver health status
docker service ps artifact_backend
```

---

## 🐛 Troubleshooting

### Webhook no funciona

1. **Verifica que el webhook esté activo en Portainer**
2. **Prueba manualmente:**
   ```bash
   curl -X POST https://portainer.tu-vps.com/api/webhooks/xxx-xxx-xxx
   ```
3. **Revisa logs de Portainer**

### Servicio no se actualiza

1. **Verifica que la imagen se subió a GHCR:**
   - Ve a GitHub → Packages
   - Busca `artifacterp-backend`, `artifacterp-admin`, `artifacterp-storefront`

2. **Pull manual:**
   ```bash
   docker pull ghcr.io/jalcayaga/artifacterp-backend:latest
   ```

3. **Update manual:**
   ```bash
   docker service update --force artifact_backend
   ```

---

## 📊 Próximos Pasos

1. ✅ Configurar webhooks en Portainer
2. ✅ Agregar secrets en GitHub
3. ✅ Actualizar workflow (archivo incluido abajo)
4. ✅ Hacer push de prueba
5. ✅ Verificar que todo funcione

---

¿Necesitas ayuda con algún paso específico?
