import React from "react";
import Image from "next/image";
import Link from "next/link";
import Price from "./Price";

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
  return (
    <Link href={`/products/${product.handle}`} className="group relative block rounded-2xl border border-white/10 bg-neutral-900/40 p-3 backdrop-blur-sm transition-all hover:border-[#00E074]/50 hover:bg-neutral-900/60 hover:shadow-lg hover:shadow-[#00E074]/10">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-800">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay hover effect */}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
      </div>

      <div className="mt-4 px-1 pb-2">
        <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[#00E074]">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <Price amount={product.price} currencyCode={product.currency} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
