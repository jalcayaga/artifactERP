"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/storefront";
import Image from "next/image";
import Price from "@/components/store/Price";
import AddToCartButton from "@/components/store/AddToCartButton";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage({
  params,
}: { params: { handle: string } }) {
  const { handle } = params;
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => getProduct(handle),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E074]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 text-center min-h-[60vh] flex items-center justify-center">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          <p>Error al cargar el producto: {error?.message}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center min-h-[60vh] flex items-center justify-center">
        <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h1>
          <p className="text-neutral-400">El producto solicitado no existe o no está disponible.</p>
          <Link href="/products" className="mt-4 inline-block text-[#00E074] hover:underline">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50">
            <Image
              src={product.images[0] || product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Thumbnails placeholder */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <div key={idx} className="relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-neutral-800 hover:border-brand">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            {product.category && (
              <span className="inline-block rounded-full bg-[#00E074]/10 px-3 py-1 text-xs font-medium text-[#00E074] mb-4">
                {product.category}
              </span>
            )}
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <Price amount={product.price} currencyCode={product.currency} />
              {/* Optional: Add stock status here */}
              <span className="text-sm text-green-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Disponible
              </span>
            </div>
          </div>

          <div className="prose prose-invert prose-emerald mb-8 text-neutral-300 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="mt-auto rounded-2xl border border-white/10 bg-neutral-900/30 p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <label htmlFor="quantity" className="text-sm font-medium text-neutral-400">Cantidad</label>
                <div className="flex items-center rounded-lg border border-white/10 bg-black/50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-white hover:bg-white/10 text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 bg-transparent text-center text-white focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-white hover:bg-white/10 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="w-full pt-6 sm:pt-0">
                <AddToCartButton product={product} quantity={quantity} />
              </div>
            </div>
            <p className="mt-4 text-xs text-neutral-500 text-center sm:text-left">
              Envío calculado en el checkout. Garantía de devolución de 30 días.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
