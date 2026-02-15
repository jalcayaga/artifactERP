'use client';

import React from 'react';
import { useAuth } from '@artifact/core/client';
import { ArrowRight } from 'lucide-react';

const WelcomeBanner: React.FC = () => {
    const { currentUser } = useAuth();
    const firstName = currentUser?.firstName || 'Usuario';

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] p-8 text-white shadow-lg shadow-blue-500/20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Bienvenido, {firstName}!</h2>
                    <p className="text-blue-50 mb-6 max-w-sm">
                        Revisa todas las estadísticas de tu negocio en tiempo real.
                    </p>

                    <div className="flex gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[120px]">
                            <p className="text-xs text-blue-100 mb-1">Total Sales</p>
                            <p className="text-2xl font-bold">$23.5k</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[120px]">
                            <p className="text-xs text-blue-100 mb-1">New Leads</p>
                            <p className="text-2xl font-bold">1,240</p>
                        </div>
                    </div>
                </div>

                {/* Illustration Placeholder - Replicating the 3D character look with CSS/SVG if possible or clean UI */}
                <div className="hidden md:flex justify-end relative h-48">
                    {/* Simple CSS Composition resembling a 3D character or scene */}
                    <div className="relative w-40 h-40">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-300 to-pink-500 rounded-full animate-float opacity-90 blur-sm"></div>
                        <div className="absolute inset-2 bg-gradient-to-bl from-white/40 to-white/10 backdrop-blur-md rounded-full border border-white/50 flex items-center justify-center">
                            <span className="text-6xl">🚀</span>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-4 -right-4 bg-white text-blue-600 p-2 rounded-xl shadow-lg animate-bounce duration-[3000ms]">
                            <span className="text-xs font-bold">New!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBanner;
