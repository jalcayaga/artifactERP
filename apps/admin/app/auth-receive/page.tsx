'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@artifact/core/client';
import { Loader2 } from 'lucide-react';

export default function AuthReceivePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Verificando credenciales...');

    useEffect(() => {
        const processToken = async () => {
            // Security Upgrade: Read from Hash instead of Query Param to avoid server logging
            let token = null;
            if (typeof window !== 'undefined') {
                const hash = window.location.hash;
                if (hash && hash.startsWith('#token=')) {
                    token = hash.substring(7); // Remove #token=
                }
            }

            // Fallback to query param if hash is empty (backward compatibility during transition)
            if (!token) {
                token = searchParams.get('token');
            }

            if (!token) {
                setStatus('No se encontró token de sesión. Redirigiendo al login...');
                setTimeout(() => router.push('/login'), 2000);
                return;
            }

            try {
                // 1. Store token in Supabase client
                const { data, error } = await supabase.auth.setSession({
                    access_token: token,
                    refresh_token: token, // In a real scenario, you'd pass the refresh token separately
                });

                if (error) {
                    console.error('Supabase session error:', error);
                    setStatus('Error al sincronizar sesión. Intenta ingresar manualmente.');
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                setStatus('Sesión sincronizada. Entrando al panel...');

                // Small delay to ensure session is set
                setTimeout(() => {
                    router.push('/');
                }, 800);

            } catch (error) {
                console.error('SSO Error:', error);
                setStatus('Error al procesar la sesión. Redirigiendo al login...');
                setTimeout(() => router.push('/login'), 2000);
            }
        };

        processToken();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mx-auto" />
                <h1 className="text-2xl font-bold text-white">Sincronizando Sesión</h1>
                <p className="text-slate-400">{status}</p>
            </div>
        </div>
    );
}
