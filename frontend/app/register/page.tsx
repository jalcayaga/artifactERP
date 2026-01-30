'use client'
// frontend/app/register/page.tsx
import React, { useState, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ERP_APP_NAME as APP_NAME } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setError(null)
    setIsLoading(true)
    const result = await auth.register({ firstName, lastName, email, password })
    setIsLoading(false)
    if (!result.success) {
      setError(result.error || 'Error al registrarse. Por favor, inténtelo de nuevo.')
    } else {
      router.push('/login') // Redirect to login page after successful registration
    }
  }

  const inputBaseClass =
    'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none sm:text-sm transition-colors duration-150'
  const themeInputClass =
    'border-border bg-background text-foreground focus:ring-ring focus:border-ring'

  return (
    <div className='min-h-screen bg-background text-foreground flex relative overflow-hidden'>
      <AnimatedBackground />

      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8 z-10'>
        <div className='relative z-10 text-center text-white'>
          <img
            src='/logo.png'
            alt='Subred Logo'
            className='mx-auto h-28 w-auto mb-6'
          />
          <h2 className='text-4xl font-extrabold mb-4'>Crea tu cuenta</h2>
          <p className='text-lg'>Únete a nuestra plataforma</p>
        </div>
      </div>

      <div className='flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10'>
        <div className='max-w-md w-full space-y-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md text-center lg:hidden'>
            <img
              src='/logo.png'
              alt='Subred Logo'
              className='mx-auto h-20 w-auto'
            />
            <h2 className='mt-6 text-3xl font-extrabold text-foreground'>
              Crea tu cuenta
            </h2>
          </div>
          <div className='bg-card/80 backdrop-blur-sm text-card-foreground py-8 px-4 shadow-subtle dark:shadow-md sm:rounded-lg sm:px-10'>
            <form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-medium text-foreground'
                >
                  Nombre
                </label>
                <div className='mt-1'>
                  <input
                    id='firstName'
                    name='firstName'
                    type='text'
                    autoComplete='given-name'
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`${inputBaseClass} ${themeInputClass}`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='lastName'
                  className='block text-sm font-medium text-foreground'
                >
                  Apellido
                </label>
                <div className='mt-1'>
                  <input
                    id='lastName'
                    name='lastName'
                    type='text'
                    autoComplete='family-name'
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`${inputBaseClass} ${themeInputClass}`}
                  />
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
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-foreground'
                >
                  Contraseña
                </label>
                <div className='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='new-password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputBaseClass} ${themeInputClass}`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-foreground'
                >
                  Confirmar Contraseña
                </label>
                <div className='mt-1'>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    autoComplete='new-password'
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
              </div>
            </form>
            <p className='mt-8 text-center text-sm text-muted-foreground'>
              ¿Ya tienes una cuenta?{' '}
              <Link
                href='/login'
                className='font-medium text-cyan hover:text-cyan/80 dark:hover:text-cyan/70'
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage