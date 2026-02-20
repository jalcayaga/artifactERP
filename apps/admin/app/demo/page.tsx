'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpaceInvadersBackground from '@/components/SpaceInvadersBackground';
import { Card, Typography, Spinner } from '@material-tailwind/react';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

/**
 * Auto-login page for demo mode
 * Automatically logs in as demo@artifact.cl and redirects to the portal
 */
export default function DemoAutoLoginPage() {
    const router = useRouter();

    useEffect(() => {
        const performAutoLogin = async () => {
            try {
                // Call the backend auth endpoint
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-tenant-slug': 'demo',
                    },
                    body: JSON.stringify({
                        email: 'demo@artifact.cl',
                        password: 'Demo!2025',
                    }),
                });

                if (!response.ok) {
                    throw new Error('Auto-login failed');
                }

                const data = await response.json();

                // Store the token
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Redirect to portal after a brief moment
                    setTimeout(() => {
                        router.push('/portal');
                    }, 1500);
                }
            } catch (error) {
                console.error('Demo auto-login error:', error);
                // Fallback to manual login
                router.push('/login');
            }
        };

        performAutoLogin();
    }, [router]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <SpaceInvadersBackground />
            </div>

            {/* Loading Card */}
            <Card
                {...({} as any)}
                className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 p-12 rounded-[2rem] shadow-[0_0_60px_rgba(16,185,129,0.3)] max-w-md mx-4 animate-in zoom-in-95 fade-in duration-700"
            >
                <div className="flex flex-col items-center gap-8 text-center">
                    {/* Icon */}
                    <div className="p-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 animate-pulse">
                        <RocketLaunchIcon className="h-16 w-16 text-emerald-500" />
                    </div>

                    {/* Text */}
                    <div className="space-y-3">
                        <Typography {...({} as any)} variant="h3" color="white" className="font-extrabold">
                            Bienvenido al Demo
                        </Typography>
                        <Typography {...({} as any)} variant="lead" className="text-blue-gray-400 font-medium">
                            Preparando tu experiencia completa de Artifact ERP...
                        </Typography>
                    </div>

                    {/* Spinner */}
                    <Spinner {...({} as any)} className="h-12 w-12 text-emerald-500" />

                    {/* Info */}
                    <div className="pt-4 border-t border-white/10 w-full">
                        <Typography {...({} as any)} variant="small" className="text-blue-gray-500 font-medium">
                            🎭 Modo Demo • 30 días de datos reales
                        </Typography>
                    </div>
                </div>
            </Card>
        </div>
    );
}
