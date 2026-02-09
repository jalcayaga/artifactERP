import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@artifact/ui';
import Link from 'next/link';

const plans = [
    {
        name: "Starter",
        price: "$49.990",
        period: "/ mes",
        description: "Ideal para emprendedores y pequeños negocios",
        features: [
            "Hasta 100 productos",
            "Tienda online completa",
            "Panel admin incluido",
            "50 facturas SII/mes incluidas",
            "Dominio personalizado",
            "Soporte por email"
        ],
        cta: "Comenzar Ahora",
        href: "/registro?plan=starter",
        popular: false
    },
    {
        name: "Business",
        price: "$99.990",
        period: "/ mes",
        description: "Para negocios en crecimiento con alto volumen",
        features: [
            "Productos ilimitados",
            "200 facturas SII/mes incluidas",
            "Facturas adicionales: $150 c/u",
            "Soporte prioritario",
            "Analytics avanzados",
            "Integraciones API",
            "Backup diario automático"
        ],
        cta: "Comenzar Ahora",
        href: "/registro?plan=business",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Desde $249.990",
        period: "/ mes",
        description: "Solución a medida para grandes operaciones",
        features: [
            "Todo lo de Business",
            "Facturas SII ilimitadas",
            "White-label completo",
            "Infraestructura dedicada",
            "Soporte 24/7",
            "Consultoría estratégica",
            "SLA 99.9% garantizado"
        ],
        cta: "Solicitar Cotización",
        href: "/contacto?plan=enterprise",
        popular: false
    }
];

export default function PricingSection() {
    return (
        <section className="py-20 relative z-10" id="pricing">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Planes para cada etapa de tu negocio
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Precios transparentes que incluyen facturación electrónica SII. Sin costos ocultos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-3xl border-2 transition-all duration-300 ${plan.popular
                                ? 'border-brand bg-brand/5 scale-105'
                                : 'border-white/10 bg-white/5 hover:border-brand/30'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand text-black text-sm font-bold flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" />
                                    Más Popular
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="mb-2">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.period && <span className="text-neutral-400 ml-2">{plan.period}</span>}
                                </div>
                                <p className="text-neutral-400 text-sm">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                                        <span className="text-neutral-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.href} className="block">
                                <Button
                                    className={`w-full h-12 rounded-xl font-semibold transition-all ${plan.popular
                                        ? 'bg-brand text-black hover:bg-brand/90'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-neutral-400">
                        ¿Necesitas ayuda para elegir?{' '}
                        <Link href="/contacto" className="text-brand hover:text-brand/80 font-semibold">
                            Habla con nuestro equipo →
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
