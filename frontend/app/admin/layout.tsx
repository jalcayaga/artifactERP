

'use client';
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import MainAppLayout from '@/components/MainAppLayout';
import SplashScreen from '@/components/SplashScreen'; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login'); // Redirect to login if not authenticated and not loading
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    // Show a loading indicator or splash screen while checking auth or redirecting
    // Or null if you want the redirect to happen without showing anything briefly
    return <SplashScreen />; 
  }
  
  // Extract the current page from the pathname (e.g., 'dashboard' from '/admin/dashboard')
  // This is a simplified way to determine the initial page for MainAppLayout.
  // A more robust solution might involve context or more complex state management if MainAppLayout
  // needs to react to fine-grained route changes within itself.
  const segments = pathname.split('/').filter(Boolean);
  const initialPage = segments.length > 1 ? segments[segments.length -1] : 'dashboard';


  return <MainAppLayout initialPage={initialPage}>{children}</MainAppLayout>;
}