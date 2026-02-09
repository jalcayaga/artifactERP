"use client";

import { Button } from "@artifact/ui";
import Link from "next/link";
import SpaceInvadersBackground from "@/components/SpaceInvadersBackground";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import PricingSection from "@/components/marketing/PricingSection";
import SocialProofSection from "@/components/marketing/SocialProofSection";
import { ArrowRight, Play } from "lucide-react";

export default function StorefrontPage() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background */}
            <SpaceInvadersBackground />

            {/* HERO SECTION */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="py-20 md:py-32 flex flex-col items-center text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                        </span>
                        <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">
                            Plataforma E-commerce Chilena
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl">
                        Vende online con{" "}
                        <span className="text-brand">Artifact ERP</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                        E-commerce + Admin + Facturación SII.
                        <br />
                        La plataforma completa para tu negocio en Chile.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="#pricing">
                            <Button
                                size="lg"
                                className="bg-brand text-black hover:bg-brand/90 font-bold px-10 h-14 text-lg rounded-full shadow-[0_0_20px_rgba(0,224,116,0.3)] transition-all hover:scale-105 flex items-center gap-2"
                            >
                                Ver Planes
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/contacto">
                            <Button
                                size="lg"
                                variant="ghost"
                                className="border-2 border-white/20 text-white hover:bg-white/10 font-semibold px-10 h-14 text-lg rounded-full transition-all hover:scale-105 flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                Solicitar Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-neutral-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand"></div>
                            <span>Facturación SII incluida</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand"></div>
                            <span>Configuración en minutos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand"></div>
                            <span>Soporte en español</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16 relative z-10"></div>

            {/* MARKETING SECTIONS */}
            <FeaturesSection />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16 relative z-10"></div>

            <HowItWorksSection />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16 relative z-10"></div>

            <PricingSection />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16 relative z-10"></div>

            <SocialProofSection />

            {/* Final CTA Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border border-brand/20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        ¿Listo para digitalizar tu negocio?
                    </h2>
                    <p className="text-xl text-neutral-400 mb-8">
                        Únete a más de 100 negocios chilenos que ya venden online con Artifact ERP.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="#pricing">
                            <Button
                                size="lg"
                                className="bg-brand text-black hover:bg-brand/90 font-bold px-10 h-14 text-lg rounded-full shadow-[0_0_20px_rgba(0,224,116,0.3)] transition-all hover:scale-105"
                            >
                                Ver Planes y Precios
                            </Button>
                        </Link>
                        <Link href="/contacto">
                            <Button
                                size="lg"
                                variant="ghost"
                                className="border-2 border-white/20 text-white hover:bg-white/20 font-semibold px-10 h-14 text-lg rounded-full transition-all hover:scale-105"
                            >
                                Hablar con Ventas
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
