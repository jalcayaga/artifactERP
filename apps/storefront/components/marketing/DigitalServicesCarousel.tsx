
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@artifact/ui';
import { motion } from 'framer-motion';

const services = [
    {
        id: '1',
        name: 'Artifact Social',
        subtitle: 'Community Manager Híbrido',
        description: '30 ideas de posts, captions y hashtags generados por IA, curados por expertos.',
        price: '$250.000',
        period: '/mes',
        icon: (
            <svg className="w-8 h-8 text-[#00E074]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
        ),
        gradient: "from-[#00E074]/20 via-transparent to-transparent"
    },
    {
        id: '2',
        name: 'Visual Soul',
        subtitle: 'Identidad Visual IA',
        description: '20 imágenes fotorrealistas de alta resolución para tu marca. Dirección de arte incluida.',
        price: '$80.000',
        period: 'único',
        icon: (
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        gradient: "from-purple-500/20 via-transparent to-transparent"
    },
    {
        id: '3',
        name: 'Neural Video',
        subtitle: 'Reels & TikToks Auto',
        description: 'Pack de 4 videos virales. Edición, subtítulos y ganchos emocionales optimizados.',
        price: '$120.000',
        period: '/mes',
        icon: (
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        gradient: "from-blue-500/20 via-transparent to-transparent"
    },
    {
        id: '4',
        name: 'Zen Workflow',
        subtitle: 'Automatización n8n',
        description: 'Tu secretaria virtual. Responde correos y agenda citas automáticamente.',
        price: '$150.000',
        period: '+ mant.',
        icon: (
            <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
        gradient: "from-orange-500/20 via-transparent to-transparent"
    }
];

export default function DigitalServicesCarousel() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Potencia tu Negocio con <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E074] to-emerald-500">IA + Humano</span>
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        Servicios digitales diseñados para liberar tu tiempo. La eficiencia de la Inteligencia Artificial con la dirección creativa de expertos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className="group relative rounded-3xl border border-white/5 bg-neutral-900/40 p-1 backdrop-blur-sm transition-all hover:-translate-y-2 hover:border-white/10"
                        >
                            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${service.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />

                            <div className="relative h-full flex flex-col p-6 rounded-[20px] bg-[#0A0A0A]/80">
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                    {service.icon}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">{service.name}</h3>
                                <p className="text-sm font-medium text-[#00E074] mb-4">{service.subtitle}</p>

                                <p className="text-sm text-neutral-400 leading-relaxed mb-6 flex-grow">
                                    {service.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-end justify-between mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Desde</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-white">{service.price}</span>
                                                <span className="text-xs text-neutral-500">{service.period}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all text-sm h-10"
                                    >
                                        Ver Detalles
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
