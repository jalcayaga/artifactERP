export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '60m', // Default to 1 hour
  multiTenant: {
    defaultTenantSlug: process.env.DEFAULT_TENANT_SLUG || 'artifact',
    headerKey: process.env.TENANT_HEADER_KEY || 'x-tenant-slug',
    rootDomain: process.env.ROOT_DOMAIN || undefined,
  },
})
