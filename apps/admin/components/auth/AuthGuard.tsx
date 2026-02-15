'use client';

import React, { useEffect } from 'react';
import { useSupabaseAuth } from '@artifact/core/client';
import { useRouter, usePathname } from 'next/navigation';

// A simple loading spinner component
const SplashScreen = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-slate-950 fixed top-0 left-0 z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
    <div className="text-center absolute">
      <p className="text-lg font-semibold text-white">Cargando...</p>
    </div>
  </div>
);

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/auth-receive', '/forgot-password', '/auth/callback'];

import DashboardSkeleton from '../dashboard/DashboardSkeleton';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useSupabaseAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path is a public route
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    // If loading is finished and user is not authenticated
    if (!isLoading && !user) {
      // And we are not on a public route, then redirect to login
      if (!isPublicRoute) {
        router.push('/login');
      }
    }
  }, [isLoading, user, isPublicRoute, router, pathname]);

  // While loading authentication state, or redirecting, show the dashboard skeleton
  // This provides a much smoother experience than a spinner.
  if (isLoading || (!user && !isPublicRoute)) {
    return <DashboardSkeleton />;
  }

  // If authenticated, or if we are on a public route, show the content
  return <>{children}</>;
};

export default AuthGuard;
