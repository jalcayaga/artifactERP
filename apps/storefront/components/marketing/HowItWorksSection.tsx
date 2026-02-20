import React from 'react';
import { UserPlus, Settings, Package, Zap } from 'lucide-react';
import { ClientIcon } from '../client-icon';

const steps = [
    {
        number: "01",
        icon: UserPlus,
        title: "Crea tu cuenta",
        description: "Regístrate en minutos y obtén acceso inmediato a tu panel de administración y tienda online."
    },
    {
        number: "02",
        icon: Settings,
        title: "Personaliza tu tienda",
        description: "Configura tu branding, colores, logo y dominio personalizado. Hazla única para tu negocio."
    },
    {
        number: "03",
        icon: Package,
        title: "Agrega productos",
        description: "Carga tu catálogo de productos con fotos, descripciones, precios y gestiona tu inventario."
    },
    {
        number: "04",
        icon: Zap,
        title: "Vende y factura",
        description: "Comienza a vender online y genera facturas electrónicas automáticamente con el SII."
    }
];

export default function HowItWorksSection() {
    return (
        <section className="py-20 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[rgb(var(--text-primary))] mb-4">
                        Comienza en 4 pasos simples
                    </h2>
                    <p className="text-xl text-[rgb(var(--text-secondary))] max-w-2xl mx-auto">
                        Lanza tu tienda online en minutos, no en semanas. Sin complicaciones técnicas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative">
                                {/* Connector line (hidden on mobile, shown on desktop) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-brand/50 to-transparent" />
                                )}

                                <div className="relative text-center">
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-brand/10 border-2 border-brand/30 mb-4 relative">
                                        <ClientIcon icon={Icon} className="w-10 h-10 text-brand" />
                                        <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand text-black font-bold text-sm flex items-center justify-center">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-2">{step.title}</h3>
                                    <p className="text-[rgb(var(--text-secondary))] leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
