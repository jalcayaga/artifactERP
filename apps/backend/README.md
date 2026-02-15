# Backend - ArtifactERP

Server-side application for ArtifactERP, built with NestJS and Prisma.

## Key Modules

### 1. Dispatches (Logistics)
Handles the creation and management of dispatch guides and stock movements.

*   **Service**: `DispatchesService`
*   **Controller**: `DispatchesController` (`/dispatches`)
*   **Key Features**:
    *   Creates `Dispatch` records from `Order`s.
    *   Automatically deducts stock from `Lot`s based on `OrderItem` reservations.
    *   Generates Dispatch Guides (PDF link - TODO).

### 2. Payments (Integrations)
Manages payment processing and integrations with external gateways.

*   **Service**: `PaymentsService`
*   **Controller**: `PaymentsController` (`/payments`)
*   **Integrations**:
    *   **Transbank Webpay Plus**: Full flow (Init + Commit).
    *   **Mercado Pago**: QR Code generation (Mocked for POS).
*   **Security**:
    *   Token validation pending for Transbank commit.
    *   Audited for secure environment variable handling.

### 3. Pricing
Manages price lists and product pricing logic.

*   **Controller**: `PricingController`
*   **Features**: Supports multiple price lists (Retail, Wholesale, Web).

### 4. DTE (Electronic Invoicing)
Handles communication with SII (Servicio de Impuestos Internos).

*   **Service**: `SiiService` / `DteSignerService`
*   **Features**:
    *   Authentication with SII using Digital Certificate on-the-fly.
    *   XML Signing (CAF/TED).

## Setup

1.  **Environment Variables**: Ensure `.env` is populated (DATABASE_URL, JWT_SECRET, TBK keys, etc.).
2.  **Prisma**: Run `npx prisma generate` to create the client.
3.  **Run**: `npm run dev` (starts on port 3001).

## Testing

Run unit tests:
```bash
npm run test
```
To test specific module:
```bash
npm run test -- src/dispatches
```
