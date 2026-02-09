import React from 'react';
import { ShoppingCart, BarChart3, FileText, Store, Package, TrendingUp } from 'lucide-react';

const features = [
    {
        icon: ShoppingCart,
        title: "E-commerce Profesional",
        description: "Tienda online personalizable con carrito, checkout y múltiples métodos de pago integrados."
    },
    {
        icon: BarChart3,
        title: "Panel Admin Completo",
        description: "Gestiona inventario, ventas, compras y visualiza reportes en tiempo real desde un solo lugar."
    },
    {
        icon: FileText,
        title: "Facturación Electrónica SII",
        description: "Genera boletas y facturas electrónicas automáticamente cumpliendo con la normativa chilena."
    },
    {
        icon: Store,
        title: "Multi-tenant",
        description: "Cada cliente obtiene su propia tienda personalizada con su dominio y branding único."
    },
    {
        icon: Package,
        title: "Inventario en Tiempo Real",
        description: "Control de stock, gestión de lotes, alertas de reorden y trazabilidad completa."
    },
    {
        icon: TrendingUp,
        title: "Reportes y Analytics",
        description: "Dashboards intuitivos con métricas de ventas, productos más vendidos y análisis de tendencias."
    }
];

export default function FeaturesSection() {
    return (
        <section className="py-20 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Todo lo que necesitas para vender online
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                        Artifact ERP combina e-commerce, gestión administrativa y facturación electrónica en una sola plataforma.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/30 transition-all duration-300 hover:bg-white/10"
                            >
                                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6 text-brand" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
