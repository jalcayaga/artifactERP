// components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext'; // Import useTheme
import { useAuth } from '@/contexts/AuthContext';   // Import useAuth
import { SearchIcon, BellIcon, SunIcon, MoonIcon, MenuIcon, UserCircleIcon, CogIcon, LogoutIcon, ChevronDownIcon } from '@/components/Icons';

interface HeaderProps {
  appName: string;
  onToggleMobileSidebar: () => void;
  sidebarCollapsed: boolean;
  onNavigateToPage: (page: string) => void; // For Profile/Settings navigation
}

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme(); // Use the hook

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
      aria-label={theme === 'light' ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
    >
      {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
    </button>
  );
};

interface UserMenuProps {
  onNavigateToPage: (page: string) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onNavigateToPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const auth = useAuth(); // Get auth context

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
    setIsOpen(false); // Close menu on logout
  };

  const handleProfileClick = () => {
    onNavigateToPage('profile');
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    onNavigateToPage('settings');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <UserCircleIcon className="w-7 h-7" />
        <ChevronDownIcon className="w-4 h-4 ml-1 opacity-70" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground rounded-md shadow-lg py-1 z-50 border">
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
          <button
            onClick={handleProfileClick}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <UserCircleIcon className="w-5 h-5 mr-2 opacity-70" /> Perfil
          </button>
          <button
            onClick={handleSettingsClick}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <CogIcon className="w-5 h-5 mr-2 opacity-70" /> Ajustes
          </button>
          <hr className="border-border my-1" />
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
             <LogoutIcon className="w-5 h-5 mr-2 opacity-70" /> Salir
          </button>
        </div>
      )}
    </div>
  );
}

const Header: React.FC<HeaderProps> = ({ appName, onToggleMobileSidebar, sidebarCollapsed, onNavigateToPage }) => {
  return (
    <header className="bg-card text-card-foreground shadow-sm sticky top-0 z-30 border-b"> {/* Use card for bg, add border-b */}
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
                className="block w-full pl-10 pr-3 py-2 border rounded-md leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm transition-colors"
                placeholder="Buscar..."
                type="search"
                name="search"
                aria-label="Campo de búsqueda"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <ThemeToggle />
            <button 
              className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
              aria-label="Notificaciones"
            >
              <BellIcon className="w-6 h-6" />
            </button>
            <UserMenu onNavigateToPage={onNavigateToPage} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;