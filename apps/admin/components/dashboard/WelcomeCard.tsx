'use client';

import React from 'react';
import { useAuth } from '@artifact/core';

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

            {/* 3D Illustration Placeholder - Using CSS shapes to mimic the vibe if image fails */}
            <div className="absolute right-4 bottom-0 w-64 h-64 pointer-events-none">
                {/* Simple geometric composition to represent the 3D character from the reference */}
                <div className="absolute bottom-0 right-4 w-40 h-48 bg-gradient-to-t from-blue-600 to-transparent opacity-20 rounded-t-full filter blur-xl"></div>
            </div>

            {/* Circle decorations */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
        </div>
    );
};

export default WelcomeCard;
