"use client";

import Link from "next/link";
import { Button } from "@artifact/ui";
import SpaceInvadersBackground from "@/components/SpaceInvadersBackground";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import PricingSection from "@/components/marketing/PricingSection";
import SocialProofSection from "@/components/marketing/SocialProofSection";
import DigitalServicesCarousel from "@/components/marketing/DigitalServicesCarousel";

export default function StorefrontPage() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background */}
            <SpaceInvadersBackground />

            {/* HERO SECTION */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <HeroSection />
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

            {/* SECCIÓN DE SERVICIOS DIGITALES (VERTICAL BANNER STYLE) */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00E074]/20 to-transparent my-16 relative z-10"></div>

            <DigitalServicesCarousel />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16 relative z-10"></div>

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
