"use client";

import { useEffect, useState } from "react";
import { getProducts, type Product } from "@/lib/storefront";
import { useTenant } from "@/hooks/use-tenant";
import { ProductCard } from "@/components/product-card";
import { Button } from "@artifact/ui";
import Link from "next/link";

export default function StorefrontPage() {
    const { tenant } = useTenant();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (tenant?.tenant?.slug) {
            setIsLoading(true);
            setError(null);
            getProducts({ tenantSlug: tenant.tenant.slug })
                .then((res) => {
                    setProducts(res?.data ?? []);
                })
                .catch(() => {
                    setError("No pudimos cargar los productos.");
                    setProducts([]);
                })
                .finally(() => setIsLoading(false));
        }
    }, [tenant]);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] opacity-40"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] opacity-30"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

                {/* Retail Hero - Focus on Shopping */}
                <div className="text-center mb-16 space-y-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                        <span className="text-xs font-medium tracking-widest uppercase text-neutral-300">Nuevos Ingresos</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                        Descubre <span className="text-brand opacity-90">Digital Assets</span>
                    </h1>

                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Herramientas profesionales para potenciar tu negocio hoy mismo.
                    </p>
                </div>

                {/* Product Grid Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-semibold">Destacados</h2>
                        <Link href="/products" className="text-sm text-brand hover:text-brand/80 font-medium transition-colors">
                            Ver todo el catálogo →
                        </Link>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
                        </div>
                    )}

                    {!isLoading && !error && products.length === 0 && (
                        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <p className="text-neutral-400">El catálogo se está actualizando...</p>
                        </div>
                    )}

                    {!isLoading && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product, index) => (
                                <div key={product.id} className="group relative">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
