'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@artifact/ui';
import SpaceInvadersBackground from '@/components/SpaceInvadersBackground';
import { Mail, Loader2, Lock, Eye, EyeOff } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithMicrosoft, loginWithPassword, isLoading, user } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleMicrosoftLogin = async () => {
    await loginWithMicrosoft();
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoggingIn(true);

    try {
      await loginWithPassword(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative bg-black">
      <SpaceInvadersBackground />

      {/* Branding - Admin Side */}
      <div className="hidden lg:flex flex-col justify-center items-center relative overflow-hidden z-10 bg-black/40">
        <div className="relative z-10 text-center p-12">
          <div className="w-24 h-24 bg-brand/20 border border-brand/30 rounded-3xl mx-auto mb-8 flex items-center justify-center transform -rotate-3 shadow-[0_0_40px_rgba(0,224,116,0.2)]">
            <span className="text-4xl font-bold text-white">A</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Panel de Administración</h1>
          <p className="text-lg text-neutral-400 max-w-sm mx-auto">
            Control total de tu negocio. Inventario, ventas y facturación en un solo lugar.
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative z-10">
        <Card className="w-full max-w-md bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold mb-2 text-white">Bienvenido de nuevo</CardTitle>
            <p className="text-slate-400">Accede a Artifact ERP</p>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-white/10 hover:bg-white/5 hover:text-white bg-transparent text-slate-200"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <GoogleIcon />
                Ingresar con Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-white/10 hover:bg-white/5 hover:text-white bg-transparent text-slate-200"
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
              >
                <MicrosoftIcon />
                Ingresar con Microsoft
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-2 text-slate-500 rounded-sm">o usa tu email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="email"
                    name="email"
                    autoComplete="username email"
                    placeholder="admin@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-brand hover:bg-brand/90 text-black font-semibold"
                disabled={loggingIn}
              >
                {loggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
