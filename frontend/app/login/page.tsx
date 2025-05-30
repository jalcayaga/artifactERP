// app/login/page.tsx
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPage from '@/pages/LoginPage'; 
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/custom-components/SplashScreen';

export default function LoginPageWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  const handleSwitchToRegister = () => {
    router.push('/register');
  };
  
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirectUrl);
    }
  }, [isLoading, isAuthenticated, router, searchParams]);

  if (isLoading || (!isLoading && isAuthenticated)) {
    return <SplashScreen />;
  }

  return <LoginPage onSwitchToRegister={handleSwitchToRegister} />;
}