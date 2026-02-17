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
                <Card className="w-full max-w-md bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center pb-8">
                        <div className="w-16 h-16 bg-brand/20 border border-brand/30 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">A</span>
                        </div>
                        <CardTitle className="text-2xl font-bold mb-2 text-white">Panel ERP</CardTitle>
                        <p className="text-slate-400">Acceso para empleados</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                    'Ingresar al ERP'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
