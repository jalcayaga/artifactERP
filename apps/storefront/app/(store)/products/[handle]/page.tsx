"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/storefront";
import Image from "next/image";
import Price from "@/components/store/Price";
import AddToCartButton from "@/components/store/AddToCartButton";
import { useState } from "react";
import { ChevronLeft, Minus, Plus, Package, Truck, Shield, RefreshCw } from "lucide-react";
import { ClientIcon } from "@/components/client-icon";
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
      <div className="min-h-screen bg-black">
        <div className="container mx-auto p-4 text-center min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto p-4 text-center min-h-[60vh] flex items-center justify-center">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
            <p>Error al cargar el producto: {error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto p-4 text-center min-h-[60vh] flex items-center justify-center">
          <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-6">
            <h1 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h1>
            <p className="text-neutral-400">El producto solicitado no existe o no está disponible.</p>
            <Link href="/products" className="mt-4 inline-block text-brand hover:underline">
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 sm:mb-8 transition-colors group"
        >
          <ClientIcon icon={ChevronLeft} className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 hover:border-brand/30 hover:shadow-[0_0_40px_rgba(0,224,116,0.2)] transition-all duration-300">
              <Image
                src={product.images[0] || product.thumbnail}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-neutral-800 hover:border-brand hover:shadow-[0_0_20px_rgba(0,224,116,0.3)] transition-all"
                  >
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
                <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand mb-4 border border-brand/20">
                  {product.category}
                </span>
              )}

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <Price amount={product.price} currencyCode={product.currency} />
                <span className="text-sm text-green-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Disponible
                </span>
              </div>
            </div>

            <div className="prose prose-invert prose-emerald mb-8 text-neutral-300 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <ClientIcon icon={Truck} className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Envío Gratis</p>
                  <p className="text-xs text-neutral-400">En compras sobre $50.000</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <ClientIcon icon={RefreshCw} className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Devolución Gratis</p>
                  <p className="text-xs text-neutral-400">Hasta 30 días</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <ClientIcon icon={Shield} className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Compra Segura</p>
                  <p className="text-xs text-neutral-400">Pago encriptado SSL</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <ClientIcon icon={Package} className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Stock Disponible</p>
                  <p className="text-xs text-neutral-400">Despacho inmediato</p>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="mt-auto rounded-2xl border border-brand/30 bg-white/5 p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(0,224,116,0.1)]">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity Controls */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="quantity" className="text-sm font-medium text-neutral-400">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-neutral-900/50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Disminuir cantidad"
                    >
                      <ClientIcon icon={Minus} className="w-4 h-4 text-white" />
                    </button>

                    <span className="px-3 font-semibold min-w-[2rem] text-center">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-white/5 transition-all"
                      aria-label="Aumentar cantidad"
                    >
                      <ClientIcon icon={Plus} className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="flex-1">
                  <label className="text-sm font-medium text-neutral-400 mb-2 block sm:invisible">
                    &nbsp;
                  </label>
                  <AddToCartButton product={product} quantity={quantity} />
                </div>
              </div>

              <p className="mt-4 text-xs text-neutral-500 text-center">
                Envío calculado en el checkout • Garantía de devolución de 30 días
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
