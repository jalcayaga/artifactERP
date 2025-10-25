import type { CSSProperties } from 'react';

const containerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#111827',
  color: '#e5e7eb',
  textAlign: 'center',
  gap: '0.75rem',
};

export default function AdminPlaceholder() {
  return (
    <main style={containerStyle}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Dashboard en construcción</h1>
      <p style={{ maxWidth: 480, opacity: 0.85 }}>
        Estamos construyendo el panel administrativo inspirado en Hydrogen para gestionar múltiples tiendas desde Artifact.
      </p>
    </main>
  );
}
