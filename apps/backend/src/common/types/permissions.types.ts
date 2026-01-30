export enum Permission {
  // Roles
  CreateRole = 'create:role',
  ReadRoles = 'read:roles',
  UpdateRole = 'update:role',
  DeleteRole = 'delete:role',

  // Permissions
  CreatePermission = 'create:permission',
  ReadPermissions = 'read:permissions',
  UpdatePermission = 'update:permission',
  DeletePermission = 'delete:permission',

  // Users
  CreateUser = 'create:user',
  ReadUsers = 'read:users',
  UpdateUser = 'update:user',
  DeleteUser = 'delete:user',

  // Products
  CreateProduct = 'create:product',
  ReadProducts = 'read:products',
  UpdateProduct = 'update:product',
  DeleteProduct = 'delete:product',

  // Orders
  CreateOrder = 'create:order',
  ReadOrders = 'read:orders',
  UpdateOrder = 'update:order',
  DeleteOrder = 'delete:order',

  // Invoices
  CreateInvoice = 'create:invoice',
  ReadInvoices = 'read:invoices',
  UpdateInvoice = 'update:invoice',
  DeleteInvoice = 'delete:invoice',

  // Tenants (Super Admin only)
  CreateTenant = 'create:tenant',
  ReadTenants = 'read:tenants',
  UpdateTenant = 'update:tenant',
  DeleteTenant = 'delete:tenant',
}
