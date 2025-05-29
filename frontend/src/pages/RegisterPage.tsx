// frontend/src/pages/RegisterPage.tsx
import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ERP_APP_NAME as APP_NAME } from '@/constants'; // Using ERP_APP_NAME for admin/register context
import { UserCircleIcon, CheckCircleIcon } from '@/components/Icons'; // Using UserCircle for registration icon

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Local loading state for the form
  const auth = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    setIsLoading(true);
    const result = await auth.register({ firstName, lastName, email, password });
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage('Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.');
    } else {
      setError(result.error || 'Fallo en el registro. Por favor, inténtalo de nuevo.');
    }
  };

  const inputBaseClass = "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none sm:text-sm transition-colors duration-150";
  const themeInputClass = "border-border bg-background text-foreground focus:ring-ring focus:border-ring";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {successMessage ? (
            <CheckCircleIcon className="mx-auto h-12 w-auto text-emerald-500" /> // Success icon
        ) : (
            <UserCircleIcon className="mx-auto h-12 w-auto text-primary" />
        )}
        <h2 className="mt-6 text-3xl font-extrabold text-foreground">
          {successMessage ? '¡Registro Completado!' : `Crear una cuenta en ${APP_NAME}`}
        </h2>
        {!successMessage && (
          <p className="mt-2 text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <button 
              onClick={onSwitchToLogin} 
              disabled={isLoading}
              className="font-medium text-primary hover:text-primary/80 dark:hover:text-primary/70 disabled:opacity-50"
            >
              Inicia sesión
            </button>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card text-card-foreground py-8 px-4 shadow-subtle dark:shadow-md sm:rounded-lg sm:px-10 border">
          {successMessage ? (
            <div className="text-center">
              <p className="text-md text-muted-foreground mb-6">
                {successMessage}
              </p>
              <button
                onClick={onSwitchToLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                          Nombre
                      </label>
                      <div className="mt-1">
                          <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          autoComplete="given-name"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={`${inputBaseClass} ${themeInputClass}`}
                          disabled={isLoading}
                          />
                      </div>
                  </div>
                  <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                          Apellido
                      </label>
                      <div className="mt-1">
                          <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          autoComplete="family-name"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={`${inputBaseClass} ${themeInputClass}`}
                          disabled={isLoading}
                          />
                      </div>
                  </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Correo Electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputBaseClass} ${themeInputClass}`}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputBaseClass} ${themeInputClass}`}
                    aria-describedby="password-requirements"
                    disabled={isLoading}
                  />
                   <p className="mt-1 text-xs text-muted-foreground" id="password-requirements">
                      Mínimo 6 caracteres.
                   </p>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Confirmar Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputBaseClass} ${themeInputClass}`}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              {error && (
                <div className="rounded-md bg-destructive/10 p-4">
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;