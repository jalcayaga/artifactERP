"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/storefront";
import Image from "next/image";
import Price from "@/components/store/Price";
import AddToCartButton from "@/components/store/AddToCartButton";
import { useState } from "react";

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
      <div className="container mx-auto p-4 text-center">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>Error al cargar el producto: {error?.message}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
        <p>El producto con el identificador &quot;{handle}&quot; no existe.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image Gallery */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || product.thumbnail}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          {/* Add more images here if product.images has more */}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="mb-6">
            <Price amount={product.price} currencyCode={product.currency} />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantity" className="font-medium">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 p-2 border rounded-md text-center"
            />
          </div>

          {/* Add to Cart Button */}
          <AddToCartButton product={product} quantity={quantity} />
        </div>
      </div>
    </div>
  );
}
