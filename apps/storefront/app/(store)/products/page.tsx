"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/storefront";
import ProductGrid from "@/components/store/ProductGrid";
import { useState } from "react";
import { Search, Package, Sparkles } from "lucide-react";
import { ClientIcon } from "@/components/client-icon";
import Link from "next/link";

// Category data with icons
const categories = [
  { id: "ropa", name: "Ropa", icon: "👕", count: 150 },
  { id: "calzado", name: "Calzado", icon: "👟", count: 80 },
  { id: "accesorios", name: "Accesorios", icon: "👜", count: 120 },
  { id: "tecnologia", name: "Tecnología", icon: "💻", count: 90 },
];

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", page, limit, category],
    queryFn: () => getProducts({ page, limit, category }),
  });

  const clearFilters = () => {
    setCategory(undefined);
    setSearchQuery("");
    setPriceRange("all");
    setSortBy("newest");
    setPage(1);
  };

  const products = data?.data || [];
  const totalPages = data?.pages || 1;

  // Filter products by search query (client-side for demo)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/10 via-neutral-900 to-black border border-white/10 p-8 md:p-12 mb-12">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,224,116,0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 mb-4">
            <ClientIcon icon={Sparkles} className="w-4 h-4 text-brand" />
            <span className="text-sm font-medium text-brand">Catálogo Completo</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Descubre Nuestro <span className="text-brand">Catálogo</span>
          </h1>

          <p className="text-lg text-neutral-400 max-w-2xl mb-8">
            Productos de calidad seleccionados especialmente para ti. Encuentra lo que necesitas con envío rápido y garantía de satisfacción.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 md:gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-brand">500+</div>
              <div className="text-sm text-neutral-400">Productos</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-brand">50+</div>
              <div className="text-sm text-neutral-400">Categorías</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-brand">4.8★</div>
              <div className="text-sm text-neutral-400">Valoración</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-brand">24h</div>
              <div className="text-sm text-neutral-400">Envío Express</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Category Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Explora por <span className="text-brand">Categoría</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setPage(1);
              }}
              className={`group p-6 rounded-2xl border transition-all duration-300 ${category === cat.id
                  ? 'bg-brand/10 border-brand shadow-[0_0_30px_rgba(0,224,116,0.2)]'
                  : 'bg-white/5 border-white/10 hover:border-brand/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,224,116,0.15)]'
                }`}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-white mb-1">{cat.name}</h3>
              <p className="text-sm text-neutral-400">{cat.count} productos</p>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <ClientIcon icon={Search} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-900/60 border border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Category Dropdown */}
          <select
            value={category || "all"}
            onChange={(e) => {
              setCategory(e.target.value === "all" ? undefined : e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg bg-neutral-900/60 border border-white/10 text-white focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Price Range */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-neutral-900/60 border border-white/10 text-white focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
          >
            <option value="all">Todos los precios</option>
            <option value="0-10000">Menos de $10.000</option>
            <option value="10000-50000">$10.000 - $50.000</option>
            <option value="50000+">Más de $50.000</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-neutral-900/60 border border-white/10 text-white focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
          >
            <option value="newest">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="popular">Más populares</option>
          </select>

          {/* Clear Filters */}
          {(category || searchQuery || priceRange !== "all" || sortBy !== "newest") && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-brand hover:text-brand/80 font-medium transition-colors"
            >
              Limpiar filtros
            </button>
          )}

          {/* Results count */}
          <div className="ml-auto text-sm text-neutral-500">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </div>
        </div>
      </div>

      {/* Loading State - Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse">
              <div className="aspect-square bg-neutral-800" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-neutral-800 rounded w-3/4" />
                <div className="h-6 bg-neutral-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Error al cargar productos</h3>
          <p className="text-neutral-400 mb-6">{error?.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center mb-6">
            <ClientIcon icon={Package} className="w-12 h-12 text-brand" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            No encontramos productos
          </h3>

          <p className="text-neutral-400 mb-6 text-center max-w-md">
            No hay productos que coincidan con tus filtros. Intenta ajustar los criterios de búsqueda.
          </p>

          <div className="flex gap-3">
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl bg-brand text-black font-semibold hover:shadow-[0_0_20px_rgba(0,224,116,0.4)] transition-all"
            >
              Limpiar filtros
            </button>

            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-white/10 text-white hover:border-brand/30 transition-all"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !isError && filteredProducts.length > 0 && (
        <ProductGrid products={filteredProducts} />
      )}

      {/* Pagination */}
      {!isLoading && !isError && filteredProducts.length > 0 && (
        <div className="flex justify-center mt-12 gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-6 py-3 rounded-xl border border-white/10 bg-neutral-900/50 text-white hover:bg-neutral-900 hover:border-brand/50 hover:shadow-[0_0_20px_rgba(0,224,116,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900/50 disabled:hover:border-white/10 disabled:hover:shadow-none transition-all"
          >
            Anterior
          </button>

          <span className="flex items-center px-6 py-3 rounded-xl border border-white/10 bg-neutral-900/50 text-neutral-300">
            Página {page} de {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-6 py-3 rounded-xl border border-white/10 bg-neutral-900/50 text-white hover:bg-neutral-900 hover:border-brand/50 hover:shadow-[0_0_20px_rgba(0,224,116,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900/50 disabled:hover:border-white/10 disabled:hover:shadow-none transition-all"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
