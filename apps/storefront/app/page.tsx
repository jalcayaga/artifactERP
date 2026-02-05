"use client";

import { useEffect, useState } from "react";
import { getProducts, type Product } from "@/lib/storefront";
import { useTenant } from "@/hooks/use-tenant";
import { ProductCard } from "@/components/product-card";
import { HeroSection } from "@/components/hero-section";
import { PromotionalBanners } from "@/components/promotional-banners";
import { FeatureShowcase } from "@/components/feature-showcase";
import { Testimonials } from "@/components/testimonials";
import { NewsletterCta } from "@/components/newsletter-cta";
import { CategoryGrid } from "@/components/category-grid";

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
        <div className="space-y-16 md:space-y-20">
            <HeroSection />
            <CategoryGrid />
            <PromotionalBanners />
            <section className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <div>
                        <span className="uppercase tracking-wide text-sm text-brand font-semibold">
                            Catálogo en línea
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">
                            Productos destacados
                        </h2>
                    </div>
                </div>
                {isLoading && (
                    <p className="text-center text-gray-500">Cargando productos...</p>
                )}
                {!isLoading && error && (
                    <p className="text-center text-red-500">{error}</p>
                )}
                {!isLoading && !error && products.length === 0 && (
                    <div className="border border-dashed border-slate-200 rounded-2xl py-16 text-center">
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">
                            Estamos preparando la vitrina
                        </h3>
                        <p className="text-slate-500">
                            Aún no hay productos publicados para esta tienda. Vuelve pronto o
                            revisa nuestras soluciones SaaS.
                        </p>
                    </div>
                )}
                {!isLoading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
            <FeatureShowcase />
            <Testimonials />
            <NewsletterCta />
        </div>
    );
}
