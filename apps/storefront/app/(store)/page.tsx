"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/storefront";
import ProductGrid from "@/components/store/ProductGrid";
import { HeroSection } from "@/components/hero-section";

export default function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"], // Unique key for this query
    queryFn: () => getProducts({ limit: 4 }), // Fetch 4 products for the home page
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>Error al cargar productos: {error?.message}</p>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Productos Destacados</h1>
        <ProductGrid products={data.data} />
      </div>
    </>
  );
}
