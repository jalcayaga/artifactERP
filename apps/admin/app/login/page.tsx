'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import { Globe, ShieldCheck, LayoutGrid } from 'lucide-react';
import SpaceInvadersBackground from '@/components/SpaceInvadersBackground';
import { LoginChoiceCard } from '@/components/LoginChoiceCard'; // Assuming this is available in common components or copied

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { user, isLoading } = useSupabaseAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleERPSelect = () => {
    router.push('/login/admin');
  };

  const handleStorefrontSelect = () => {
    // Redirigir al storefront (ajustar según dominio real)
    window.location.href = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://artifact.cl/login';
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden font-inter">
      <SpaceInvadersBackground />

      {/* Header / Logo */}
      <div className="absolute top-12 flex flex-col items-center z-20 animate-in fade-in slide-in-from-top duration-1000">
        <div className="relative mb-4">
          <div className="absolute -inset-4 bg-[#00E074]/20 blur-xl rounded-full animate-pulse" />
          <LayoutGrid className="w-12 h-12 text-[#00E074] relative" />
        </div>
        <h1 className="text-3xl font-bold font-space-grotesk tracking-widest text-white uppercase">
          Artifact <span className="text-[#00E074]">ERP</span>
        </h1>
        <p className="text-slate-500 text-sm mt-2 tracking-widest uppercase font-medium">Internal Gateway</p>
      </div>

      <div className="w-full max-w-5xl px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 animate-in zoom-in-95 fade-in duration-500">
          {/* Option: Storefront */}
          <LoginChoiceCard
            title="Tienda Online"
            description="Accede como cliente para gestionar tus compras y pedidos."
            icon={Globe}
            features={[
              "Explorar Catálogo",
              "Historial de Compras",
              "Soporte Premium",
              "Ofertas Exclusivas"
            ]}
            buttonText="Ir a la Tienda"
            onClick={handleStorefrontSelect}
            variant="secondary"
          />

          {/* Option: ERP / Admin */}
          <LoginChoiceCard
            title="Panel Administrativo"
            description="Acceso exclusivo para empleados y gestión de operaciones."
            icon={ShieldCheck}
            features={[
              "Gestión de Inventario",
              "Facturación SII",
              "Control de Usuarios",
              "Análisis de Datos"
            ]}
            buttonText="Acceso ERP"
            onClick={handleERPSelect}
            variant="primary"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium z-20">
        Powered by Artifact Technologies • Administration System v2.0
      </div>
    </div>
  );
}
