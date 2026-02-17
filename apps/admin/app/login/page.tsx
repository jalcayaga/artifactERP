'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import { Globe, ShieldCheck, LayoutGrid, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@artifact/ui';
import SpaceInvadersBackground from '@/components/SpaceInvadersBackground';

// Social Icons
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.66 4.65 1.72l3.43-3.43C17.99 1.3 15.22 0 12 0 7.31 0 3.25 2.69 1.18 6.64l4.06 3.15C6.18 7.37 8.87 5.04 12 5.04z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.3H12v4.61h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.42-4.94 3.41-8.76z" />
    <path fill="#FBBC05" d="M5.24 14.5c-.25-.74-.4-1.53-.4-2.35 0-.82.15-1.61.4-2.35L1.18 6.64A11.977 11.977 0 000 12c0 1.93.46 3.75 1.28 5.36l3.96-3.11V14.5z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.1.74-2.5 1.18-4.23 1.18-3.09 0-5.71-2.09-6.72-4.91l-4.06 3.15C3.25 21.31 7.31 24 12 24z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 23 23">
    <path fill="#f3f3f3" d="M0 0h11v11H0z" />
    <path fill="#f3f3f3" d="M12 0h11v11H12z" />
    <path fill="#f3f3f3" d="M0 12h11v11H0z" />
    <path fill="#f3f3f3" d="M12 12h11v11H12z" />
  </svg>
);

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { user, isLoading, loginWithPassword, loginWithGoogle, loginWithMicrosoft } = useSupabaseAuth();

  // Auth form state
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-[#00E074]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-slate-500 font-medium tracking-widest uppercase text-xs">Sincronizando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden font-inter p-6">
      <SpaceInvadersBackground />

      {/* Header / Logo */}
      <div className="mb-12 flex flex-col items-center z-20 animate-in fade-in slide-in-from-top duration-1000">
        <div className="relative mb-4">
          <div className="absolute -inset-4 bg-[#00E074]/20 blur-xl rounded-full animate-pulse" />
          <LayoutGrid className="w-14 h-14 text-[#00E074] relative" />
        </div>
        <h1 className="text-4xl font-bold font-space-grotesk tracking-widest text-white uppercase">
          Artifact <span className="text-[#00E074]">ERP</span>
        </h1>
        <p className="text-slate-500 text-sm mt-2 tracking-[0.3em] uppercase font-bold">Unified Access Gateway</p>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 relative z-10 animate-in zoom-in-95 fade-in duration-700">

        {/* 1. Customer Access (Social) */}
        <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col shadow-2xl relative group overflow-hidden">
          <div className="absolute -inset-24 bg-blue-500/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full" />

          <CardHeader className="text-left pb-10 relative z-10 p-0">
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-6 flex items-center justify-center text-blue-400">
              <Globe className="w-7 h-7" />
            </div>
            <CardTitle className="text-3xl font-bold text-white font-space-grotesk tracking-tight mb-2">Tienda Online</CardTitle>
            <p className="text-slate-400 text-base font-medium leading-relaxed">Acceso a pedidos, catálogo y perfil de cliente.</p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-center gap-4 relative z-10 p-0">
            <Button
              onClick={() => loginWithGoogle()}
              className="h-16 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl flex items-center justify-center text-lg font-bold group/btn transition-all"
            >
              <GoogleIcon />
              Continuar con Google
            </Button>
            <Button
              onClick={() => loginWithMicrosoft()}
              className="h-16 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl flex items-center justify-center text-lg font-bold group/btn transition-all"
            >
              <MicrosoftIcon />
              Continuar con Microsoft
            </Button>

            <div className="mt-8 pt-8 border-t border-white/5">
              <ul className="space-y-3">
                {["Rastreo de Pedidos", "Ofertas Exclusivas", "Historial de Compras", "Soporte Técnico"].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-500 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 2. Admin Access (ERP Form) */}
        <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col shadow-2xl relative group overflow-hidden">
          <div className="absolute -inset-24 bg-[#00E074]/10 blur-[80px] opacity-100 transition-opacity duration-700 pointer-events-none rounded-full" />

          <CardHeader className="text-left pb-10 relative z-10 p-0">
            <div className="w-14 h-14 bg-[#00E074]/10 border border-[#00E074]/20 rounded-2xl mb-6 flex items-center justify-center text-[#00E074] shadow-[0_0_20px_rgba(0,224,116,0.1)]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <CardTitle className="text-3xl font-bold text-white font-space-grotesk tracking-tight mb-2">Gestión ERP</CardTitle>
            <p className="text-slate-400 text-base font-medium leading-relaxed">Acceso operativo para personal administrativo.</p>
          </CardHeader>

          <CardContent className="flex-1 relative z-10 p-0">
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">Email de Empresa</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-[#00E074] transition-colors" />
                  <Input
                    type="email"
                    placeholder="usuario@artifact.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-16 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 focus:border-[#00E074]/50 focus:ring-1 focus:ring-[#00E074]/20 rounded-2xl transition-all text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">Contraseña</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-[#00E074] transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-16 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 focus:border-[#00E074]/50 focus:ring-1 focus:ring-[#00E074]/20 rounded-2xl transition-all text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-[#00E074] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm font-medium text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-16 bg-[#00E074] hover:bg-[#00FF85] text-black font-black text-xl rounded-2xl transition-all shadow-[0_0_30px_rgba(0,224,116,0.15)] hover:shadow-[0_0_40px_rgba(0,224,116,0.3)] disabled:opacity-50"
                disabled={loggingIn}
              >
                {loggingIn ? 'AUTENTICANDO...' : 'ENTRAR AL ERP'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-slate-600 text-[10px] uppercase tracking-[0.4em] font-black z-20">
        Artifact Engine v2.5 • Unified Infrastructure
      </div>
    </div>
  );
}
