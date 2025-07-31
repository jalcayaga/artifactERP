

'use client';
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Keep useRouter for auth redirect
import MainAppLayout from '@/components/MainAppLayout';
import SplashScreen from '@/components/SplashScreen'; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth(); // Removed currentUser as it's not used here
  const router = useRouter();
  // Removed pathname and segment logic as MainAppLayout no longer needs initialPage

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login'); // Redirect to login if not authenticated and not loading
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    // Show a loading indicator or splash screen while checking auth or redirecting
    return <SplashScreen />; 
  }
  
  // MainAppLayout no longer needs initialPage, just pass children
  return <MainAppLayout>{children}</MainAppLayout>;
}
