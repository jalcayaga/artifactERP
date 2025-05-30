// app/(admin)/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/custom-components/Sidebar';
import Header from '@/custom-components/Header';
import { NAVIGATION_ITEMS, ERP_APP_NAME as APP_NAME } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/custom-components/SplashScreen';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login'); 
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Close mobile sidebar on page navigation
    setMobileSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return <SplashScreen />;
  }

  // If not loading and not authenticated, SplashScreen is shown while router.push takes effect
  // or if the redirect hasn't happened yet.
  if (!isAuthenticated) {
    return <SplashScreen />; 
  }

  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleSidebarCollapsed = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        navItems={NAVIGATION_ITEMS}
        appName={APP_NAME}
        isMobileOpen={isMobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        toggleCollapsed={toggleSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          appName={APP_NAME}
          onToggleMobileSidebar={toggleMobileSidebar}
          sidebarCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}