// frontend/components/UserManagementView.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import UserForm from '@/components/UserForm';
import UserDetailModal from '@/components/UserDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PencilIcon, TrashIcon, EyeIcon, UsersIcon, PlusIcon, CheckCircleIcon, XCircleIcon } from '@/components/Icons';

const initialMockUsers: User[] = [
  { id: 'user-1', firstName: 'Admin', lastName: 'Principal', email: 'admin@example.com', role: UserRole.ADMIN, isActive: true, lastLogin: '2023-11-15T10:00:00Z' },
  { id: 'user-2', firstName: 'Juan', lastName: 'Editor', email: 'juan.editor@example.com', role: UserRole.EDITOR, isActive: true, lastLogin: '2023-11-14T14:30:00Z' },
  { id: 'user-3', firstName: 'Ana', lastName: 'Visualizador', email: 'ana.visor@example.com', role: UserRole.VIEWER, isActive: true, lastLogin: '2023-11-13T09:15:00Z' },
  { id: 'user-4', firstName: 'Carlos', lastName: 'Inactivo', email: 'carlos.inactivo@example.com', role: UserRole.VIEWER, isActive: false, lastLogin: '2023-10-01T12:00:00Z' },
];

const LOCAL_STORAGE_KEY_USERS = 'wolfflow_users';

const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
      return storedUsers ? JSON.parse(storedUsers) : initialMockUsers;
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
      return initialMockUsers;
    }
  });
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [userToToggleStatus, setUserToToggleStatus] = useState<User | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users to localStorage:", error);
    }
  }, [users]);

  const handleAddNewUser = useCallback(() => {
    setEditingUser(null);
    setShowUserForm(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  }, []);

  const handleToggleUserStatusRequest = useCallback((user: User) => {
    setUserToToggleStatus(user);
    setShowConfirmModal(true);
  }, []);
  
  const handleConfirmToggleUserStatus = useCallback(() => {
    if (userToToggleStatus) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userToToggleStatus.id ? { ...user, isActive: !user.isActive } : user
        )
      );
      setUserToToggleStatus(null);
      setShowConfirmModal(false);
    }
  }, [userToToggleStatus]);

  const handleCloseConfirmModal = useCallback(() => {
    setUserToToggleStatus(null);
    setShowConfirmModal(false);
  }, []);

  const handleViewUser = useCallback((user: User) => {
    setViewingUser(user);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setViewingUser(null);
  }, []);

  const handleSaveUser = useCallback((userData: User) => {
    setUsers(prevUsers => {
      if (editingUser) { // Editing existing user
        return prevUsers.map(u => (u.id === userData.id ? { ...u, ...userData } : u));
      } else { // Adding new user
        const newId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Ensure password is not stored directly in this mock (it's for form handling)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userToSave } = userData;
        return [...prevUsers, { ...userToSave, id: newId, lastLogin: new Date().toISOString() }];
      }
    });
    setShowUserForm(false);
    setEditingUser(null);
  }, [editingUser]);

  const handleCloseForm = useCallback(() => {
    setShowUserForm(false);
    setEditingUser(null);
  }, []);

  if (showUserForm) {
    return (
      <UserForm
        userData={editingUser}
        onSave={handleSaveUser}
        onCancel={handleCloseForm}
      />
    );
  }
  
  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case UserRole.EDITOR: return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case UserRole.VIEWER: return 'bg-sky-500/10 text-sky-700 dark:text-sky-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Gestión de Usuarios
          </h1>
          <button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2"
            onClick={handleAddNewUser}
            aria-label="Añadir Nuevo Usuario"
          >
            <PlusIcon className="w-5 h-5" /> 
            <span>Añadir Usuario</span>
          </button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rol</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-accent transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{user.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{user.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                            user.isActive 
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          }`}>
                            {user.isActive ? <CheckCircleIcon className="w-3.5 h-3.5 mr-1" /> : <XCircleIcon className="w-3.5 h-3.5 mr-1" />}
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                            <button 
                              onClick={() => handleViewUser(user)} 
                              title="Ver Detalles" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Ver detalles de ${user.firstName} ${user.lastName}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleEditUser(user)} 
                              title="Editar Usuario" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Editar usuario ${user.firstName} ${user.lastName}`}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleToggleUserStatusRequest(user)} 
                              title={user.isActive ? "Desactivar Usuario" : "Activar Usuario"}
                              className={`${user.isActive ? 'text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400' : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400'} transition-colors p-1 rounded-md ${user.isActive ? 'hover:bg-amber-500/10' : 'hover:bg-emerald-500/10'}`}
                              aria-label={`${user.isActive ? "Desactivar" : "Activar"} usuario ${user.firstName} ${user.lastName}`}
                            >
                              {user.isActive ? <XCircleIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <UsersIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">No hay usuarios registrados</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Empieza añadiendo tu primer usuario para gestionar el acceso al sistema.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAddNewUser}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Añadir Primer Usuario</span>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {viewingUser && (
        <UserDetailModal 
          user={viewingUser}
          onClose={handleCloseDetailModal}
        />
      )}

      {showConfirmModal && userToToggleStatus && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmToggleUserStatus}
          title={userToToggleStatus.isActive ? "Desactivar Usuario" : "Activar Usuario"}
          message={<>¿Estás seguro de que quieres {userToToggleStatus.isActive ? 'desactivar' : 'activar'} al usuario <strong>{userToToggleStatus.firstName} {userToToggleStatus.lastName}</strong>?</>}
          confirmText={userToToggleStatus.isActive ? "Desactivar" : "Activar"}
          confirmButtonClass={userToToggleStatus.isActive ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
          icon={userToToggleStatus.isActive ? <XCircleIcon className="w-5 h-5 mr-2" /> : <CheckCircleIcon className="w-5 h-5 mr-2" />}
        />
      )}
    </>
  );
};

export default UserManagementView;