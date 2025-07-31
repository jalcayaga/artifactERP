// components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';   
import ThemeToggle from '@/components/ThemeToggle'; 
import { SearchIcon, BellIcon, MenuIcon, UserCircleIcon, CogIcon, LogoutIcon, ChevronDownIcon } from '@/components/Icons';

interface HeaderProps {
  appName: string;
  onToggleMobileSidebar: () => void;
  sidebarCollapsed: boolean;
}

interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const auth = useAuth(); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    auth.logout();
    setIsOpen(false); 
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        id="user-menu-button"
      >
        <UserCircleIcon className="w-7 h-7" />
        <ChevronDownIcon className="w-4 h-4 ml-1 opacity-70" />
      </button>
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground rounded-md shadow-lg py-1 z-50 border"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          {auth.currentUser && (
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-foreground truncate">
                {auth.currentUser.firstName} {auth.currentUser.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {auth.currentUser.email}
              </p>
            </div>
          )}
          <Link
            href="/admin/profile"
            onClick={closeMenu}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
            role="menuitem"
          >
            <UserCircleIcon className="w-5 h-5 mr-2 opacity-70" /> Perfil
          </Link>
          <Link
            href="/admin/settings"
            onClick={closeMenu}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
            role="menuitem"
          >
            <CogIcon className="w-5 h-5 mr-2 opacity-70" /> Ajustes
          </Link>
          <hr className="border-border my-1" />
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
            role="menuitem"
          >
             <LogoutIcon className="w-5 h-5 mr-2 opacity-70" /> Salir
          </button>
        </div>
      )}
    </div>
  );
}

const Header: React.FC<HeaderProps> = ({ appName, onToggleMobileSidebar, sidebarCollapsed }) => {
  return (
    <header className="bg-background text-foreground sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={onToggleMobileSidebar}
              className="md:hidden mr-3 p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Abrir barra lateral"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
             <div className={`text-xl font-semibold text-primary ${!sidebarCollapsed ? 'md:hidden' : 'block'}`}>{appName}</div>
          </div>

          <div className="flex-1 max-w-xs ml-4 hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                className="block w-full pl-10 pr-16 py-2 border border-input rounded-md leading-5 bg-white dark:bg-slate-800 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm transition-colors"
                placeholder="Buscar..."
                type="search"
                name="search"
                aria-label="Campo de búsqueda"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="kbd kbd-sm">Ctrl K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
              aria-label="Notificaciones"
            >
              <BellIcon className="w-6 h-6" />
            </button>
            <ThemeToggle /> {/* Moved ThemeToggle here */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;