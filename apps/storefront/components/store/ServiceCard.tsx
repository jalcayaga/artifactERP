
import React from 'react';
import Link from 'next/link';
import { Button } from '@artifact/ui';

interface ServiceProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    salesModel: 'ONE_TIME' | 'SUBSCRIPTION';
    sku: string;
}

interface ServiceCardProps {
    product: ServiceProduct;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ product }) => {
    const isSubscription = product.salesModel === 'SUBSCRIPTION';
    const priceFormatted = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.price);

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/30 p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#00E074]/30 hover:bg-neutral-900/50 hover:shadow-2xl hover:shadow-[#00E074]/10 hover:-translate-y-2">

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E074]/0 via-[#00E074]/0 to-[#00E074]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Badge */}
                <div className="mb-6 flex">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${isSubscription
                            ? 'border-[#00E074]/30 bg-[#00E074]/10 text-[#00E074]'
                            : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                        }`}>
                        {isSubscription ? 'Suscripción Mensual' : 'Pago Único'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-2xl font-bold text-white group-hover:text-[#00E074] transition-colors">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="mb-8 flex-grow text-sm leading-relaxed text-neutral-400">
                    {product.description}
                </p>

                {/* Price */}
                <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white tracking-tight">{priceFormatted}</span>
                    {isSubscription && <span className="text-sm text-neutral-500 font-medium">/ mes</span>}
                </div>

                {/* CTA */}
                <div className="mt-auto">
                    <Link href={`/cart/add/${product.id}`} className="w-full">
                        <Button
                            className="w-full rounded-full bg-white/5 border border-white/10 py-6 text-white transition-all hover:bg-[#00E074] hover:border-[#00E074] hover:text-black hover:font-bold group-hover:shadow-lg group-hover:shadow-[#00E074]/20"
                        >
                            <span className="flex items-center gap-2">
                                Contratar Ahora
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
