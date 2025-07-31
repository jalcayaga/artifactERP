// frontend/components/UserManagementView.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/lib/services/userService';
import { User, UserRole, CreateUserDto } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon, TrashIcon, PlusIcon } from '@/components/Icons';

const UserManagementView: React.FC = () => {
  const { token, isAuthenticated, currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (!isAuthenticated || !token || currentUser?.role !== UserRole.ADMIN) {
      setError('No autorizado para ver esta página.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const fetchedUsers = await UserService.getAllUsers(token);
      setUsers(fetchedUsers);
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
    if (!token || !window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    try {
      await UserService.deleteUser(userId, token);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error al eliminar el usuario.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos de administrador.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-foreground">Gestión de Usuarios</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenModal()}><PlusIcon className="mr-2 h-4 w-4" /> Añadir Usuario</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">Nombre</Label>
                <Input id="firstName" value={formValues.firstName} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Apellido</Label>
                <Input id="lastName" value={formValues.lastName} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={formValues.email} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rol</Label>
                <Select onValueChange={handleSelectChange} value={formValues.role}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Contraseña</Label>
                  <Input id="password" type="password" value={formValues.password} onChange={handleInputChange} className="col-span-3" required />
                </div>
              )}
              <DialogFooter>
                <Button type="submit">{editingUser ? 'Guardar Cambios' : 'Añadir Usuario'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isActive ? 'Sí' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(user)} className="mr-2">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementView;
