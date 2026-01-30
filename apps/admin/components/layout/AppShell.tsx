'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@artifact/core';
import Sidebar from '@/components/admin/sidebar';
import AuthStatus from '@/components/auth/AuthStatus';

const AdminShell: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const showShell = isAuthenticated && pathname !== '/login';

  if (!showShell) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Artifact Admin
          </Link>
          <AuthStatus />
        </nav>
      </header>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Artifact ERP Admin</p>
      </footer>
    </div>
  );
};

export default AdminShell;
