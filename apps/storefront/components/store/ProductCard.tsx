import React from "react";
import Image from "next/image";
import Link from "next/link";
import Price from "./Price";
import { ShoppingCart } from "lucide-react";
import { ClientIcon } from "../client-icon";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    handle: string;
    thumbnail: string;
    price: number;
    currency: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add to cart with default variant
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.thumbnail,
    });
  };

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative block rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-brand/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,224,116,0.15)]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-800">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover overlay with text */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Ver detalles
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-brand transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <Price amount={product.price} currencyCode={product.currency} />

          {/* Quick add to cart button */}
          <button
            onClick={handleQuickAdd}
            className="p-2 rounded-full bg-brand/10 hover:bg-brand/20 border border-brand/20 hover:border-brand/40 transition-all group/btn"
            aria-label="Agregar al carrito"
          >
            <ClientIcon icon={ShoppingCart} className="w-4 h-4 text-brand group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
