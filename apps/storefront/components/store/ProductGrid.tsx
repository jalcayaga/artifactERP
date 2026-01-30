import React from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    handle: string;
    thumbnail: string;
    price: number;
    currency: string;
  }>;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
