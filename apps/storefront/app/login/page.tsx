'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@artifact/ui';
import { Loader2, ArrowLeft } from 'lucide-react';

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

export default function StorefrontLoginPage() {
    const router = useRouter();
    const { loginWithGoogle, loginWithMicrosoft, isLoading, user } = useSupabaseAuth();

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

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
                        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl">🛒</span>
                        </div>
                        <CardTitle className="text-2xl font-bold mb-2 text-white">Tienda Online</CardTitle>
                        <p className="text-slate-400">Accede con tu cuenta</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* OAuth Buttons */}
                        <Button
                            variant="outline"
                            className="w-full h-12 text-base font-medium border-white/10 hover:bg-white/5 hover:text-white bg-transparent text-slate-200"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <GoogleIcon />
                            Continuar con Google
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full h-12 text-base font-medium border-white/10 hover:bg-white/5 hover:text-white bg-transparent text-slate-200"
                            onClick={handleMicrosoftLogin}
                            disabled={isLoading}
                        >
                            <MicrosoftIcon />
                            Continuar con Microsoft
                        </Button>

                        <div className="pt-4 text-center">
                            <p className="text-xs text-slate-500">
                                Al continuar, aceptas nuestros{' '}
                                <a href="/terms" className="text-blue-400 hover:underline">
                                    Términos de Servicio
                                </a>{' '}
                                y{' '}
                                <a href="/privacy" className="text-blue-400 hover:underline">
                                    Política de Privacidad
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
