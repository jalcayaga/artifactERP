// frontend/components/MainAppLayout.tsx
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar'; 
import Header from '@/components/Header'; 
import DashboardView from '@/components/DashboardView'; 
import ClientView from '@/components/ClientView'; 
import SalesView from '@/components/SalesView'; 
import PurchasesView from '@/components/PurchasesView'; 
import InventoryView from '@/components/InventoryView'; 
import FinanceView from '@/components/FinanceView'; 
import ReportsView from '@/components/ReportsView'; 
import SettingsView from '@/components/SettingsView'; 
import ProfileView from '@/components/ProfileView'; 
import { NAVIGATION_ITEMS, ERP_APP_NAME as APP_NAME } from '@/lib/constants'; 

interface MainAppLayoutProps {
  initialPage: string;
  children?: React.ReactNode; // Added to support children prop for Next.js layouts
}

const MainAppLayout: React.FC<MainAppLayoutProps> = ({ initialPage, children }) => {
  const [activePage, setActivePage] = useState(initialPage);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleNavigate = useCallback((pagePath: string) => {
    const pageName = pagePath.startsWith('/admin/') ? pagePath.substring(7) : pagePath;
    setActivePage(pageName);
    setMobileSidebarOpen(false); 
  }, []);

  // Effect to synchronize activePage if initialPage changes due to routing
  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);


  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleSidebarCollapsed = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const renderActivePage = () => {
    // If children are provided by Next.js layout, render them directly
    if (children) {
      return children;
    }
    // Fallback to switch-based rendering if no children (e.g. if used outside Next.js layout pattern)
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'clients':
        return <ClientView />;
      case 'sales':
        return <SalesView />;
      case 'purchases':
        return <PurchasesView />;
      case 'inventory':
        return <InventoryView />;
      case 'finance':
        return <FinanceView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'profile': 
        return <ProfileView />;
      default:
        return <DashboardView />; 
    }
  };

  const activeFullPath = NAVIGATION_ITEMS.find(item => item.path.endsWith(activePage))?.path || `/admin/${initialPage}`;


  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        navItems={NAVIGATION_ITEMS}
        activePage={activeFullPath} 
        onNavigateToPage={handleNavigate}
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
          onNavigateToPage={handleNavigate} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default MainAppLayout;