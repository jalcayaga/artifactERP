# Admin Frontend - ArtifactERP

Next.js application for the administration panel of ArtifactERP.

## Key Views

### 1. POS (Point of Safe)
Advanced Point of Sale interface.
*   **Features**:
    *   Real-time product search.
    *   Multiple payment methods (Cash, Card, Transfer).
    *   Integration with Electronic Scale (Mocked/Serial).
    *   **Contingency Mode**: Offline capabilities (Sync pending).

### 2. Logistics (Dispatches)
Management of dispatch guides.
*   **Route**: `/admin/dispatches/[id]`
*   **Features**:
    *   View details of a Dispatch (Origin, Destination, Courier).
    *   List of items in the dispatch.
    *   Status tracking.

### 3. Sales & Orders
Manage sales orders and invoices.
*   **Components**: `SaleDetailModal`
*   **Features**:
    *   Generate Dispatch Guide directly from Sale Detail.
    *   View Payment status.

## Technologies

*   **Framework**: Next.js 14 (App Router).
*   **Styling**: Tailwind CSS + Shadcn UI.
*   **State**: React Query / Context API.
*   **Forms**: React Hook Form + Zod.

## Setup

1.  **Dependencies**: `npm install`.
2.  **Run**: `npm run dev` (starts on port 3000).
