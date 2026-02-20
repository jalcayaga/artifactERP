'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@artifact/ui';
import { Lock, Eye, EyeOff, LayoutGrid } from 'lucide-react';
import { useSupabaseAuth } from '@artifact/core/client';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordContent />
        </Suspense>
    );
}

function ResetPasswordContent() {
    const router = useRouter();
    const { isLoading, user } = useSupabaseAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Basic check if user is logged in (via the reset link, Supabase handles the session)
        if (!isLoading && !user) {
            // We don't necessarily need to block here because updatePassword might still work 
            // if it's in the reset flow, but user is usually logged in automatically by the hash token
            console.log('Reset Password: User not detected yet, loading status:', isLoading);
        }
    }, [user, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const { supabase } = await import('@artifact/core/client');
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Error al actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 font-inter">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="absolute -inset-4 bg-[#00E074]/20 blur-xl rounded-full animate-pulse" />
                        <LayoutGrid className="w-12 h-12 text-[#00E074] relative" />
                    </div>
                    <h1 className="text-2xl font-bold font-space-grotesk tracking-widest text-white uppercase">
                        RESTABLECER CONTRASEÑA
                    </h1>
                </div>

                <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
                    <CardHeader className="text-center pb-6 p-0">
                        <CardTitle className="text-xl font-bold text-white mb-2">Nueva Contraseña</CardTitle>
                        <p className="text-slate-400 text-sm">Ingresa tu nueva clave de acceso para Artifact ERP.</p>
                    </CardHeader>

                    <CardContent className="p-0">
                        {success ? (
                            <div className="space-y-4 text-center">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <p className="text-emerald-400 font-medium">¡Contraseña actualizada con éxito!</p>
                                    <p className="text-slate-500 text-xs mt-2">Redirigiendo al login...</p>
                                </div>
                                <Button
                                    onClick={() => router.push('/login')}
                                    className="w-full h-12 bg-[#00E074] hover:bg-[#00FF85] text-black font-black rounded-xl"
                                >
                                    VOLVER AL LOGIN
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Nueva Contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-slate-700 focus:border-[#00E074]/50 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirmar Contraseña"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-12 pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-slate-700 focus:border-[#00E074]/50 rounded-xl"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-[#00E074] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                                        <p className="text-xs font-medium text-red-400">{error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading || isLoading}
                                    className="w-full h-12 bg-[#00E074] hover:bg-[#00FF85] text-black font-black shadow-lg disabled:opacity-50 rounded-xl"
                                >
                                    {loading ? 'ACTUALIZANDO...' : 'GUARDAR CONTRASEÑA'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
