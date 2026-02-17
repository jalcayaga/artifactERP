'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@artifact/ui';
import SpaceInvadersBackground from '@/components/SpaceInvadersBackground';
import { Mail, Loader2, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const { loginWithPassword, isLoading } = useSupabaseAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

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
        <div className="min-h-screen relative bg-black">
            <SpaceInvadersBackground />

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 text-slate-200"
                    onClick={() => router.push('/login')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
            </div>

            <div className="flex items-center justify-center min-h-screen p-6 relative z-10">
                <Card className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-24 bg-[#00E074]/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full" />

                    <CardHeader className="text-center pb-8 relative z-10">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center transform transition-transform group-hover:scale-110 duration-500 shadow-[0_0_20px_rgba(0,224,116,0.1)]">
                            <span className="text-3xl font-bold text-[#00E074] font-space-grotesk">A</span>
                        </div>
                        <CardTitle className="text-3xl font-bold mb-2 text-white font-space-grotesk tracking-tight">Acceso ERP</CardTitle>
                        <p className="text-slate-400 font-medium">Panel de Gestión Administrativa</p>
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
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Entrar al Sistema'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
