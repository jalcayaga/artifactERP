// frontend/components/SplashScreen.tsx
import React from 'react'
import { ERP_APP_NAME as APP_NAME } from '@/lib/constants'
import { CogIcon } from '@/components/Icons' // Using CogIcon as a generic loading indicator

const SplashScreen: React.FC = () => {
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center p-4'>
      <CogIcon className='w-16 h-16 text-primary animate-spin mb-6' />
      <h1 className='text-4xl font-bold text-foreground mb-2'>{APP_NAME}</h1>
      <p className='text-lg text-muted-foreground'>Cargando aplicación...</p>
    </div>
  )
}

export default SplashScreen
