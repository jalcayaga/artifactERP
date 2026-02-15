'use client';

import React from 'react';
import { useAuth } from '@artifact/core/client';;

interface WelcomeCardProps {
    stats: {
        newLeads: number;
        conversion: number;
    };
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ stats }) => {
    const { currentUser } = useAuth();

    // Get greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Buenos días";
        if (hour < 18) return "Buenas tardes";
        return "Buenas noches";
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 p-8 shadow-lg text-white h-full min-h-[220px]">
            {/* Content */}
            <div className="relative z-10 max-w-[60%]">
                <h2 className="text-2xl font-bold mb-2">
                    {getGreeting()}, {currentUser?.firstName || 'Usuario'}
                </h2>
                <p className="text-blue-50 mb-8 max-w-sm">
                    Aquí tienes un resumen de lo que está pasando en Artifact hoy.
                </p>

                <div className="flex gap-8">
                    <div>
                        <p className="text-3xl font-bold">{stats.newLeads}</p>
                        <p className="text-sm text-blue-100 font-medium">Nuevos Leads</p>
                    </div>
                    <div className="w-px bg-white/20 h-full min-h-[40px]" />
                    <div>
                        <p className="text-3xl font-bold">{stats.conversion}%</p>
                        <p className="text-sm text-blue-100 font-medium">Conversión</p>
                    </div>
                </div>
            </div>

            {/* 3D Illustration */}
            <img
                src="https://demos.creative-tim.com/material-dashboard-react/static/media/rocket-white.45db47dc.png"
                alt="Welcome Character"
                className="absolute right-0 bottom-0 h-full max-h-[200px] object-contain opacity-90 mr-4 mb-2"
            />

            {/* Circle decorations */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
        </div>
    );
};

export default WelcomeCard;
