// components/Header.tsx
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext' // Import useCompany
import ThemeToggle from '@/components/ThemeToggle'
import {
  SearchIcon,
  BellIcon,
  MenuIcon,
  UserCircleIcon,
  CogIcon,
  LogoutIcon,
  ChevronDownIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
} from '@/components/Icons'

interface HeaderProps {
  appName: string
  onToggleMobileSidebar: () => void
  sidebarCollapsed: boolean
}

interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { currentUser, logout } = useAuth()
  const { companies, activeCompany, switchCompany } = useCompany() // Use CompanyContext

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleCompanyChange = (companyId: string) => {
    switchCompany(companyId)
    setIsOpen(false)
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors'
        aria-expanded={isOpen}
        aria-haspopup='true'
        id='user-menu-button'
      >
        {currentUser?.profilePictureUrl ? (
          <img
            src={currentUser.profilePictureUrl}
            alt='User Profile'
            className='w-7 h-7 rounded-full object-cover'
          />
        ) : (
          <UserCircleIcon className='w-7 h-7' />
        )}
        <ChevronDownIcon className='w-4 h-4 ml-1 opacity-70' />
      </button>
      {isOpen && (
        <div
          className='absolute right-0 mt-2 w-64 bg-popover text-popover-foreground rounded-md shadow-lg py-1 z-50 border border-border/50'
          role='menu'
          aria-orientation='vertical'
          aria-labelledby='user-menu-button'
        >
          {currentUser && (
            <div className='px-4 py-3 border-b border-border/50'>
              <p className='text-sm font-medium text-foreground truncate'>
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className='text-xs text-muted-foreground truncate'>
                {currentUser.email}
              </p>
            </div>
          )}

          {activeCompany && (
            <div className='border-b border-border/50 py-2'>
              <div className='px-4 py-2 text-xs font-semibold text-muted-foreground'>
                EMPRESA ACTIVA
              </div>
              {companies.length > 1 ? (
                // Dropdown for multiple companies
                <div className='relative group'>
                  <div className='flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-primary/10 cursor-pointer'>
                    <div className='flex items-center'>
                      <BriefcaseIcon className='w-5 h-5 mr-2 opacity-70' />
                      <span className='font-medium'>{activeCompany.name}</span>
                    </div>
                    <ChevronDownIcon className='w-4 h-4 opacity-70' />
                  </div>
                  <div className='absolute left-0 right-0 mt-1 w-full bg-popover rounded-md shadow-lg z-10 hidden group-hover:block'>
                    {companies.map((company) => (
                      <button
                        key={company.id}
                        onClick={() => handleCompanyChange(company.id)}
                        className='w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/10'
                        disabled={activeCompany.id === company.id}
                      >
                        {company.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // Display for a single company
                <div className='flex items-center px-4 py-2 text-sm text-foreground'>
                  <BriefcaseIcon className='w-5 h-5 mr-2 opacity-70' />
                  <span className='font-medium'>{activeCompany.name}</span>
                </div>
              )}
            </div>
          )}

          <Link
            href='/admin/my-companies'
            onClick={closeMenu}
            className='w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary'
            role='menuitem'
          >
            <BuildingOffice2Icon className='w-5 h-5 mr-2 opacity-70' /> Mis Empresas
          </Link>
          <Link
            href='/admin/profile'
            onClick={closeMenu}
            className='w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary'
            role='menuitem'
          >
            <UserCircleIcon className='w-5 h-5 mr-2 opacity-70' /> Perfil
          </Link>
          <Link
            href='/admin/settings'
            onClick={closeMenu}
            className='w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary'
            role='menuitem'
          >
            <CogIcon className='w-5 h-5 mr-2 opacity-70' /> Ajustes
          </Link>
          <hr className='border-border/50 my-1' />
          <button
            onClick={handleLogout}
            className='w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive'
            role='menuitem'
          >
            <LogoutIcon className='w-5 h-5 mr-2 opacity-70' /> Salir
          </button>
        </div>
      )}
    </div>
  )
}

const Header: React.FC<HeaderProps> = ({
  appName,
  onToggleMobileSidebar,
  sidebarCollapsed,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault() // Prevent default browser behavior (e.g., opening search bar)
        searchInputRef.current?.focus()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  const notificationCount = 4; // Simulated notification count
  const simulatedNotifications = [
    { id: 1, message: 'Nueva factura #2024001 disponible.', time: 'Hace 5 min' },
    { id: 2, message: 'Cotización #Q003 aceptada por Cliente A.', time: 'Hace 1 hora' },
    { id: 3, message: 'Stock bajo para Producto X.', time: 'Ayer' },
    { id: 4, message: 'Nuevo usuario registrado: Juan Pérez.', time: 'Hace 2 días' },
  ];

  return (
    <header className='bg-background text-foreground sticky top-0 z-30'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <button
              onClick={onToggleMobileSidebar}
              className='md:hidden mr-3 p-2 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors'
              aria-label='Abrir barra lateral'
            >
              <MenuIcon className='w-6 h-6' />
            </button>
          </div>

          <div className='flex-1 max-w-xs ml-4 hidden sm:block md:max-w-md lg:max-w-lg'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <SearchIcon className='h-5 w-5 text-muted-foreground' />
              </div>
              <input
                ref={searchInputRef}
                className='block w-full pl-10 pr-16 py-2 border border-border rounded-md leading-5 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors'
                placeholder='Buscar...'
                type='search'
                name='search'
                aria-label='Campo de búsqueda'
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <kbd className='kbd kbd-sm'>Ctrl + K</kbd>
              </div>
            </div>
          </div>

          <div className='flex items-center space-x-2 sm:space-x-3'>
            <div className='relative' ref={notificationsRef}>
              <button
                className='p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors'
                aria-label='Notificaciones'
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BellIcon className='w-6 h-6' />
                {notificationCount > 0 && (
                  <span className='absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full'>
                    {notificationCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className='absolute right-0 mt-2 w-80 bg-popover text-popover-foreground rounded-md shadow-lg py-1 z-50 border border-border/50'>
                  <div className='px-4 py-2 font-semibold border-b border-border/50'>Notificaciones</div>
                  <ul className='divide-y divide-border/50'>
                    {simulatedNotifications.map((notification) => (
                      <li key={notification.id} className='px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer'>
                        <p className='text-sm'>{notification.message}</p>
                        <p className='text-xs text-muted-foreground'>{notification.time}</p>
                      </li>
                    ))}
                  </ul>
                  <div className='px-4 py-2 text-center border-t border-border/50'>
                    <Link href='/admin/notifications' className='text-sm text-primary hover:underline'>
                      Ver todas las notificaciones
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
