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

    // Datos dinámicos del cliente (Fallback a valores por defecto si no hay tenant)
    const storeName = tenant?.tenant?.name || "Tu Tienda";
    const heroTitle = `Bienvenido a ${storeName}`;
    const heroSubtitle = "Explora nuestra colección exclusiva de productos y servicios digitales.";

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

            {/* Background Ambience (Estilo Pro) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-brand/10 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] opacity-30"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* HERO SECTION ("La Imagen Pro" para tus clientes) */}
                <div className="py-20 md:py-32 flex flex-col items-center text-center space-y-8">

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                        </span>
                        <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">
                            Tienda Oficial
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl">
                        {heroTitle}
                    </h1>

                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        {heroSubtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/products">
                            <Button size="lg" className="bg-brand text-black hover:bg-brand/90 font-bold px-10 h-14 text-lg rounded-full shadow-[0_0_20px_rgba(0,224,116,0.3)] transition-all hover:scale-105">
                                Ver Productos
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16"></div>

                {/* CATALOG SECTION */}
                <div className="space-y-10 pb-20">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Destacados</h2>
                            <p className="text-neutral-500">Lo mejor de nuestra selección para ti.</p>
                        </div>
                        <Link href="/products" className="hidden sm:block text-brand hover:text-brand/80 font-medium transition-colors">
                            Ver todo el catálogo →
                        </Link>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
                        </div>
                    )}

                    {!isLoading && !error && products.length === 0 && (
                        <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                            <h3 className="text-xl font-medium text-white mb-2">Catálogo en preparación</h3>
                            <p className="text-neutral-400">Pronto agregaremos productos increíbles.</p>
                        </div>
                    )}

                    {!isLoading && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product, index) => (
                                <div key={product.id} className="group relative animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="sm:hidden text-center pt-8">
                        <Link href="/products" className="text-brand font-medium">
                            Ver todo el catálogo →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
