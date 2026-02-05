import Link from 'next/link';

const services = [
    {
        phase: 'Fase 1',
        title: 'Identidad & Presencia',
        description: 'Creamos tu marca desde cero: logo, colores, tipografía y página web profesional que refleje la esencia de tu negocio.',
        icon: (props: any) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        ),
        features: [
            'Diseño de logo e identidad visual',
            'Página web responsive optimizada',
            'Dominio y hosting incluidos',
            'Manual de marca completo'
        ],
        accent: 'from-[#00E074]/20 to-emerald-500/20'
    },
    {
        phase: 'Fase 2',
        title: 'Redes & Community',
        description: 'Construimos y administramos tu presencia en redes sociales. Creamos contenido que conecta y convierte seguidores en clientes.',
        icon: (props: any) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        features: [
            'Creación de perfiles optimizados',
            'Gestión integral como CM',
            'Contenido visual y copywriting',
            'Reportes de crecimiento mensual'
        ],
        accent: 'from-cyan-500/20 to-[#00E074]/20'
    },
    {
        phase: 'Fase 3',
        title: 'CRM & Gestión',
        description: 'Con Chatwoot centralizamos todas las conversaciones. Cada mensaje de Instagram, Facebook o WhatsApp se gestiona profesionalmente.',
        icon: (props: any) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
        features: [
            'Bandeja unificada de mensajes',
            'Historial completo de clientes',
            'Respuestas automáticas',
            'Métricas de atención'
        ],
        accent: 'from-purple-500/20 to-[#00E074]/20'
    },
    {
        phase: 'Fase 4',
        title: 'Marketing & Ads',
        description: 'Campañas publicitarias estratégicas en Google y Meta que generan clientes reales. No gastes plata a ciegas.',
        icon: (props: any) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        features: [
            'Ads en Facebook e Instagram',
            'Google Ads (Búsqueda Local)',
            'Email marketing automatizado',
            'Análisis de ROI'
        ],
        accent: 'from-orange-500/20 to-[#00E074]/20'
    },
    {
        phase: 'Fase 5',
        title: 'E-commerce & POS',
        description: 'Tu tienda online que también funciona como POS en tu local. Vendes online y presencial desde la misma plataforma.',
        icon: (props: any) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        features: [
            'E-commerce integrado al SII',
            'POS para ventas en local',
            'Inventario sincronizado',
            'Facturación electrónica'
        ],
        accent: 'from-rose-500/20 to-[#00E074]/20'
    },
    {
        phase: 'Fase 6',
        title: 'Escalamiento',
        description: 'Automatizamos todo lo repetitivo para que te enfoques en crecer. Dashboard único para controlar todo tu negocio.',
        icon: (props: any) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        features: [
            'Marketing automatizado',
            'Dashboard unificado',
            'Reportes predictivos',
            'Escalamiento eficiente'
        ],
        accent: 'from-blue-500/20 to-[#00E074]/20'
    }
];

export default function Services() {
    return (
        <section className="relative overflow-hidden py-24" id="servicios">

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00E074]/30 bg-[#00E074]/10 px-4 py-2 ring-1 ring-[#00E074]/20">
                        <span className="text-sm font-medium text-[#00E074]">Servicios</span>
                    </div>

                    <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                        El camino completo hacia el{' '}
                        <span className="bg-gradient-to-r from-[#00E074] to-emerald-400 bg-clip-text text-transparent">
                            éxito digital
                        </span>
                    </h2>

                    <p className="text-lg leading-relaxed text-neutral-400">
                        No solo te damos herramientas. Te acompañamos desde que tienes solo una idea hasta que eres el referente digital de tu rubro.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#00E074]/50 hover:bg-neutral-900/80 hover:shadow-xl hover:shadow-[#00E074]/10"
                            >
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-30`} />

                                {/* Glow effect */}
                                <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#00E074]/0 via-[#00E074]/0 to-[#00E074]/0 opacity-0 blur transition-opacity duration-500 group-hover:from-[#00E074]/20 group-hover:via-[#00E074]/10 group-hover:to-transparent group-hover:opacity-100" />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00E074]/10 text-[#00E074] ring-1 ring-[#00E074]/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#00E074]/20 group-hover:shadow-lg group-hover:shadow-[#00E074]/50">
                                        <Icon className="h-8 w-8" />
                                    </div>

                                    {/* Phase badge */}
                                    <div className="mb-4 inline-block rounded-full bg-[#00E074]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00E074] ring-1 ring-[#00E074]/30">
                                        {service.phase}
                                    </div>

                                    {/* Title */}
                                    <h3 className="mb-4 text-2xl font-bold text-white transition-colors group-hover:text-[#00E074]">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mb-6 text-neutral-400 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-3">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                                                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00E074] shadow-sm shadow-[#00E074]" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-[#00E074]/20 bg-gradient-to-br from-[#00E074]/10 via-neutral-900/80 to-neutral-900/80 p-10 text-center backdrop-blur-sm shadow-2xl shadow-[#00E074]/10">
                    <h3 className="mb-4 text-3xl font-bold text-white">
                        ¿Listo para empezar tu transformación digital?
                    </h3>
                    <p className="mb-8 text-lg text-neutral-400">
                        Agenda un diagnóstico gratuito y descubre qué fase necesita tu negocio
                    </p>
                    <a
                        href="#contacto"
                        className="inline-flex items-center gap-2 rounded-full bg-[#00E074] px-10 py-5 text-lg font-bold text-black shadow-lg shadow-[#00E074]/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#00E074]/60"
                    >
                        Agendar Diagnóstico Gratis
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
