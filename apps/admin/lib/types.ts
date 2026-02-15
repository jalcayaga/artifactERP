export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface Branding {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface Company {
  id: string;
  name: string;
  fantasyName?: string;
  rut?: string;
  giro?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  isClient: boolean;
  isSupplier: boolean;
  createdAt: string;
  updatedAt: string;
}
