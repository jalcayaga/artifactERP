
# SubRed ERP - Prototipo de Interfaz de Usuario y Backend

Bienvenido a SubRed ERP, un prototipo de sistema de planificación de recursos empresariales (ERP) desarrollado con un frontend moderno en React y un backend robusto en NestJS. Este proyecto tiene como objetivo mostrar una interfaz de usuario intuitiva y funcionalidades básicas de un ERP.

## Tecnologías Utilizadas

**Frontend:**
*   React 18 (con Hooks)
*   TypeScript
*   Next.js (Framework de React para producción con SSR, SSG, etc.)
*   Tailwind CSS (para estilos)
*   Chart.js (para gráficos, incluido vía CDN)

**Backend:**
*   NestJS (framework de Node.js para construir aplicaciones eficientes y escalables del lado del servidor)
*   TypeScript
*   Prisma (ORM para interactuar con la base de datos)
*   PostgreSQL (base de datos relacional)
*   JWT (JSON Web Tokens para autenticación)
*   Class-validator y class-transformer (para validación y transformación de DTOs)

**Base de Datos:**
*   PostgreSQL (gestionada a través de Docker Compose)

**Contenerización:**
*   Docker y Docker Compose (para la base de datos)

## Estructura de Carpetas

```
subred-erp/
├── frontend/                  # Código fuente del frontend Next.js
│   ├── app/                   # Rutas y layouts principales (App Router)
│   ├── components/            # Componentes reutilizables (UI y de lógica)
│   ├── contexts/              # Contextos de React
│   ├── lib/                   # Librerías, utilidades, servicios, tipos, constantes
│   ├── public/                # Archivos estáticos (ej. favicons, imágenes)
│   ├── package.json           # Dependencias y scripts del frontend
│   ├── next.config.js         # Configuración de Next.js
│   ├── tsconfig.json          # Configuración de TypeScript para el frontend
│   └── tailwind.config.js     # Configuración de Tailwind CSS
├── backend/                   # Código fuente del backend NestJS
│   ├── prisma/
│   ├── src/
│   └── ... (estructura del backend como antes)
├── docker-compose.yml         # Define el servicio de base de datos PostgreSQL
└── README.md                  # Este archivo
```

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:
*   [Node.js](https://nodejs.org/) (versión LTS recomendada, ej. v18 o v20)
*   [Yarn](https://yarnpkg.com/) (o [NPM](https://www.npmjs.com/), que viene con Node.js)
*   [Docker](https://www.docker.com/products/docker-desktop/)
*   [Docker Compose](https://docs.docker.com/compose/install/) (V2, usualmente viene con Docker Desktop. Comando: `docker compose`)

## Pasos para Levantar el Proyecto Localmente

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
*   **Propósito:** Este comando levanta el contenedor de la base de datos PostgreSQL.
*   **Verificación:** `docker ps`. Deberías ver `subred_db` (o el nombre definido en tu docker-compose.yml, ejemplo: `wolfflow_db` si no se ha cambiado el nombre del servicio de BD) corriendo.

### 3. Configurar y Ejecutar el Backend (NestJS)

*   **Ubicación:** Abre una **nueva terminal** y navega a la carpeta `backend`:
    ```bash
    cd backend
    ```
*   **Crear archivo `.env`:** Si no existe, créalo a partir de `backend/.env.example` (si se proporciona uno) o con el contenido mínimo (ajustar `DATABASE_URL` si el nombre del servicio de BD en `docker-compose.yml` cambió):
    ```env
    # backend/.env
    DATABASE_URL="postgresql://user:password@localhost:5432/subred_db?schema=public" # Asumiendo que la BD se llama subred_db
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
*   **Iniciar el servidor de desarrollo del backend:**
    ```bash
    yarn start:dev
    ```
    (o `npm run start:dev`)
*   **Resultado:** Tu backend estará corriendo en `http://localhost:3001`.

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
*   **Iniciar el servidor de desarrollo de Next.js:**
    ```bash
    yarn dev
    ```
    (o `npm run dev`)
*   **Resultado:** Tu frontend Next.js estará disponible en una URL como `http://localhost:3000`. Abre esta URL en tu navegador.

## Scripts Útiles

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

## Contribuciones y Futuras Mejoras
*   Implementación completa de módulos ERP.
*   Pruebas unitarias y E2E.
*   Seguridad avanzada.
*   Mejoras UI/UX.
*   Optimización.
*   Internacionalización (i18n).

¡Gracias por revisar SubRed ERP!
