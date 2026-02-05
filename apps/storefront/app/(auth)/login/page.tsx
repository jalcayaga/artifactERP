'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import { Button } from '@artifact/ui';
import { Eye, EyeOff } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithPassword, isLoading } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithPassword(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "📦",
      title: "Gestión de Pedidos",
      description: "Rastrea tus compras en tiempo real"
    },
    {
      icon: "⚡",
      title: "Acceso Instantáneo",
      description: "Tienda y ERP con un solo login"
    },
    {
      icon: "🔒",
      title: "100% Seguro",
      description: "Encriptación de grado bancario"
    },
    {
      icon: "📊",
      title: "Reportes en Vivo",
      description: "Analítica actualizada al instante"
    }
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SIDE - Marketing */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-black p-12 relative overflow-hidden">

        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-lg w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-emerald-400 flex items-center justify-center shadow-2xl shadow-brand/50 rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-3xl font-bold text-black">A</span>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">Artifact</span>
          </div>

          {/* Hero Text */}
          <div className="mb-16">
            <h1 className="text-6xl font-bold text-white mb-6 leading-[1.1]">
              Tu negocio,
              <span className="block bg-gradient-to-r from-brand to-emerald-400 bg-clip-text text-transparent">
                digitalizado
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Plataforma unificada para e-commerce, inventario y facturación.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-8 mb-16">
            {features.map((feature, idx) => (
              <div key={idx} className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand/20 to-emerald-500/20 border border-brand/30 flex items-center justify-center text-4xl backdrop-blur-sm">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white text-base">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center">
                <span className="text-brand text-xs">✓</span>
              </div>
              <span>Certificado SII</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center">
                <span className="text-brand text-xs">✓</span>
              </div>
              <span>SSL Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center">
                <span className="text-brand text-xs">✓</span>
              </div>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-black">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-emerald-400 mb-4 shadow-lg shadow-brand/50">
              <span className="text-3xl font-bold text-black">A</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Bienvenido</h1>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h2>
              <p className="text-slate-400">Accede a tu cuenta</p>
            </div>

            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full h-14 text-base font-medium border-slate-700 hover:bg-slate-800 hover:border-slate-600 bg-slate-800/50 text-white mb-6 transition-all rounded-xl"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
              Continuar con Google
            </Button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-4 text-slate-500 font-medium">O con email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Email</label>
                <input
                  type="email"
                  placeholder="nombre@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#ffffff'
                  }}
                  className="w-full h-14 px-4 rounded-xl border-2 text-base placeholder:text-slate-600 focus:border-brand/50 focus:ring-2 focus:ring-brand/20 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      color: '#ffffff'
                    }}
                    className="w-full h-14 px-4 pr-12 rounded-xl border-2 text-base placeholder:text-slate-600 focus:border-brand/50 focus:ring-2 focus:ring-brand/20 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isLoading}
                className="w-full h-14 bg-gradient-to-r from-brand to-emerald-400 hover:from-brand/90 hover:to-emerald-400/90 text-black font-bold text-base rounded-xl shadow-lg shadow-brand/30 hover:shadow-brand/50 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Ingresando...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-500">
                ¿No tienes cuenta?{' '}
                <a href="/register" className="text-brand hover:text-brand/80 font-semibold transition-colors">
                  Regístrate gratis
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
    </div>
  );
}
