'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Button,
} from '@artifact/ui';
import { useAuth } from '@artifact/core';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const result = await login({ email, password });
    if (result.success) {
      router.push('/');
      return;
    }
    setError(result.error || 'No pudimos iniciar sesión. Intenta nuevamente.');
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15)_0,_rgba(15,23,42,0.95)_65%)]" />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 text-white">
          <span className="text-sm uppercase tracking-[0.35em] text-white/60">
            Artifact ERP Admin
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Controla tu operación, inventario y facturación en un solo panel
          </h1>
          <p className="mt-6 text-white/70 text-base max-w-md">
            Conecta tu tienda online, emite DTE certificados y administra tus clientes y proveedores sin hojas de cálculo.
          </p>
          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-white/70">
            <div>
              <dt className="uppercase text-white/50">Ventas conciliadas</dt>
              <dd className="text-2xl font-medium text-white">+12K al mes</dd>
            </div>
            <div>
              <dt className="uppercase text-white/50">Tiempo de emisión DTE</dt>
              <dd className="text-2xl font-medium text-emerald-400">&lt; 5 segundos</dd>
            </div>
            <div>
              <dt className="uppercase text-white/50">Usuarios activos</dt>
              <dd className="text-2xl font-medium text-white">Más de 150 pymes</dd>
            </div>
            <div>
              <dt className="uppercase text-white/50">Soporte</dt>
              <dd className="text-2xl font-medium text-white">24/7 en Chile</dd>
            </div>
          </dl>
        </div>

        <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-16">
          <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold text-white">
                Inicia sesión en Artifact
              </CardTitle>
              <CardDescription className="text-white/60">
                Ingresa con tu correo corporativo para continuar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ej: contacto@tuempresa.cl"
                    className="bg-white text-slate-900 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="password" className="text-white/80">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="bg-white text-slate-900 placeholder:text-slate-500"
                  />
                </div>
                {error && (
                  <div className="rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand text-white hover:bg-brand/90"
                >
                  {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
                </Button>
              </form>
              <div className="mt-8 space-y-3 text-center">
                <p className="text-xs uppercase tracking-widest text-white/30">
                  Próximamente
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button disabled variant="ghost" className="w-1/2 border border-white/20 text-white/60">
                    Google
                  </Button>
                  <Button disabled variant="ghost" className="w-1/2 border border-white/20 text-white/60">
                    Microsoft
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 text-center">
              <Link href="/forgot-password" className="text-sm text-white/70 hover:text-white">
                ¿Olvidaste tu contraseña?
              </Link>
              <p className="text-xs text-white/40">
                ¿Necesitas una cuenta? Escríbenos a soporte@artifact.cl y te ayudamos con la activación.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
