// frontend/components/UserForm.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { User, UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UsersIcon } from '@/components/Icons';

interface UserFormProps {
  userData: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ userData, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.VIEWER);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!userData;

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setRole(userData.role);
      setIsActive(userData.isActive);
      setPassword(''); // Password fields are cleared for editing
      setConfirmPassword('');
    } else {
      // Defaults for new user
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole(UserRole.VIEWER);
      setIsActive(true);
    }
    setErrors({});
  }, [userData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = 'El nombre es requerido.';
    if (!lastName.trim()) newErrors.lastName = 'El apellido es requerido.';
    if (!email.trim()) {
      newErrors.email = 'El email es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El formato del email no es válido.';
    }

    if (!isEditing || password) { // Password required for new users or if being changed
      if (!password) {
        newErrors.password = 'La contraseña es requerida.';
      } else if (password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userToSave: User = {
      id: userData?.id || '', // ID handled by parent for new users
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role,
      isActive,
      // Only include password if it's being set/changed
      ...(password && { password }),
    };
    onSave(userToSave);
  };

  const inputBaseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground";
  const selectBaseClass = `${inputBaseClass} pr-8`;
  const errorTextClass = "mt-1 text-xs text-destructive";

  return (
    <Card className="max-w-2xl mx-auto border">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
            <UsersIcon className="w-6 h-6 mr-2 text-primary" />
            {isEditing ? `Editar Usuario: ${userData?.firstName} ${userData?.lastName}` : 'Nuevo Usuario'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="user-firstName" className="block text-sm font-medium text-foreground">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input type="text" id="user-firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputBaseClass} aria-describedby="firstName-error"/>
              {errors.firstName && <p id="firstName-error" className={errorTextClass}>{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="user-lastName" className="block text-sm font-medium text-foreground">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input type="text" id="user-lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputBaseClass} aria-describedby="lastName-error"/>
              {errors.lastName && <p id="lastName-error" className={errorTextClass}>{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-foreground">
              Email <span className="text-red-500">*</span>
            </label>
            <input type="email" id="user-email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBaseClass} aria-describedby="email-error"/>
            {errors.email && <p id="email-error" className={errorTextClass}>{errors.email}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="user-password" className="block text-sm font-medium text-foreground">
                Contraseña {isEditing ? '(Dejar en blanco para no cambiar)' : <span className="text-red-500">*</span>}
              </label>
              <input type="password" id="user-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputBaseClass} aria-describedby="password-error"/>
              {errors.password && <p id="password-error" className={errorTextClass}>{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="user-confirmPassword" className="block text-sm font-medium text-foreground">
                Confirmar Contraseña {isEditing && !password ? '' : <span className="text-red-500">*</span>}
              </label>
              <input type="password" id="user-confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputBaseClass} aria-describedby="confirmPassword-error" disabled={!password && isEditing}/>
              {errors.confirmPassword && <p id="confirmPassword-error" className={errorTextClass}>{errors.confirmPassword}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="user-role" className="block text-sm font-medium text-foreground">
              Rol <span className="text-red-500">*</span>
            </label>
            <select id="user-role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={selectBaseClass} aria-describedby="role-error">
              {Object.values(UserRole)
                .filter(roleValue => roleValue !== UserRole.CLIENT)
                .map((roleValue: UserRole) => ( // Explicitly type roleValue
                   <option key={roleValue} value={roleValue}>{roleValue}</option>
              ))}
            </select>
            {errors.role && <p id="role-error" className={errorTextClass}>{errors.role}</p>}
          </div>
          
          <div className="flex items-center pt-2">
            <input
              id="user-isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="user-isActive" className="ml-2 block text-sm text-foreground">
              Usuario Activo
            </label>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2.5 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto order-1 sm:order-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2"
          >
            <UsersIcon className="w-5 h-5" />
            <span>{isEditing ? 'Actualizar Usuario' : 'Guardar Usuario'}</span>
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserForm;