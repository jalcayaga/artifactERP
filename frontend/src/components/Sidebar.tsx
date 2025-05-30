// components/Sidebar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from '@/icons';

interface SidebarProps {
  navItems: NavItem[];
  appName: string;
  isMobileOpen: boolean;
  setMobileOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  navItems, appName, 
  isMobileOpen, setMobileOpen, isCollapsed, toggleCollapsed 
}) => {
  const pathname = usePathname();
  
  const sidebarContent = (
    <>
      <div className={`flex items-center mb-8 px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="text-2xl font-bold text-primary">{appName}</Link>
        )}
        <button 
            onClick={toggleCollapsed} 
            className="hidden md:block p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
        >
            {isCollapsed ? <ChevronRightIcon className="w-6 h-6" /> : <ChevronLeftIcon className="w-6 h-6" />}
        </button>
        <button 
            onClick={() => setMobileOpen(false)} 
            className="md:hidden p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Cerrar barra lateral"
        >
            <XIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path));
            return (
              <li key={item.path} className="mb-1">
                <Link
                  href={item.path}
                  className={`w-full flex items-center py-3 px-4 rounded-md transition-all duration-200 ease-in-out
                              ${isActive
                                  ? 'bg-primary text-primary-foreground shadow-md' 
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                              ${isCollapsed ? 'justify-center' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className={`w-6 h-6 ${!isCollapsed ? 'mr-3' : ''}`} />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-40 flex md:hidden transition-transform duration-300 ease-in-out 
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileOpen}
      >
        <div className="w-64 bg-card text-card-foreground flex flex-col p-4 shadow-lg">
          {sidebarContent}
        </div>
        <div 
          className="flex-1 bg-black opacity-50" 
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        ></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-card text-card-foreground p-4 shadow-lg transition-all duration-300 ease-in-out
                         ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;