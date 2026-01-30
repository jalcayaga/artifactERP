'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@artifact/core';
import { useRouter, usePathname } from 'next/navigation';

// A simple loading spinner component
const SplashScreen = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-gray-100 fixed top-0 left-0 z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    <div className="text-center absolute">
        <p className="text-lg font-semibold">Cargando...</p>
    </div>
  </div>
);

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If loading is finished and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      // And we are not already on the login page, then redirect
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // While loading authentication state, show a splash screen
  if (isLoading) {
    return <SplashScreen />;
  }

  // If user is not authenticated and we are on a page other than login, splash screen is shown while redirect happens
  if (!isAuthenticated && pathname !== '/login') {
    return <SplashScreen />;
  }

  // If authenticated, or if we are on the login page, show the content
  return <>{children}</>;
};

export default AuthGuard;
