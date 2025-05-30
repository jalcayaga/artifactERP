// app/register/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RegisterPage from '@/pages/RegisterPage'; 
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/custom-components/SplashScreen';

export default function RegisterPageWrapper() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin/dashboard'); 
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || (!isLoading && isAuthenticated)) {
    return <SplashScreen />;
  }

  return <RegisterPage onSwitchToLogin={handleSwitchToLogin} />;
}