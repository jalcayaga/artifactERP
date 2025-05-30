// frontend/src/pages/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ERP_APP_NAME as APP_NAME } from '@/constants'; 
import { LockClosedIcon } from '@/icons';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await auth.login({ email, password });
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Failed to login. Please check your credentials.');
    }
    // On success, AuthContext will change isAuthenticated and AppRouter will redirect.
  };
  
  const inputBaseClass = "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none sm:text-sm transition-colors duration-150";
  const themeInputClass = "border-border bg-background text-foreground focus:ring-ring focus:border-ring";


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <LockClosedIcon className="mx-auto h-12 w-auto text-primary" />
        <h2 className="mt-6 text-3xl font-extrabold text-foreground">
          Iniciar sesión en {APP_NAME}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O{' '}
          <button onClick={onSwitchToRegister} className="font-medium text-primary hover:text-primary/80 dark:hover:text-primary/70">
            crea una nueva cuenta
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card text-card-foreground py-8 px-4 shadow-subtle dark:shadow-md sm:rounded-lg sm:px-10 border">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBaseClass} ${themeInputClass}`}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-destructive">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;