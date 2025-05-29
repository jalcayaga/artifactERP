import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Importar Card de shadcn/ui
import { UserCircleIcon, PencilIcon, LockClosedIcon } from '@/components/Icons';
import { useAuth } from '@/contexts/AuthContext';

const ProfileView: React.FC = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = () => {
    console.log('Saving profile:', { firstName, lastName, email });
    // Here you would typically call an API to save the changes
    // For example: await auth.updateProfile({ firstName, lastName });
    setIsEditing(false);
  };
  
  const inputBaseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground disabled:opacity-70 disabled:bg-muted/50";

  if (!currentUser) {
    return (
      <Card className="border">
        <CardHeader><CardTitle>Perfil de Usuario</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No se pudo cargar la información del usuario.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-foreground">
          Perfil de Usuario
        </h1>
        {!isEditing && (
            <button
                onClick={handleEditToggle}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
            >
                <PencilIcon className="w-5 h-5" />
                <span>Editar Perfil</span>
            </button>
        )}
      </div>
      
      <Card className="max-w-2xl border">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <UserCircleIcon className="w-20 h-20 text-muted-foreground" />
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{currentUser.role}</p>
            </div>
          </div>

          <div>
            <label htmlFor="profile-firstName" className="block text-sm font-medium text-foreground">Nombre</label>
            <input type="text" id="profile-firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditing} className={inputBaseClass} />
          </div>
          <div>
            <label htmlFor="profile-lastName" className="block text-sm font-medium text-foreground">Apellido</label>
            <input type="text" id="profile-lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!isEditing} className={inputBaseClass} />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-foreground">Correo Electrónico</label>
            <input type="email" id="profile-email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={true} className={inputBaseClass} /> {/* Email typically not editable or requires special handling */}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button onClick={handleEditToggle} className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg shadow-sm transition-colors">
                Guardar Cambios
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="max-w-2xl border">
        <CardHeader>
            <CardTitle className="text-lg">Seguridad</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
           <button className="w-full text-left flex items-center p-3 -m-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                <LockClosedIcon className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="text-foreground">Cambiar Contraseña</span>
            </button>
             <p className="mt-2 text-xs text-muted-foreground italic">
                (Funcionalidad de cambio de contraseña en desarrollo)
            </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;