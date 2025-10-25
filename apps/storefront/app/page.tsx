import type { CSSProperties } from 'react';

const containerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  textAlign: 'center',
  flexDirection: 'column',
  gap: '0.75rem',
};

export default function StorefrontPlaceholder() {
  return (
    <main style={containerStyle}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Storefront en construcción</h1>
      <p style={{ maxWidth: 480, opacity: 0.8 }}>
        Esta aplicación se migrará a Hydrogen + Tailwind con soporte multiempresa.
      </p>
    </main>
  );
}
