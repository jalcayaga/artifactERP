// frontend/components/MainAppLayout.tsx
import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import AdminFooter from '@/components/AdminFooter' // Importar el nuevo AdminFooter
import { NAVIGATION_ITEMS, ERP_APP_NAME as APP_NAME } from '@/lib/constants'

interface MainAppLayoutProps {
  children: React.ReactNode
}

const MainAppLayout: React.FC<MainAppLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen)
  const toggleSidebarCollapsed = () =>
    setIsSidebarCollapsed(!isSidebarCollapsed)

  return (
    <div className='flex h-screen bg-background overflow-hidden'>
      <Sidebar
        navItems={NAVIGATION_ITEMS}
        appName={APP_NAME}
        isMobileOpen={isMobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        toggleCollapsed={toggleSidebarCollapsed}
      />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header
          appName={APP_NAME}
          onToggleMobileSidebar={toggleMobileSidebar}
          sidebarCollapsed={isSidebarCollapsed}
        />
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8'>
          {children}
        </main>
        <AdminFooter /> {/* Añadir el AdminFooter aquí */}
      </div>
    </div>
  )
}

export default MainAppLayout