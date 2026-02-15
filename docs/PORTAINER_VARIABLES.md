# 🚀 Variables de Entorno para Portainer

Copia estas variables exactamente como están en Portainer:

**Portainer → Stacks → artifact → Editor → Environment variables**

---

## Variables a Agregar

```
DATABASE_URL
```
Valor:
```
postgresql://postgres.igscuchfztqvzwtehqag:X4SSwd1NdSyqIoKm@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

```
DIRECT_URL
```
Valor:
```
postgresql://postgres.igscuchfztqvzwtehqag:X4SSwd1NdSyqIoKm@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

---

```
JWT_SECRET
```
Valor:
```
super-secret-jwt-key-change-me
```

---

```
JWT_EXPIRATION
```
Valor:
```
7d
```

---

```
STOREFRONT_URL
```
Valor:
```
https://artifact.cl
```

---

```
ADMIN_URL
```
Valor:
```
https://app.artifact.cl
```

---

```
NEXT_PUBLIC_API_URL
```
Valor:
```
https://api.artifact.cl
```

---

```
PORT
```
Valor:
```
3000
```

---

## 📋 Checklist

- [ ] Agregar las 8 variables en Portainer
- [ ] Verificar que el YAML sea el de `docker-compose.prod.yml`
- [ ] Marcar "Re-pull image and redeploy"
- [ ] Click "Update the stack"
- [ ] Esperar a que los servicios estén "Running"
- [ ] Probar https://artifact.cl
- [ ] Probar https://app.artifact.cl
- [ ] Probar https://api.artifact.cl/api/docs

---

**Nota:** Mientras GitHub Actions construye las imágenes, puedes ir configurando esto en Portainer para estar listo.
