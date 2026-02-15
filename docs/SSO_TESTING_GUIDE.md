# SSO Testing Guide - Artifact Platform

## Objetivo

Probar que el Single Sign-On (SSO) funciona correctamente entre Storefront y Admin usando Supabase Auth.

---

## Pre-requisitos

✅ Backend corriendo en `http://localhost:3333`  
✅ Storefront corriendo en `http://localhost:3000`  
✅ Admin corriendo en `http://localhost:3002`  
✅ JWT Secret configurado en backend  
✅ Usuario de prueba con `hasErpAccess: true` en Supabase

---

## Test 1: Login en Storefront → Acceso a Admin

### Paso 1: Login en Storefront

1. Abre el navegador en modo incógnito
2. Ve a `http://localhost:3000/login`
3. Inicia sesión con tu usuario (Google OAuth o Email/Password)
4. Deberías ser redirigido a `http://localhost:3000/account`

**✅ Verificar:**
- Dashboard de cuenta se muestra
- Stats se cargan correctamente
- Card "Artifact ERP" aparece (si tienes `hasErpAccess: true`)

### Paso 2: Obtener Token de Supabase

1. Abre DevTools (F12)
2. Ve a la consola y ejecuta:

```javascript
// Obtener el token actual
const getToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Access Token:', session?.access_token);
  console.log('User:', session?.user);
  return session?.access_token;
};

getToken();
```

3. Copia el `Access Token` que se muestra

### Paso 3: Probar Backend con Token

1. Abre una nueva terminal
2. Prueba el endpoint protegido del backend:

```bash
# Reemplaza YOUR_TOKEN con el token que copiaste
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/example/protected
```

**✅ Respuesta esperada:**
```json
{
  "message": "This is protected data",
  "user": {
    "id": "uuid-del-usuario",
    "email": "tu-email@example.com",
    "role": "admin"
  }
}
```

**❌ Si falla:**
- Verifica que el JWT Secret esté correcto
- Verifica que el token no haya expirado
- Revisa los logs del backend

### Paso 4: Acceder al Admin

1. En el mismo navegador (sin cerrar sesión), ve a `http://localhost:3002`
2. Deberías ser redirigido automáticamente al dashboard del admin **SIN pedir login**

**✅ Verificar:**
- No se muestra la página de login
- Dashboard del admin se carga
- Usuario está autenticado

**❌ Si pide login:**
- Verifica que ambas apps usen el mismo dominio Supabase
- Verifica que las cookies de Supabase se compartan
- Revisa la consola del navegador para errores

---

## Test 2: Login en Admin → Acceso a Storefront

### Paso 1: Cerrar Sesión

1. Cierra todas las pestañas
2. Abre navegador en modo incógnito

### Paso 2: Login en Admin

1. Ve a `http://localhost:3002/login`
2. Inicia sesión con Google OAuth o Magic Link
3. Deberías ser redirigido al dashboard del admin

### Paso 3: Acceder al Storefront

1. En el mismo navegador, ve a `http://localhost:3000/account`
2. Deberías ver tu cuenta **SIN pedir login**

**✅ Verificar:**
- No se muestra la página de login
- Dashboard de cuenta se carga
- Usuario está autenticado

---

## Test 3: Role-Based Access Control (RBAC)

### Paso 1: Probar Endpoint Admin-Only

```bash
# Con tu token de Supabase
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/example/admin
```

**✅ Si tienes role 'admin' o 'superadmin':**
```json
{
  "message": "This is admin-only data",
  "user": { ... }
}
```

**✅ Si NO tienes role admin:**
```json
{
  "statusCode": 403,
  "message": "User role 'customer' does not have permission. Required: admin, superadmin"
}
```

### Paso 2: Probar Endpoint Staff

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/example/staff-action \
  -X POST
```

**✅ Si tienes role 'staff', 'admin' o 'superadmin':**
```json
{
  "message": "Staff action performed successfully",
  "performedBy": "tu-email@example.com"
}
```

---

## Test 4: Token Refresh

### Paso 1: Esperar 1 hora (o forzar expiración)

Los tokens de Supabase expiran después de 1 hora por defecto.

### Paso 2: Verificar Auto-Refresh

1. Después de 1 hora, navega en la app
2. El token debería refrescarse automáticamente
3. No deberías ser deslogueado

**✅ Verificar en DevTools:**
```javascript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('✅ Token refreshed successfully');
  }
});
```

---

## Test 5: Logout Sincronizado

### Paso 1: Logout en Storefront

1. En `http://localhost:3000/account`, haz logout
2. Deberías ser redirigido a `/login`

### Paso 2: Verificar Logout en Admin

1. Ve a `http://localhost:3002`
2. Deberías ser redirigido a `/login` también

**✅ Verificar:**
- Ambas apps te piden login
- No hay sesión activa en ninguna

---

## Troubleshooting

### Error: "Invalid token"

**Causa:** JWT Secret incorrecto o token expirado

**Solución:**
1. Verifica `SUPABASE_JWT_SECRET` en `apps/backend/.env`
2. Obtén un nuevo token haciendo login nuevamente

### Error: "User not authenticated"

**Causa:** Token no se está enviando correctamente

**Solución:**
1. Verifica que el header `Authorization: Bearer TOKEN` esté presente
2. Revisa que el token no esté vacío

### Error: "User role does not have permission"

**Causa:** Usuario no tiene el role requerido

**Solución:**
1. Ve a Supabase Dashboard → Authentication → Users
2. Edita el usuario y actualiza `user_metadata`:
```json
{
  "role": "admin",
  "hasErpAccess": true,
  "tenantId": "artifact"
}
```

### SSO no funciona (pide login en ambas apps)

**Causa:** Cookies no se comparten entre apps

**Solución:**
1. Verifica que ambas apps usen el mismo `NEXT_PUBLIC_SUPABASE_URL`
2. Verifica que ambas apps usen el mismo `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. En desarrollo local, ambas apps deben estar en `localhost`

---

## Checklist de Verificación

- [ ] Login en Storefront funciona
- [ ] Login en Admin funciona
- [ ] Backend valida tokens de Supabase
- [ ] SSO funciona (Storefront → Admin)
- [ ] SSO funciona (Admin → Storefront)
- [ ] RBAC funciona (admin endpoints)
- [ ] RBAC funciona (staff endpoints)
- [ ] Token refresh automático funciona
- [ ] Logout sincronizado funciona
- [ ] User metadata se lee correctamente

---

## Resultados Esperados

Si todos los tests pasan:

✅ **SSO Completo** - Un solo login para todas las apps  
✅ **RBAC Funcional** - Permisos basados en roles  
✅ **Tokens Válidos** - Backend valida correctamente  
✅ **Auto-Refresh** - Sesiones persistentes  
✅ **Logout Sincronizado** - Seguridad mejorada

---

## Siguiente Paso

Una vez que todos los tests pasen, podemos proceder con:
- **Fase 4:** Database User Synchronization
- **Testing de Seguridad:** Penetration testing
- **Deployment:** Producción
