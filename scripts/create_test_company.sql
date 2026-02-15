-- Script para crear empresa de prueba en Artifact ERP
-- Ejecutar este script en tu base de datos PostgreSQL

-- PASO 1: Verificar si ya existen empresas
SELECT * FROM companies;

-- PASO 2: Obtener el ID del usuario superadmin
-- Reemplaza 'superadmin@artifact.cl' con tu email si es diferente
SELECT id, email FROM users WHERE email = 'superadmin@artifact.cl';

-- PASO 3: Insertar empresa de prueba
-- IMPORTANTE: Reemplaza 'USER_ID_AQUI' con el ID obtenido en el paso 2
INSERT INTO companies (
    id,
    "userId",
    "tenantId",
    name,
    "fantasyName",
    rut,
    giro,
    address,
    city,
    state,
    zip,
    phone,
    email,
    "isClient",
    "isSupplier",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'USER_ID_AQUI',  -- REEMPLAZAR CON EL ID DEL USUARIO
    'artifact',      -- TenantId (debe coincidir con el del usuario)
    'Artifact Demo',
    'Artifact',
    '76.123.456-7',
    'Comercio electrónico y software',
    'Av. Providencia 1234',
    'Santiago',
    'Región Metropolitana',
    '7500000',
    '+56 2 2345 6789',
    'demo@artifact.cl',
    false,
    false,
    NOW(),
    NOW()
);

-- PASO 4: Verificar que la empresa se creó correctamente
SELECT * FROM companies WHERE email = 'demo@artifact.cl';

-- PASO 5 (ALTERNATIVA): Si prefieres usar el ID del usuario de Supabase directamente
-- Ejecuta esto si conoces el UUID del usuario de Supabase (b3977fc7-50bd-4f4b-a3d2-020b779848bc)
/*
INSERT INTO companies (
    id,
    "userId",
    "tenantId",
    name,
    "fantasyName",
    rut,
    giro,
    address,
    city,
    phone,
    email,
    "isClient",
    "isSupplier",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'b3977fc7-50bd-4f4b-a3d2-020b779848bc',
    'artifact',
    'Artifact Demo',
    'Artifact',
    '76.123.456-7',
    'Comercio electrónico y software',
    'Av. Providencia 1234',
    'Santiago',
    '+56 2 2345 6789',
    'demo@artifact.cl',
    false,
    false,
    NOW(),
    NOW()
);
*/
