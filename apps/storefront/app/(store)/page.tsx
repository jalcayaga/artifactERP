"use client";

import Link from "next/link";
import { Button } from "@artifact/ui";
import BlueprintGridBackground from "@/components/BlueprintGridBackground";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import PricingSection from "@/components/marketing/PricingSection";
import SocialProofSection from "@/components/marketing/SocialProofSection";
import DigitalServicesCarousel from "@/components/marketing/DigitalServicesCarousel";

export default function StorefrontPage() {
    return (
        <div className="min-h-screen bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))] relative overflow-hidden">
            {/* Background */}
            <BlueprintGridBackground />

            {/* HERO SECTION */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <HeroSection />
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--border-color))] to-transparent mb-16 relative z-10"></div>

            {/* MARKETING SECTIONS */}
            <FeaturesSection />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--border-color))] to-transparent my-16 relative z-10"></div>

            <HowItWorksSection />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--border-color))] to-transparent my-16 relative z-10"></div>

            <PricingSection />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--border-color))] to-transparent my-16 relative z-10"></div>

            {/* SECCIÓN DE SERVICIOS DIGITALES (VERTICAL BANNER STYLE) */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(var(--brand-rgb),0.2)] to-transparent my-16 relative z-10"></div>

            <DigitalServicesCarousel />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16 relative z-10"></div>

            {/* Final CTA Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border-color))]">
                    <h2 className="text-4xl md:text-5xl font-bold text-[rgb(var(--text-primary))] mb-4">
                        ¿Listo para digitalizar tu negocio?
                    </h2>
                    <p className="text-xl text-[rgb(var(--text-secondary))] mb-8">
                        Únete a más de 100 negocios chilenos que ya venden online con Artifact ERP.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="#pricing">
                            <Button
                                size="lg"
                                className="bg-brand text-black hover:bg-brand/90 font-bold px-10 h-14 text-lg rounded-full transition-all hover:scale-105"
                            >
                                Ver Planes y Precios
                            </Button>
                        </Link>
                        <Link href="/contacto">
                            <Button
                                size="lg"
                                variant="ghost"
                                className="border-2 border-[rgb(var(--border-color))] text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-secondary))] font-semibold px-10 h-14 text-lg rounded-full transition-all hover:scale-105"
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
