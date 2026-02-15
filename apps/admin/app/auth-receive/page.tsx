'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthReceivePage() {
    const router = useRouter();
    const [status, setStatus] = useState('Verificando credenciales...');
    const [debugInfo, setDebugInfo] = useState<string[]>([]);

    const addDebug = (msg: string) => {
        console.log('[AUTH-RECEIVE]', msg);
        setDebugInfo(prev => [...prev, msg]);
    };

    useEffect(() => {
        const processAuth = async () => {
            try {
                addDebug('Iniciando proceso de autenticación SSO');

                // Extract token from URL hash
                let token = null;
                if (typeof window !== 'undefined') {
                    const hash = window.location.hash;
                    addDebug(`Hash de URL: ${hash.substring(0, 50)}...`);

                    if (hash && hash.includes('token=')) {
                        // Extract token from hash
                        const tokenMatch = hash.match(/token=([^&]+)/);
                        if (tokenMatch) {
                            token = tokenMatch[1];
                            addDebug(`Token extraído (primeros 50 chars): ${token.substring(0, 50)}...`);
                        }
                    }
                }

                if (!token) {
                    addDebug('No se encontró token en la URL');
                    setStatus('No se encontró token de sesión. Redirigiendo al login...');
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                setStatus('Validando token con Supabase...');
                addDebug('Importando cliente de Supabase...');

                const { supabase } = await import('@artifact/core/client');

                addDebug('Obteniendo información del usuario...');

                // Get user info from the token
                const { data: { user }, error: userError } = await supabase.auth.getUser(token);

                if (userError || !user) {
                    addDebug(`Error al obtener usuario: ${userError?.message || 'Usuario no encontrado'}`);
                    setStatus('Token inválido. Redirigiendo al login...');
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                addDebug(`Usuario encontrado: ${user.email}`);
                addDebug(`Metadata: ${JSON.stringify(user.user_metadata)}`);

                // Check if user has ERP access
                if (!user.user_metadata?.hasErpAccess) {
                    addDebug('Usuario no tiene acceso al ERP');
                    setStatus('No tienes acceso al panel administrativo');
                    setTimeout(() => router.push('/login'), 3000);
                    return;
                }

                addDebug('Usuario tiene acceso al ERP ✓');
                setStatus('Estableciendo sesión...');

                // Store the session manually in localStorage with Supabase format
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
                const storageKey = `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`;

                const sessionData = {
                    access_token: token,
                    token_type: 'bearer',
                    expires_in: 3600,
                    expires_at: Math.floor(Date.now() / 1000) + 3600,
                    refresh_token: token,
                    user: user,
                };

                addDebug(`Guardando sesión en localStorage con key: ${storageKey}`);
                localStorage.setItem(storageKey, JSON.stringify(sessionData));

                // Also trigger a storage event to notify other tabs/windows
                window.dispatchEvent(new StorageEvent('storage', {
                    key: storageKey,
                    newValue: JSON.stringify(sessionData),
                }));

                addDebug('Sesión almacenada en localStorage ✓');

                // Wait a bit to ensure the session is properly stored
                await new Promise(resolve => setTimeout(resolve, 500));

                addDebug('Verificando que la sesión se guardó...');
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    addDebug('✓ Sesión confirmada en localStorage');
                } else {
                    addDebug('⚠ Advertencia: No se pudo confirmar la sesión en localStorage');
                }

                setStatus('¡Sesión sincronizada! Entrando al panel...');
                addDebug('Redirigiendo al dashboard...');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);

            } catch (error) {
                addDebug(`Error en catch: ${error}`);
                console.error('SSO Error:', error);
                setStatus('Error al procesar la sesión. Redirigiendo al login...');
                setTimeout(() => router.push('/login'), 2000);
            }
        };

        processAuth();
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-2xl w-full">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mx-auto" />
                <h1 className="text-2xl font-bold text-white">Sincronizando Sesión</h1>
                <p className="text-slate-400">{status}</p>

                {/* Debug info */}
                <div className="mt-8 p-4 bg-slate-900 rounded-lg text-left">
                    <h3 className="text-sm font-mono text-cyan-400 mb-2">Debug Log:</h3>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                        {debugInfo.map((info, i) => (
                            <p key={i} className="text-xs font-mono text-slate-300">
                                {info}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
