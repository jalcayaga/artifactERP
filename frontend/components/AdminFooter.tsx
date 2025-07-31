// frontend/components/AdminFooter.tsx
import React from 'react';
import { ERP_APP_NAME } from '@/lib/constants';

const AdminFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-muted-foreground border-t border-border px-4 sm:px-6 lg:px-8 py-4 text-center text-xs">
      <p>
        &copy; {currentYear} {ERP_APP_NAME}. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default AdminFooter;
