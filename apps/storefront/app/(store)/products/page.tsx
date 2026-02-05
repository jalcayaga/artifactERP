"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/storefront";
import ProductGrid from "@/components/store/ProductGrid";
import { useState } from "react";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", page, limit, category], // Unique key for this query
    queryFn: () => getProducts({ page, limit, category }),
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

  const products = data?.data || [];
  const totalPages = data?.pages || 1;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00E074]/20 bg-[#00E074]/5 px-4 py-2 mb-4">
          <span className="text-sm font-medium text-[#00E074]">Catálogo</span>
        </div>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Nuestros <span className="text-[#00E074]">Productos</span>
        </h1>
        <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
          Explora nuestra selección de productos de alta calidad pensados para ti.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="category-filter" className="font-medium text-neutral-300">Categoría:</label>
          <select
            id="category-filter"
            className="w-full sm:w-48 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-[#00E074] focus:outline-none focus:ring-1 focus:ring-[#00E074]"
            value={category || "all"}
            onChange={(e) => setCategory(e.target.value === "all" ? undefined : e.target.value)}
          >
            <option value="all" className="bg-neutral-900">Todas</option>
            <option value="ropa" className="bg-neutral-900">Ropa</option>
            <option value="calzado" className="bg-neutral-900">Calzado</option>
            <option value="accesorios" className="bg-neutral-900">Accesorios</option>
          </select>
        </div>

        <div className="text-sm text-neutral-500">
          Mostrando {products.length} productos
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-white/5 bg-neutral-900/30 p-12 text-center">
          <p className="text-neutral-400 text-lg">No se encontraron productos para esta categoría.</p>
          <button
            onClick={() => setCategory(undefined)}
            className="mt-4 text-[#00E074] hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-12 gap-3">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="rounded-lg border border-white/10 bg-neutral-900/50 px-4 py-2 text-white hover:bg-neutral-900 hover:border-[#00E074]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Anterior
        </button>
        <span className="flex items-center rounded-lg border border-white/10 bg-neutral-900/50 px-4 py-2 text-neutral-300">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="rounded-lg border border-white/10 bg-neutral-900/50 px-4 py-2 text-white hover:bg-neutral-900 hover:border-[#00E074]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
