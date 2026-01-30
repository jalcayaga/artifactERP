'use client'
// frontend/app/login/page.tsx
import React, { useState, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ERP_APP_NAME as APP_NAME } from '@/lib/constants'
import { LockClosedIcon, GoogleIcon, MicrosoftIcon } from '@/components/Icons'
import { useRouter } from 'next/navigation' // For navigation
import Link from 'next/link' // For Link component
import AnimatedBackground from '@/components/AnimatedBackground' // Import the new component

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    const result = await auth.login({ email, password })
    setIsLoading(false)
    if (!result.success) {
      setError(
        result.error || 'Failed to login. Please check your credentials.'
      )
    } else {
      // Redirect based on whether the user needs to complete the setup
      if (result.needsSetup) {
        router.push('/setup')
      } else {
        router.push('/admin/dashboard')
      }
    }
  }

  const inputBaseClass =
    'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none sm:text-sm transition-colors duration-150'
  const themeInputClass =
    'border-border bg-background text-foreground focus:ring-ring focus:border-ring'

  return (
    <div className='min-h-screen bg-background text-foreground flex relative overflow-hidden'>
      {/* Moving background effect */}
      <AnimatedBackground />

      {/* Left side with logo and welcome message */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8 z-10'>
        <div className='relative z-10 text-center text-white'>
          <img
            src='/logo.png'
            alt='Subred Logo'
            className='mx-auto h-28 w-auto mb-6'
          />
          <h2 className='text-4xl font-extrabold mb-4'>Bienvenido de nuevo</h2>
          <p className='text-lg'>Inicia sesión en tu cuenta</p>
        </div>
      </div>

      {/* Right side with login form */}
      <div className='flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10'>
        <div className='max-w-md w-full space-y-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md text-center lg:hidden'>
            <img
              src='/logo.png'
              alt='Subred Logo'
              className='mx-auto h-20 w-auto'
            />
            <h2 className='mt-6 text-3xl font-extrabold text-foreground'>
              Bienvenido de nuevo
            </h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              Inicia sesión con tu cuenta
            </p>
          </div>
          <div className='bg-card/80 backdrop-blur-sm text-card-foreground py-8 px-4 shadow-subtle dark:shadow-md sm:rounded-lg sm:px-10'>
            <form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <button
                  type='button'
                  className='w-full flex justify-center items-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors'
                >
                  <GoogleIcon className='h-5 w-5 mr-2' />
                  Continuar con Google
                </button>
              </div>
              <div>
                <button
                  type='button'
                  className='w-full flex justify-center items-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors'
                >
                  <MicrosoftIcon className='h-5 w-5 mr-2' />
                  Continuar con Microsoft
                </button>
              </div>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-border' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-card text-muted-foreground'>o</span>
                </div>
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-foreground'
                >
                  Correo Electrónico
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputBaseClass} ${themeInputClass}`}
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-foreground'
                  >
                    Contraseña
                  </label>
                  <div className='text-sm'>
                    <Link
                      href='/forgot-password'
                      className='font-medium text-cyan hover:text-cyan/80 dark:hover:text-cyan/70'
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>
                <div className='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputBaseClass} ${themeInputClass}`}
                  />
                </div>
              </div>

              {error && (
                <div className='rounded-md bg-destructive/10 p-4'>
                  <div className='flex'>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-destructive'>
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors'
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </div>
            </form>
            <p className='mt-8 text-center text-sm text-muted-foreground'>
              ¿No tienes una cuenta?{' '}
              <Link
                href='/register'
                className='font-medium text-cyan hover:text-cyan/80 dark:hover:text-cyan/70'
              >
                Regístrate ahora
              </Link>
            </p>
            <p className='mt-4 text-center text-xs text-muted-foreground'>
              Al continuar, aceptas los{' '}
              <Link href='#' className='underline'>
                Términos de Servicio
              </Link>{' '}
              y la{' '}
              <Link href='#' className='underline'>
                Política de Privacidad
              </Link>{' '}
              de SubRed Ingeniría.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
