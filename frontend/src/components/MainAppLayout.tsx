// frontend/src/components/MainAppLayout.tsx
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './DashboardView';
import ClientView from './ClientView';
import SalesView from './SalesView';
import PurchasesView from './PurchasesView';
import InventoryView from './InventoryView';
import FinanceView from './FinanceView';
import ReportsView from './ReportsView';
import SettingsView from './SettingsView';
import ProfileView from './ProfileView'; // For user profile
import { NAVIGATION_ITEMS, ERP_APP_NAME as APP_NAME } from '@/constants';

interface MainAppLayoutProps {
  initialPage: string;
}

const MainAppLayout: React.FC<MainAppLayoutProps> = ({ initialPage }) => {
  const [activePage, setActivePage] = useState(initialPage);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleNavigate = useCallback((pagePath: string) => {
    setActivePage(pagePath);
    setMobileSidebarOpen(false); // Close mobile sidebar on navigation
    // Potentially use react-router here if integrating later
    // history.pushState(null, '', `/${pagePath}`);
  }, []);

  // Optional: Update activePage if URL changes (e.g. browser back/forward)
  // This would be better handled by a router like React Router.
  // useEffect(() => {
  //   const handlePopState = () => {
  //     const path = window.location.pathname.substring(1) || initialPage;
  //     setActivePage(path);
  //   };
  //   window.addEventListener('popstate', handlePopState);
  //   return () => window.removeEventListener('popstate', handlePopState);
  // }, [initialPage]);


  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleSidebarCollapsed = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const renderActivePage = () => {
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
      case 'profile': // Added for user profile
        return <ProfileView />;
      default:
        return <DashboardView />; // Fallback to dashboard
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden"> {/* Ensure main app container uses bg-background */}
      <Sidebar
        navItems={NAVIGATION_ITEMS}
        activePage={activePage}
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
          onNavigateToPage={handleNavigate} // Pass navigation for profile/settings
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8"> {/* Ensure main content area uses bg-background */}
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default MainAppLayout;