# Security & Quality Audit Report: Payments Module

**Date**: 2026-02-14
**Auditor**: automated_qa_engineer & security_quality_auditor

## 1. Static Analysis (PaymentsService & Controller)

### 🚨 Security Risks
*   **Env Variables**: `TBK_COMMERCE_CODE` and `TBK_API_KEY` are used directly. Verify these are not logged.
*   **Transaction Integrity**: `commitWebpayTransaction` relies on token. In a real scenario, we must verify the token matches the `buyOrder` stored in DB to prevent token replay or injection.
*   **Access Control**: `generateLink` is deprecated but still accessible to `EDITOR`. Should it be removed?
*   **Input Validation**: `create` method extracts `invoiceId` from body. Ensure `CreatePaymentDto` validates this is a valid UUID and belongs to the Tenant.

### 💎 Code Quality
*   **Complexity**: `create` Method handles payment creation AND invoice status update. Consider moving status logic to `InvoicesService` (Single Responsibility).
*   **Type Safety**: `(tenant?.settings as any)?.payments` usage is unsafe. Define a proper Interface for `TenantSettings`.
*   **Mocking**: Mercado Pago QR implementation is currently a Mock (`MOCK_QR_FOR_...`). This is technical debt that must be addressed before production.

## 2. Testing Status
*   **Unit Tests**: Needed for `PaymentsService` specifically for the status transition logic (Partially Paid -> Paid).

## 3. Recommendations
*   [ ] Implement `PaymentsService.verifyTransaction(token)` to cross-check with DB.
*   [ ] Create `TenantSettings` interface to avoid `as any`.
*   [ ] Add Unit Tests for `InvoiceStatus` calculation logic.
