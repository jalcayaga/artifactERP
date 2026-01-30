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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>

      {/* Dummy Filters */}
      <div className="mb-6 flex gap-4 items-center">
        <label htmlFor="category-filter" className="font-medium">Categoría:</label>
        <select
          id="category-filter"
          className="border rounded-md p-2"
          value={category || "all"}
          onChange={(e) => setCategory(e.target.value === "all" ? undefined : e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="ropa">Ropa</option>
          <option value="calzado">Calzado</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="text-center">
          <p>No se encontraron productos para esta categoría.</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      {/* Dummy Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
