"use client";

import { Button } from "@artifact/ui";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { ClientIcon } from "./client-icon";

export default function HeroSection() {
    return (
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
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl leading-tight">
                Vende online con{" "}
                <span className="text-brand drop-shadow-[0_0_30px_rgba(0,224,116,0.5)]">
                    Artifact ERP
                </span>
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
                        suppressHydrationWarning
                        className="bg-brand text-black font-bold px-10 h-14 text-lg rounded-full shadow-[0_0_20px_rgba(0,224,116,0.3)] hover:shadow-[0_0_40px_rgba(0,224,116,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Ver Planes
                            <ClientIcon icon={ArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        {/* Ripple effect background */}
                        <span className="absolute inset-0 bg-gradient-to-r from-brand-light to-brand opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </Button>
                </Link>
                <Link href="/contacto">
                    <Button
                        size="lg"
                        variant="ghost"
                        className="border-2 border-white/20 text-white hover:bg-white/10 font-semibold px-10 h-14 text-lg rounded-full transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <ClientIcon icon={Play} className="w-5 h-5" />
                        Solicitar Demo
                    </Button>
                </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-neutral-500">
                {[
                    "Facturación SII incluida",
                    "Configuración en minutos",
                    "Soporte en español"
                ].map((text, i) => (
                    <div
                        key={text}
                        className="flex items-center gap-2 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
                    >
                        <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
                        <span>{text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
