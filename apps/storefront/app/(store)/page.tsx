"use client";

import { useTenant } from "@/hooks/use-tenant";

// Componentes Modernos "con onda"
import Hero from "@/components/marketing/Hero";
import ParticleBackground from "@/components/marketing/ParticleBackground";
import SocialProof from "@/components/marketing/SocialProof";

export default function StorefrontPage() {
    const { tenant } = useTenant();

    return (
        <>
            <ParticleBackground />

            {/* Hero Moderno con onda */}
            <Hero />

            {/* Social Proof para dar confianza */}
            <SocialProof />
        </>
    );
}
