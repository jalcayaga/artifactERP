"use client";

import { useEffect, useState } from "react";
import { getProducts, type Product } from "@/lib/storefront";
import { useTenant } from "@/hooks/use-tenant";
import { ProductCard } from "@/components/product-card";

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh] text-white">
            {/* Encabezado Simple de Catálogo */}
            <div className="border-b border-white/10 pb-6 mb-8 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Catálogo
                </h1>
                <p className="text-neutral-400 mt-2 text-sm">
                    Explora todos los productos disponibles.
                </p>
            </div>

            {isLoading && (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand"></div>
                </div>
            )}

            {!isLoading && !error && products.length === 0 && (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-neutral-400">No hay productos disponibles por el momento.</p>
                </div>
            )}

            {!isLoading && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
