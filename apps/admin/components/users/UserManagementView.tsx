'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, CreateUserDto, AuthenticatedUser } from '@artifact/core';
import { useAuth, UserService } from '@artifact/core/client';
import { Card, CardContent, CardHeader, CardTitle } from '@artifact/ui';
import { Button } from '@artifact/ui';
import { Input } from '@artifact/ui';
import { Label } from '@artifact/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@artifact/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@artifact/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@artifact/ui';
import { PencilIcon, TrashIcon, PlusIcon } from '@artifact/ui';

interface UserManagementViewProps {
  users?: AuthenticatedUser[];
}

const UserManagementView: React.FC<UserManagementViewProps> = ({
  users = [],
}) => {
  const { token, isAuthenticated, currentUser } = useAuth();
  const [userList, setUserList] = useState<AuthenticatedUser[]>(users);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formValues, setFormValues] = useState<Partial<CreateUserDto>>({
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.CLIENT,
    password: '',
  });

  const fetchUsers = useCallback(async () => {
    const isAdminUser =
      currentUser?.role === UserRole.ADMIN ||
      currentUser?.role === UserRole.SUPERADMIN;
    if (!isAuthenticated || !token || !isAdminUser) {
      setError('No autorizado para ver esta página.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const fetchedUsers = await UserService.getAllUsers(token);
      setUserList(fetchedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, currentUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormValues({ ...formValues, role: value as UserRole });
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        password: '', // Never pre-fill password
      });
    } else {
      setEditingUser(null);
      setFormValues({
        firstName: '',
        lastName: '',
        email: '',
        role: UserRole.CLIENT,
        password: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingUser) {
        // Update user
        await UserService.updateUser(editingUser.id, formValues, token);
      } else {
        // Create user
        await UserService.createUser(formValues as CreateUserDto, token);
      }
      setIsModalOpen(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Error al guardar el usuario.');
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      !token ||
      !window.confirm('¿Estás seguro de que quieres eliminar este usuario?')
    )
      return;
    try {
      await UserService.deleteUser(userId, token);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error al eliminar el usuario.');
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen text-red-500'>
        <p>{error}</p>
      </div>
    );
  }

  if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
    return (
      <div className='text-center py-8 text-destructive'>
        Acceso denegado. No tienes permisos de administrador.
      </div>
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div className='space-y-6 lg:space-y-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Gestión de Usuarios</h1>
          <DialogTrigger asChild>
            <Button
              className='w-full sm:w-auto'
              onClick={() => handleOpenModal()}
            >
              <PlusIcon className='mr-2 h-4 w-4' /> Añadir Usuario
            </Button>
          </DialogTrigger>
        </div>

        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            {userList.length > 0 ? (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader className='bg-muted/50'>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className='text-right'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userList.map((user) => (
                      <TableRow
                        key={user.id}
                        className='hover:bg-accent transition-colors duration-150'
                      >
                        <TableCell className='font-medium'>
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className='text-right'>
                          <DialogTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleOpenModal(user)}
                              className='mr-2'
                            >
                              <PencilIcon className='h-4 w-4' />
                            </Button>
                          </DialogTrigger>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(user.id)}
                          >
                            <TrashIcon className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className='text-center py-12 px-4'>
                <h3 className='mt-3 text-sm sm:text-base font-semibold text-foreground'>
                  No hay usuarios registrados
                </h3>
                <p className='mt-1.5 text-sm text-muted-foreground'>
                  Añade un nuevo usuario para empezar a gestionar.
                </p>
                <div className='mt-6'>
                  <DialogTrigger asChild>
                    <Button type='button' onClick={() => handleOpenModal()}>
                      <PlusIcon className='w-5 h-5 mr-2' />
                      <span>Añadir Primer Usuario</span>
                    </Button>
                  </DialogTrigger>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-sm sm:text-base font-semibold text-foreground'>
              {editingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}
            </DialogTitle>
            <DialogDescription>
              Complete los campos a continuación para{' '}
              {editingUser
                ? 'editar el usuario existente'
                : 'añadir un nuevo usuario'}
              .
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='firstName' className='text-right'>
                Nombre
              </Label>
              <Input
                id='firstName'
                value={formValues.firstName}
                onChange={handleInputChange}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='lastName' className='text-right'>
                Apellido
              </Label>
              <Input
                id='lastName'
                value={formValues.lastName}
                onChange={handleInputChange}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                value={formValues.email}
                onChange={handleInputChange}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='role' className='text-right'>
                Rol
              </Label>
              <Select
                onValueChange={handleSelectChange}
                value={formValues.role}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Seleccionar Rol' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!editingUser && (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='password' className='text-right'>
                  Contraseña
                </Label>
                <Input
                  id='password'
                  type='password'
                  value={formValues.password}
                  onChange={handleInputChange}
                  className='col-span-3'
                  required={!editingUser}
                />
              </div>
            )}
          </form>
          <DialogFooter>
            <Button type='submit' onClick={handleSubmit}>
              {editingUser ? 'Guardar Cambios' : 'Añadir Usuario'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default UserManagementView;
