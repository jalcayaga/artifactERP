"use client";

import { Button, Input } from "@artifact/ui";
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2, CheckCircle, ShieldCheck, Zap, Globe } from "lucide-react";
import { ClientIcon } from "@/components/client-icon";
import { apiClient } from "@/lib/api";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";

// Mock Plans Data (In production, fetch from API)
const PLANS: any = {
    'social': {
        id: 'plan_social_ai',
        name: 'Artifact Social AI',
        price: 250000,
        features: [
            'Gestión de Redes Sociales con IA',
            '4 Posts Semanales Generados',
            'Respuesta Automática a Comentarios',
            'Dashboard de Métricas en Tiempo Real'
        ],
        icon: Globe
    },
    'visual': {
        id: 'plan_visual_soul',
        name: 'Visual Soul',
        price: 180000,
        features: [
            'Diseño de Identidad de Marca',
            'Logotipo y Manual de Uso',
            'Papelería Digital Básica',
            'Entrega en 5 días hábiles'
        ],
        icon: Zap
    }
};

export default function SubscribePage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const planKey = searchParams.get('plan') || 'social';
    const plan = PLANS[planKey] || PLANS['social'];

    const [isLoading, setIsLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("WEBPAY");

    // Form State (For Guest/Registration on the fly)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        rut: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            // 1. Create Subscription Order (Special Type)
            // Ideally, we have an endpoint specifically for subscription onboarding
            // For MVP, we likely reuse checkout but with a flag or specific logic

            // Simulating API Call
            console.log("Subscribing to:", plan.name, "via", selectedPayment);
            console.log("Customer:", isAuthenticated ? user : formData);

            // TODO: Call API to create subscription order
            // const res = await apiClient.post('/subscriptions/subscribe', { ... });

            // Mock success for UI demo
            setTimeout(() => {
                alert("¡Suscripción iniciada! Redirigiendo a pago...");
                setIsLoading(false);
            }, 1500);

        } catch (error) {
            console.error("Subscription failed", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">

            {/* LEFT PANEL: Plan Details & Branding */}
            <div className="w-full md:w-1/3 lg:w-2/5 p-8 md:p-12 bg-neutral-900 border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(0,224,116,0.15),transparent_50%)] z-0 pointer-events-none" />

                <div className="relative z-10">
                    <div className="mb-12">
                        <span className="text-brand font-bold tracking-widest text-sm uppercase">Artifact ERP</span>
                        <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white">
                            Suscripción <br /> <span className="text-brand">{plan.name}</span>
                        </h1>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-white">${plan.price.toLocaleString('es-CL')}</span>
                            <span className="text-neutral-400">/ mes</span>
                        </div>

                        <ul className="space-y-4">
                            {plan.features.map((feature: string, i: number) => (
                                <li key={i} className="flex items-center gap-3 text-neutral-300">
                                    <ClientIcon icon={CheckCircle} className="w-5 h-5 text-brand shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="relative z-10 mt-12 text-xs text-neutral-500">
                    <p className="flex items-center gap-2 mb-2">
                        <ClientIcon icon={ShieldCheck} className="w-4 h-4" />
                        Garantía de Satisfacción 100%
                    </p>
                    <p>
                        Cancelación flexible en cualquier momento. Sin contratos forzosos.
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL: Checkout Form */}
            <div className="w-full md:w-2/3 lg:w-3/5 p-8 md:p-12 lg:p-16 flex items-center justify-center">
                <div className="max-w-md w-full space-y-8">

                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-2">Configura tu Cuenta</h2>
                        <p className="text-neutral-400">
                            Completa tus datos para activar tu servicio inmediatamente.
                        </p>
                    </div>

                    {/* Auth / Guest Form */}
                    <div className="space-y-4">
                        {!isAuthenticated && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        name="name"
                                        placeholder="Tu Nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-neutral-900/50 border-white/10 text-white focus:border-brand/50"
                                    />
                                    <Input
                                        name="rut"
                                        placeholder="RUT Empresa"
                                        value={formData.rut}
                                        onChange={handleChange}
                                        className="bg-neutral-900/50 border-white/10 text-white focus:border-brand/50"
                                    />
                                </div>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Correo Electrónico Corporativo"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-neutral-900/50 border-white/10 text-white focus:border-brand/50"
                                />
                                <Input
                                    name="company"
                                    placeholder="Nombre de la Empresa"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="bg-neutral-900/50 border-white/10 text-white focus:border-brand/50"
                                />
                            </>
                        )}

                        {isAuthenticated && (
                            <div className="p-4 rounded-xl bg-brand/10 border border-brand/20 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand text-black flex items-center justify-center font-bold">
                                    {user?.firstName?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-sm text-neutral-400">{user?.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Checkbox: Autopay Agreement */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/30 border border-white/5">
                        <input type="checkbox" id="autopay" className="mt-1 accent-brand w-4 h-4" defaultChecked />
                        <label htmlFor="autopay" className="text-sm text-neutral-400 cursor-pointer">
                            Autorizo el cargo automático mensual en mi tarjeta. Entiendo que puedo cancelar la suscripción desde mi panel en cualquier momento.
                        </label>
                    </div>

                    {/* Payment Selector */}
                    <div className="pt-4">
                        <PaymentMethodSelector
                            selected={selectedPayment}
                            onSelect={setSelectedPayment}
                        />
                    </div>

                    {/* Action Button */}
                    <Button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className="w-full h-14 text-lg font-bold bg-brand text-black hover:shadow-[0_0_30px_rgba(0,224,116,0.4)] transition-all rounded-xl"
                    >
                        {isLoading ? (
                            <ClientIcon icon={Loader2} className="animate-spin mr-2" />
                        ) : (
                            `Pagar $${plan.price.toLocaleString('es-CL')}`
                        )}
                    </Button>

                    <p className="text-center text-xs text-neutral-600 mt-4">
                        Al suscribirte aceptas los <a href="#" className="underline hover:text-white">Términos del Servicio</a> y la <a href="#" className="underline hover:text-white">Política de Privacidad</a> de Artifact.
                    </p>

                </div>
            </div>
        </div>
    );
}
