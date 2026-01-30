// frontend/components/SettingsView.tsx
import React from 'react'
import Link from 'next/link' // Import Link for navigation
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CogIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  UsersIcon,
  BuildingOffice2Icon, // Import the new icon
} from '@/components/Icons'
import { useTheme } from '@/contexts/ThemeContext'

const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className='space-y-6 lg:space-y-8'>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configuración</h1>
      </div>

      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle className='text-lg flex items-center'>
            <PaintBrushIcon className='w-6 h-6 mr-3 text-primary' />
            Preferencias de Apariencia
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 pt-3'>
          <div className='flex items-center justify-between'>
            <span className='text-foreground'>Tema de la Aplicación</span>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
              >
                Claro
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
              >
                Oscuro
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle className='text-lg flex items-center'>
            <UsersIcon className='w-6 h-6 mr-3 text-primary' />
            Gestión de Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-1 pt-3'>
          <Link
            href='/admin/my-companies'
            className='w-full text-left flex items-center p-3 -m-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'
            aria-label='Gestionar mis empresas'
          >
            <BuildingOffice2Icon className='w-5 h-5 mr-3 text-muted-foreground' />
            <span className='text-foreground'>Gestionar Mis Empresas</span>
          </Link>
          <Link
            href='/admin/settings/users'
            className='w-full text-left flex items-center p-3 -m-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'
            aria-label='Gestionar usuarios del sistema'
          >
            <UsersIcon className='w-5 h-5 mr-3 text-muted-foreground' />
            <span className='text-foreground'>Gestionar Usuarios</span>
          </Link>
          <button
            onClick={() =>
              alert('Funcionalidad de Roles y Permisos en desarrollo.')
            }
            className='w-full text-left flex items-center p-3 -m-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'
            aria-label='Gestionar roles y permisos de los usuarios'
          >
            <ShieldCheckIcon className='w-5 h-5 mr-3 text-muted-foreground' />
            <span className='text-foreground'>Roles y Permisos</span>
          </button>
        </CardContent>
      </Card>

      <Card className='max-w-2xl'>
        <CardContent className='text-center py-12 px-4'>
          <CogIcon className='mx-auto h-12 w-12 text-muted-foreground opacity-40' />
          <h3 className='mt-3 text-xl font-semibold text-foreground'>
            Más Opciones de Configuración
          </h3>
          <p className='mt-1.5 text-sm text-muted-foreground'>
            Configuración de la empresa, integraciones, notificaciones, etc.
          </p>
          <p className='mt-1 text-sm text-muted-foreground italic'>
            (Funcionalidad en desarrollo)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsView