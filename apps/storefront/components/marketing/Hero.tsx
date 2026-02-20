import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid min-h-[90vh] items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16">
                    {/* Left: Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2">
                            <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span className="text-sm font-medium text-white/90">
                                Plataforma Todo-en-Uno para MicroPyMEs
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="space-y-6">
                            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                                Gestiona, Vende y{' '}
                                <span className="relative">
                                    <span className="relative z-10 bg-gradient-to-r from-brand via-emerald-400 to-brand bg-clip-text text-transparent">
                                        Crece
                                    </span>
                                    <span className="absolute -inset-1 -z-10 bg-gradient-to-r from-brand/30 to-emerald-400/30 dark:from-brand/50 dark:to-emerald-400/50" />
                                </span>{' '}
                                con Artifact
                            </h1>

                            <p className="max-w-xl text-lg leading-relaxed text-neutral-400 sm:text-xl">
                                La plataforma todo en uno para pymes chilenas. E-commerce, ERP y Facturación Electrónica en un solo lugar.
                            </p>
                        </div>

                        {/* Stats terminal */}
                        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 p-6 transition-all hover:border-brand/30">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <div className="text-3xl font-bold text-brand">+40%</div>
                                    <div className="text-sm text-neutral-500">Ventas</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-bold text-brand">-15h</div>
                                    <div className="text-sm text-neutral-500">Gestión</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-bold text-brand">100%</div>
                                    <div className="text-sm text-neutral-500">Control</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <Link href="#planes">
                                <button className="group relative overflow-hidden rounded-full bg-brand px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Ver Planes
                                        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </span>
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                            </Link>

                            <Link href="#contacto">
                                <button className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium text-white transition-all hover:border-brand/50 hover:bg-white/10">
                                    Diagnóstico Gratis
                                </button>
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-neutral-500">
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                <span>Integración con SII</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                <span>Sin contratos largos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                <span>Soporte en español</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Element - Clean Refactor */}
                    <div className="relative hidden lg:block">
                        <div className="relative aspect-square flex items-center justify-center">
                            {/* Floating card - Neutral background, no slate blue */}
                            <div className="relative z-10 w-96 animate-float rounded-2xl border border-white/10 bg-neutral-900/90 p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
                                        <svg
                                            className="h-6 w-6 text-brand"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Tu Negocio Online</h3>
                                        <p className="text-sm text-neutral-400">Operación profesional</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                                        <span className="text-sm text-neutral-300">Ofertas</span>
                                        <span className="text-sm font-medium text-brand">Limitadas</span>
                                    </div>

                                    <Link
                                        href="/products"
                                        className="flex items-center justify-between text-sm text-brand transition-colors hover:text-emerald-400"
                                    >
                                        <span>Ir a la tienda</span>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Subtle individual glow for the card itself - Blur removed */}
                            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 dark:bg-brand/20" />
                        </div>
                    </div>
                </div>
            </div>



            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        </section>
    );
}
