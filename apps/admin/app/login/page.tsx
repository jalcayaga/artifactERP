'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@artifact/ui';
import SpaceInvadersBackground from '@/components/SpaceInvadersBackground';
import { ShoppingBag, Building2, ArrowRight } from 'lucide-react';

export default function UnifiedLoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative bg-black flex items-center justify-center">
      <SpaceInvadersBackground />

      <div className="relative z-10 w-full max-w-5xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-brand/20 border border-brand/30 rounded-3xl mx-auto mb-6 flex items-center justify-center transform -rotate-3 shadow-[0_0_40px_rgba(0,224,116,0.2)]">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Bienvenido a Artifact
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Selecciona cómo deseas acceder a la plataforma
          </p>
        </div>

        {/* Two Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Storefront Option */}
          <Card
            className="bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl hover:border-brand/30 transition-all duration-300 cursor-pointer group"
            onClick={() => router.push('/login/storefront')}
          >
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <ShoppingBag className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Tienda Online
              </CardTitle>
              <p className="text-slate-400 text-sm">
                Acceso para clientes
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  Ver catálogo de productos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  Realizar pedidos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  Seguimiento de órdenes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  Gestionar perfil
                </li>
              </ul>

              <button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors group-hover:bg-blue-600">
                Ingresar a la Tienda
                <ArrowRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>

          {/* ERP Option */}
          <Card
            className="bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl hover:border-brand/30 transition-all duration-300 cursor-pointer group"
            onClick={() => router.push('/login/admin')}
          >
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Building2 className="w-8 h-8 text-brand" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Panel ERP
              </CardTitle>
              <p className="text-slate-400 text-sm">
                Acceso para empleados
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  Gestión de inventario
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  Ventas y facturación
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  Reportes y análisis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  Administración completa
                </li>
              </ul>

              <button className="w-full h-12 bg-brand hover:bg-brand/90 text-black font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors group-hover:bg-brand/90">
                Ingresar al ERP
                <ArrowRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500">
            ¿Necesitas ayuda? <a href="mailto:soporte@artifact.cl" className="text-brand hover:underline">Contáctanos</a>
          </p>
        </div>
      </div>
    </div>
  );
}
