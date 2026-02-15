import React from 'react';
import { Star, Quote } from 'lucide-react';
import { ClientIcon } from '../client-icon';

const testimonials = [
    {
        name: "María González",
        business: "Boutique Luna",
        location: "Viña del Mar",
        rating: 5,
        text: "Artifact transformó mi negocio. Pasé de vender solo en local a tener clientes en todo Chile. La facturación automática me ahorra horas cada semana.",
        metric: "+300%",
        metricLabel: "Aumento en ventas"
    },
    {
        name: "Carlos Muñoz",
        business: "Ferretería El Maestro",
        location: "Concepción",
        rating: 5,
        text: "Lo mejor es que todo está integrado. Vendo en la tienda física y online, y el inventario se actualiza solo. Ya no pierdo ventas por falta de stock.",
        metric: "1 semana",
        metricLabel: "Para estar online"
    },
    {
        name: "Andrea Silva",
        business: "Pastelería Dulce Hogar",
        location: "Santiago",
        rating: 5,
        text: "El panel admin es súper intuitivo. Puedo ver mis ventas, productos más vendidos y generar reportes sin ser experta en tecnología. Excelente soporte.",
        metric: "500+",
        metricLabel: "Pedidos mensuales"
    }
];

export default function SocialProofSection() {
    return (
        <section className="py-20 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Negocios reales, resultados reales
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Más de 100 negocios chilenos ya confían en Artifact ERP para vender online.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/30 hover:shadow-[0_0_30px_rgba(0,224,116,0.15)] transition-all duration-300 flex flex-col"
                        >
                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <ClientIcon key={i} icon={Star} className="w-5 h-5 fill-brand text-brand" />
                                ))}
                            </div>

                            {/* Testimonial text */}
                            <p className="text-neutral-300 leading-relaxed mb-6 flex-grow">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>

                            {/* Metric */}
                            <div className="p-4 rounded-xl bg-brand/10 border border-brand/20 mb-4">
                                <div className="text-3xl font-bold text-brand">{testimonial.metric}</div>
                                <div className="text-sm text-neutral-400">{testimonial.metricLabel}</div>
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                <div className="w-12 h-12 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center">
                                    <span className="text-lg font-bold text-brand">
                                        {testimonial.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{testimonial.name}</div>
                                    <div className="text-sm text-neutral-400">
                                        {testimonial.business} • {testimonial.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust badges */}
                <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-neutral-500 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-brand">✓</div>
                        <span>Certificado SII</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-brand">✓</div>
                        <span>SSL Seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-brand">✓</div>
                        <span>Soporte en Español</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-brand">✓</div>
                        <span>Datos en Chile</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
