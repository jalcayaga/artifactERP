import React, { useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { UserCircleIcon, PencilIcon, LockClosedIcon, TrashIcon } from '@/components/Icons'
import { useAuth } from '@/contexts/AuthContext'
import { UserService } from '@/lib/services/userService'
import { toast } from 'sonner'

const ProfileView: React.FC = () => {
  const { currentUser, token, logout, updateCurrentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(currentUser?.firstName || '')
  const [lastName, setLastName] = useState(currentUser?.lastName || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEditToggle = () => setIsEditing(!isEditing)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePictureFile(event.target.files[0])
    }
  }

  const handleSave = useCallback(async () => {
    if (!currentUser || !token) return

    setLoading(true)
    try {
      // Update user basic info
      await UserService.updateUser(currentUser.id, { firstName, lastName }, token)

      // Upload profile picture if a new one was selected
      if (profilePictureFile) {
        const uploadResponse = await UserService.uploadProfilePicture(
          currentUser.id,
          profilePictureFile,
          token
        )
        updateCurrentUser({ ...currentUser, profilePictureUrl: uploadResponse.url })
        toast.success('Imagen de perfil actualizada.')
      }

      // Update current user in context to reflect changes
      updateCurrentUser({ ...currentUser, firstName, lastName })
      toast.success('Perfil actualizado exitosamente.')
      setIsEditing(false)
      setProfilePictureFile(null) // Clear selected file after upload
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil.')
    } finally {
      setLoading(false)
    }
  }, [currentUser, firstName, lastName, profilePictureFile, token, updateCurrentUser])

  const handleDeleteProfilePicture = useCallback(async () => {
    if (!currentUser || !token || !currentUser.profilePictureUrl) return

    if (!window.confirm('¿Estás seguro de que quieres eliminar tu imagen de perfil?')) {
      return;
    }

    setLoading(true);
    try {
      await UserService.deleteProfilePicture(
        currentUser.id,
        token,
        currentUser.profilePictureUrl
      );
      updateCurrentUser({ ...currentUser, profilePictureUrl: null });
      toast.success('Imagen de perfil eliminada exitosamente.');
    } catch (error: any) {
      console.error('Error deleting profile picture:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar la imagen de perfil.');
    } finally {
      setLoading(false);
    }
  }, [currentUser, token, updateCurrentUser]);

  const inputBaseClass =
    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground disabled:opacity-70 disabled:bg-muted/50'

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            No se pudo cargar la información del usuario.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6 lg:space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Perfil de Usuario</h1>
        {!isEditing && (
          <button
            onClick={handleEditToggle}
            className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg shadow-sm flex items-center space-x-2 transition-colors'
          >
            <PencilIcon className='w-5 h-5' />
            <span>Editar Perfil</span>
          </button>
        )}
      </div>

      <Card className='max-w-2xl border'>
        <CardContent className='p-6 space-y-6'>
          <div className='flex items-center space-x-4'>
            {currentUser.profilePictureUrl ? (
              <img
                src={currentUser.profilePictureUrl}
                alt='User Profile'
                className='w-20 h-20 rounded-full object-cover border-2 border-primary'
              />
            ) : (
              <UserCircleIcon className='w-20 h-20 text-muted-foreground' />
            )}
            <div>
              <h2 className='text-2xl font-semibold text-foreground'>
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className='text-sm text-muted-foreground'>
                {currentUser.role}
              </p>
            </div>
          </div>

          {isEditing && (
            <div>
              <label
                htmlFor='profile-picture'
                className='block text-sm font-medium text-foreground mb-1'
              >
                Imagen de Perfil
              </label>
              <input
                type='file'
                id='profile-picture'
                accept='image/*'
                onChange={handleFileChange}
                className='block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
              />
              {profilePictureFile && (
                <p className='mt-2 text-sm text-muted-foreground'>
                  Archivo seleccionado: {profilePictureFile.name}
                </p>
              )}
              {currentUser.profilePictureUrl && (
                <button
                  type='button'
                  onClick={handleDeleteProfilePicture}
                  className='mt-2 text-sm text-destructive hover:text-destructive/80 flex items-center'
                  disabled={loading}
                >
                  <TrashIcon className='w-4 h-4 mr-1' /> Eliminar imagen actual
                </button>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor='profile-firstName'
              className='block text-sm font-medium text-foreground'
            >
              Nombre
            </label>
            <input
              type='text'
              id='profile-firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditing}
              className={inputBaseClass}
            />
          </div>
          <div>
            <label
              htmlFor='profile-lastName'
              className='block text-sm font-medium text-foreground'
            >
              Apellido
            </label>
            <input
              type='text'
              id='profile-lastName'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditing}
              className={inputBaseClass}
            />
          </div>
          <div>
            <label
              htmlFor='profile-email'
              className='block text-sm font-medium text-foreground'
            >
              Correo Electrónico
            </label>
            <input
              type='email'
              id='profile-email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={true}
              className={inputBaseClass}
            />{' '}
            {/* Email typically not editable or requires special handling */}
          </div>

          {isEditing && (
            <div className='flex justify-end space-x-3 pt-4 border-t'>
              <button
                onClick={handleEditToggle}
                className='px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-colors'
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50'
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className='max-w-2xl border'>
        <CardHeader>
          <CardTitle className='text-lg'>Seguridad</CardTitle>
        </CardHeader>
        <CardContent className='pt-3'>
          <button className='w-full text-left flex items-center p-3 -m-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'>
            <LockClosedIcon className='w-5 h-5 mr-3 text-muted-foreground' />
            <span className='text-foreground'>Cambiar Contraseña</span>
          </button>
          <p className='mt-2 text-xs text-muted-foreground italic'>
            (Funcionalidad de cambio de contraseña en desarrollo)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileView
