# Cómo obtener el SUPABASE_JWT_SECRET correcto

## Problema
El backend está rechazando los tokens de Supabase porque el `SUPABASE_JWT_SECRET` configurado en `apps/backend/.env` **NO es el secreto correcto**.

El valor actual es:
```
SUPABASE_JWT_SECRET="1F74A46B-2686-4383-9795-26D01F2141A6"
```

Este es un UUID, pero el JWT Secret de Supabase es una cadena mucho más larga.

## Solución

### Paso 1: Obtener el JWT Secret desde Supabase Dashboard

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: **igscuchfztqvzwtehqag**
3. Ve a **Settings** (⚙️) en el menú lateral izquierdo
4. Haz clic en **API**
5. Busca la sección **JWT Settings**
6. Copia el valor de **JWT Secret** (es una cadena larga, algo como `eyJhbGc...` pero mucho más larga)

### Paso 2: Actualizar el .env del backend

1. Abre el archivo `apps/backend/.env`
2. Reemplaza la línea 13:
   ```
   SUPABASE_JWT_SECRET="1F74A46B-2686-4383-9795-26D01F2141A6"
   ```
   
   Con:
   ```
   SUPABASE_JWT_SECRET="<EL_SECRETO_QUE_COPIASTE>"
   ```

### Paso 3: Reiniciar el backend

1. Detén el servidor de desarrollo (Ctrl+C en la terminal donde corre `npx turbo run dev`)
2. Vuelve a ejecutar `npx turbo run dev`

### Paso 4: Probar

1. Recarga la página del admin (http://localhost:3002)
2. Inicia sesión
3. Deberías poder acceder al dashboard sin errores 401

## ¿Por qué está pasando esto?

Supabase firma todos los JWTs (tokens de autenticación) con un secreto específico de tu proyecto. El backend necesita usar **exactamente el mismo secreto** para validar que los tokens son legítimos.

Si el secreto no coincide, el backend rechaza todos los tokens con un error 401 Unauthorized, que es exactamente lo que está pasando ahora.
