import Link from 'next/link';

const plans = [
    {
        name: 'Plan Despega',
        price: '$150.000',
        period: '/ mes',
        description: 'La base para lanzar tu marca al mundo digital con una imagen profesional.',
        features: [
            'Identidad de Marca Completa',
            'Página Web Profesional',
            'Hosting y Dominio .CL',
            'Manual de marca completo',
            'Soporte por email'
        ],
        cta: 'Comenzar Ahora',
        href: '/registro?plan=despega',
        popular: false
    },
    {
        name: 'Plan Consolida',
        price: '$350.000',
        period: '/ mes',
        description: 'Para negocios que buscan crecer, atraer clientes y gestionar su comunidad.',
        features: [
            'Todo lo del Plan Despega',
            'Community Manager Dedicado',
            'Campañas en Google y Meta',
            'CRM integrado (Chatwoot)',
            'Reportes mensuales detallados',
            'Soporte prioritario'
        ],
        cta: 'Elegir Plan',
        href: '/registro?plan=consolida',
        popular: true
    },
    {
        name: 'Plan Lidera',
        price: 'A Medida',
        period: '',
        description: 'La solución completa para ser líder digital con e-commerce y automatización.',
        features: [
            'Todo lo del Plan Consolida',
            'E-commerce y POS Integrado',
            'Automatización de Marketing',
            'Facturación electrónica SII',
            'Dashboard unificado',
            'Soporte 24/7'
        ],
        cta: 'Cotizar',
        href: '/registro?plan=lidera',
        popular: false
    }
];

export default function Pricing() {
    return (
        <section className="relative overflow-hidden py-24" id="planes">

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00E074]/20 bg-[#00E074]/5 px-4 py-2">
                        <svg className="h-4 w-4 text-[#00E074]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-sm font-medium text-[#00E074]">Planes</span>
                    </div>

                    <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                        Planes diseñados para{' '}
                        <span className="bg-gradient-to-r from-[#00E074] to-emerald-400 bg-clip-text text-transparent">
                            cada etapa
                        </span>
                    </h2>

                    <p className="text-lg leading-relaxed text-neutral-400">
                        Elige el plan que se adapte a tu MicroPyME. Todos incluyen acompañamiento experto.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
                    {plans.map((plan, index) => {
                        const isPopular = plan.popular;

                        return (
                            <div
                                key={index}
                                className={`relative flex flex-col rounded-3xl border backdrop-blur-sm transition-all duration-500 ${isPopular
                                    ? 'scale-100 border-[#00E074]/30 bg-neutral-900 shadow-2xl shadow-[#00E074]/20 lg:scale-105 lg:-translate-y-4'
                                    : 'border-white/5 bg-neutral-900/30 hover:border-[#00E074]/20 hover:bg-neutral-900/50'
                                    }`}
                            >
                                {/* Popular Badge */}
                                {isPopular && (
                                    <div className="absolute -top-5 left-0 right-0 flex justify-center">
                                        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00E074] to-emerald-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-[#00E074]/50">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                            Más Popular
                                        </div>
                                    </div>
                                )}

                                {/* Glow effect for popular */}
                                {isPopular && (
                                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#00E074]/30 via-[#00E074]/10 to-[#00E074]/30 opacity-50 blur" />
                                )}

                                <div className={`relative flex flex-col p-8 ${isPopular ? 'pt-10' : ''}`}>
                                    {/* Plan Name */}
                                    <h3 className="mb-2 text-xl font-bold text-white">{plan.name}</h3>

                                    {/* Price */}
                                    <div className="mb-4 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                                        {plan.period && (
                                            <span className="text-sm text-neutral-500">{plan.period}</span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="mb-8 text-sm leading-relaxed text-neutral-400">
                                        {plan.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="mb-8 flex-grow space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                                                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPopular ? 'bg-[#00E074]/20' : 'bg-white/5'
                                                    }`}>
                                                    <svg className={`h-3.5 w-3.5 ${isPopular ? 'text-[#00E074]' : 'text-[#00E074]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <Link href={plan.href}>
                                        {isPopular ? (
                                            <button className="group relative w-full overflow-hidden rounded-full bg-[#00E074] py-4 text-center font-bold text-black shadow-lg shadow-[#00E074]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00E074]/50">
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {plan.cta}
                                                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-[#00E074] opacity-0 transition-opacity group-hover:opacity-100" />
                                            </button>
                                        ) : (
                                            <button className="group w-full rounded-full border border-white/10 bg-white/5 py-4 text-center font-medium text-white transition-all hover:border-[#00E074]/50 hover:bg-white/10">
                                                <span className="flex items-center justify-center gap-2">
                                                    {plan.cta}
                                                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                </span>
                                            </button>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mx-auto mt-16 max-w-4xl rounded-3xl border border-[#00E074]/10 bg-gradient-to-r from-neutral-900/50 via-neutral-900/30 to-neutral-900/50 p-8 text-center backdrop-blur-sm md:p-12">
                    <div className="mb-6">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00E074]/10">
                            <svg
                                className="h-8 w-8 text-[#00E074]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
                            ¿No estás seguro qué plan elegir?
                        </h3>
                        <p className="text-neutral-400">
                            Agenda una llamada de 15 minutos y te ayudamos a encontrar la mejor opción para tu negocio
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <a
                            href="#contacto"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00E074] px-8 py-4 font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00E074]/50"
                        >
                            Hablar con un Experto
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </a>

                        <a
                            href="#servicios"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-medium text-white transition-all hover:border-[#00E074]/50 hover:bg-white/10"
                        >
                            Ver Servicios Incluidos
                        </a>
                    </div>
                </div>

                {/* Trust indicator */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-[#00E074]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Sin permanencia</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-[#00E074]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Cancela cuando quieras</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-[#00E074]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Garantía de 30 días</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
