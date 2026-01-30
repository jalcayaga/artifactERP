// lib/api
export * from './lib/api';
export { default as fetchWithAuth } from './lib/fetchWithAuth';

// lib/types
export * from './lib/types';

// lib/utils
// Asumo que utils.ts exporta funciones, las exponemos aquí
// Si es necesario, se puede ser más selectivo
export * from './lib/utils';

// lib/constants
export * from './lib/constants';

// lib/json data
export { default as chileanRegions } from './lib/chilean_regions.json';
export { default as countries } from './lib/countries.json';


// contexts
export * from './contexts/AuthContext';
export * from './contexts/CompanyContext';
export * from './contexts/ThemeContext';
// CartContext es específico del storefront, por lo que no se exporta desde core.

// services
export * from './lib/services/apiService';
export * from './lib/services/authService';
export * from './lib/services/companyService';
export * from './lib/services/contactPersonService';
export * from './lib/services/dashboardService';
export * from './lib/services/invoiceService';
export * from './lib/services/orderService';
export * from './lib/services/paymentService';
export * from './lib/services/productService';
export * from './lib/services/purchaseOrderService';
export * from './lib/services/purchaseService';
export * from './lib/services/quoteService';
export * from './lib/services/saleService';
export * from './lib/services/supplierService';
export * from './lib/services/uploadService';
export * from './lib/services/userService';
