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
                    setError("No pudimos cargar los productos. Intenta nuevamente.");
                    setProducts([]);
                })
                .finally(() => setIsLoading(false));
        }
    }, [tenant]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Productos</h1>

            {isLoading && (
                <p className="text-center text-gray-500">Cargando productos...</p>
            )}

            {!isLoading && error && (
                <p className="text-center text-red-500">{error}</p>
            )}

            {!isLoading && !error && products.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-slate-500">No hay productos disponibles.</p>
                </div>
            )}

            {!isLoading && !error && products.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
