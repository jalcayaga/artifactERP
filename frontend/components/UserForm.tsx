import React, { useState, useEffect, FormEvent } from 'react'
import { User, UserRole } from '@/lib/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { UsersIcon } from '@/components/Icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface UserFormProps {
  userData: User | null
  onSave: (user: User) => void
  onCancel: () => void
}

const roleDisplayNames: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.EDITOR]: 'Editor',
  [UserRole.VIEWER]: 'Visualizador',
  [UserRole.CLIENT]: 'Cliente',
};

const UserForm: React.FC<UserFormProps> = ({ userData, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.VIEWER)
  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const isEditing = !!userData

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName)
      setLastName(userData.lastName)
      setEmail(userData.email)
      setRole(userData.role)
      setIsActive(userData.isActive)
      setPassword('') // Password fields are cleared for editing
      setConfirmPassword('')
    } else {
      // Defaults for new user
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setRole(UserRole.VIEWER)
      setIsActive(true)
    }
    setErrors({})
  }, [userData])

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!firstName.trim()) newErrors.firstName = 'El nombre es requerido.'
    if (!lastName.trim()) newErrors.lastName = 'El apellido es requerido.'
    if (!email.trim()) {
      newErrors.email = 'El email es requerido.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El formato del email no es válido.'
    }

    if (!isEditing || password) {
      // Password required for new users or if being changed
      if (!password) {
        newErrors.password = 'La contraseña es requerida.'
      } else if (password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const userToSave: User = {
      id: userData?.id || '', // ID handled by parent for new users
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role,
      isActive,
      // Only include password if it's being set/changed
      ...(password && { password }),
    }
    onSave(userToSave)
  }

  const errorTextClass = 'mt-1 text-xs text-destructive'

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-xl flex items-center'>
          <UsersIcon className='w-6 h-6 mr-2 text-primary' />
          {isEditing
            ? `Editar Usuario: ${userData?.firstName} ${userData?.lastName}`
            : 'Nuevo Usuario'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-5 pt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <Label htmlFor='user-firstName'>
                Nombre <span className='text-red-500'>*</span>
              </Label>
              <Input
                type='text'
                id='user-firstName'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-describedby='firstName-error'
              />
              {errors.firstName && (
                <p id='firstName-error' className={errorTextClass}>
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='user-lastName'>
                Apellido <span className='text-red-500'>*</span>
              </Label>
              <Input
                type='text'
                id='user-lastName'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                aria-describedby='lastName-error'
              />
              {errors.lastName && (
                <p id='lastName-error' className={errorTextClass}>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='user-email'>
              Email <span className='text-red-500'>*</span>
            </Label>
            <Input
              type='email'
              id='user-email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby='email-error'
            />
            {errors.email && (
              <p id='email-error' className={errorTextClass}>
                {errors.email}
              </p>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <Label htmlFor='user-password'>
                Contraseña{' '}
                {isEditing ? (
                  '(Dejar en blanco para no cambiar)'
                ) : (
                  <span className='text-red-500'>*</span>
                )}
              </Label>
              <Input
                type='password'
                id='user-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby='password-error'
              />
              {errors.password && (
                <p id='password-error' className={errorTextClass}>
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='user-confirmPassword'>
                Confirmar Contraseña{' '}
                {isEditing && !password ? (
                  ''
                ) : (
                  <span className='text-red-500'>*</span>
                )}
              </Label>
              <Input
                type='password'
                id='user-confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-describedby='confirmPassword-error'
                disabled={!password && isEditing}
              />
              {errors.confirmPassword && (
                <p id='confirmPassword-error' className={errorTextClass}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='user-role'>
              Rol <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={role}
              onValueChange={(value: UserRole) => setRole(value)}
            >
              <SelectTrigger id='user-role' aria-describedby='role-error' className='w-full'>
                <SelectValue placeholder='Seleccionar Rol'>
                  {role ? roleDisplayNames[role] : 'Seleccionar Rol'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole)
                  .filter((roleValue) => roleValue !== UserRole.CLIENT)
                  .map((roleValue: UserRole) => (
                    <SelectItem key={roleValue} value={roleValue}>
                      {roleDisplayNames[roleValue]}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p id='role-error' className={errorTextClass}>
                {errors.role}
              </p>
            )}
          </div>

          <div className='flex items-center pt-2'>
            <Checkbox
              id='user-isActive'
              checked={isActive}
              onCheckedChange={(checked: boolean) => setIsActive(checked)}
            />
            <Label
              htmlFor='user-isActive'
              className='ml-2 block text-sm text-foreground'
            >
              Usuario Activo
            </Label>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col sm:flex-row justify-end items-center gap-3 pt-6'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancelar
          </Button>
          <Button type='submit'>
            <UsersIcon className='w-5 h-5 mr-2' />
            <span>{isEditing ? 'Actualizar Usuario' : 'Guardar Usuario'}</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default UserForm
