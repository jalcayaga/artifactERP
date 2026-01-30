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
