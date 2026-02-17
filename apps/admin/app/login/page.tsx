'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import { Globe, ShieldCheck, LayoutGrid, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@artifact/ui';
import SpaceInvadersBackground from '@/components/SpaceInvadersBackground';
import { LoginChoiceCard } from '@/components/LoginChoiceCard';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { user, isLoading, loginWithPassword } = useSupabaseAuth();

  // View state
  const [view, setView] = useState<'selection' | 'erp_auth'>('selection');

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

  const handleERPSelect = () => {
    setView('erp_auth');
  };

  const handleStorefrontSelect = () => {
    window.location.href = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://artifact.cl/login';
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-[#00E074]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-slate-500 font-medium tracking-widest uppercase text-xs">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden font-inter">
      <SpaceInvadersBackground />

      {/* Header / Logo */}
      <div className="absolute top-12 flex flex-col items-center z-20 animate-in fade-in slide-in-from-top duration-1000">
        <div className="relative mb-4">
          <div className="absolute -inset-4 bg-[#00E074]/20 blur-xl rounded-full animate-pulse" />
          <LayoutGrid className="w-12 h-12 text-[#00E074] relative" />
        </div>
        <h1 className="text-3xl font-bold font-space-grotesk tracking-widest text-white uppercase">
          Artifact <span className="text-[#00E074]">ERP</span>
        </h1>
        <p className="text-slate-500 text-sm mt-2 tracking-widest uppercase font-medium">Internal Gateway</p>
      </div>

      <div className="w-full max-w-5xl px-6 relative z-10 flex flex-col items-center">
        {view === 'selection' ? (
          <div className="grid md:grid-cols-2 gap-8 animate-in zoom-in-95 fade-in duration-500 w-full">
            {/* Option: Storefront */}
            <LoginChoiceCard
              title="Tienda Online"
              description="Accede como cliente para gestionar tus compras y pedidos."
              icon={Globe}
              features={[
                "Explorar Catálogo",
                "Historial de Compras",
                "Soporte Premium",
                "Ofertas Exclusivas"
              ]}
              buttonText="Ir a la Tienda"
              onClick={handleStorefrontSelect}
              variant="secondary"
            />

            {/* Option: ERP / Admin */}
            <LoginChoiceCard
              title="Panel Administrativo"
              description="Acceso exclusivo para empleados y gestión de operaciones."
              icon={ShieldCheck}
              features={[
                "Gestión de Inventario",
                "Facturación SII",
                "Control de Usuarios",
                "Análisis de Datos"
              ]}
              buttonText="Acceso ERP"
              onClick={handleERPSelect}
              variant="primary"
            />
          </div>
        ) : (
          <div className="w-full max-w-md animate-in slide-in-from-right-8 fade-in duration-500">
            <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
              <div className="absolute -inset-24 bg-[#00E074]/10 blur-[80px] opacity-100 transition-opacity duration-700 pointer-events-none rounded-full" />

              <CardHeader className="text-center pb-8 relative z-10">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center transform transition-transform group-hover:scale-110 duration-500 shadow-[0_0_20px_rgba(0,224,116,0.1)]">
                  <span className="text-3xl font-bold text-[#00E074] font-space-grotesk">A</span>
                </div>
                <CardTitle className="text-2xl font-bold mb-1 text-white font-space-grotesk tracking-tight">Iniciar Sesión</CardTitle>
                <p className="text-slate-400 text-sm font-medium">Panel de Gestión Administrativa</p>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10">
                <form onSubmit={handlePasswordLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-500 ml-1">Email Corporativo</label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-[#00E074] transition-colors" />
                      <Input
                        type="email"
                        name="email"
                        autoComplete="username email"
                        placeholder="admin@artifact.cl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#00E074]/50 focus:ring-1 focus:ring-[#00E074]/20 rounded-xl transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-500 ml-1">Contraseña</label>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-[#00E074] transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#00E074]/50 focus:ring-1 focus:ring-[#00E074]/20 rounded-xl transition-all"
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
                    className="w-full h-14 bg-[#00E074] hover:bg-[#00FF85] text-black font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(0,224,116,0.2)] hover:shadow-[0_0_30px_rgba(0,224,116,0.4)] disabled:opacity-50"
                    disabled={loggingIn}
                  >
                    {loggingIn ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Entrando...
                      </div>
                    ) : (
                      'Acceder al ERP'
                    )}
                  </Button>
                </form>

                <button
                  onClick={() => setView('selection')}
                  className="w-full mt-4 flex items-center justify-center text-slate-500 hover:text-[#00E074] transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a selección
                </button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium z-20">
        Powered by Artifact Technologies • Administration System v2.0
      </div>
    </div>
  );
}
