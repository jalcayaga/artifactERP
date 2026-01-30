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
    <Link href={`/products/${product.handle}`}>
      <div className="group block">
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:opacity-75 transition-opacity duration-300"
          />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{product.name}</h3>
        <Price amount={product.price} currencyCode={product.currency} />
      </div>
    </Link>
  );
};

export default ProductCard;
