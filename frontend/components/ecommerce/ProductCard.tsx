// frontend/components/ecommerce/ProductCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next Image
import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card'; // Usar Card de shadcn/ui
import { ShieldCheckIcon, CubeIcon, WrenchScrewdriverIcon } from '@/components/Icons'; // Para imagen placeholder y tipo

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const TypeIcon = product.productType === 'Producto' ? CubeIcon : WrenchScrewdriverIcon;

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="overflow-hidden shadow-md hover:shadow-xl dark:hover:shadow-primary/30 transition-all duration-300 h-full flex flex-col border border-border hover:border-primary/50 dark:hover:border-primary/40">
        <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image // MODIFIED: Replaced <img> with <Image>
              src={product.images[0]}
              alt={product.name || 'Imagen de producto'}
              fill // Use fill to cover the container
              className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Optional: provide sizes for better optimization
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/50">
              <ShieldCheckIcon className="w-20 h-20 text-muted-foreground opacity-20" />
            </div>
          )}
          {/* Product Type Badge */}
          <div className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center
            ${product.productType === 'Producto' 
              ? 'bg-primary/20 text-primary-foreground dark:bg-primary/30 dark:text-primary-foreground' 
              : 'bg-secondary/20 text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground'}`}>
            <TypeIcon className="w-3 h-3 mr-1.5"/>
            {product.productType}
          </div>
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 
            className="text-md font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>
          {product.category && (
            <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
          )}
          <div className="mt-auto pt-2">
            <p className="text-xl font-bold text-primary">
              {typeof product.price === 'number' 
                ? product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
                : 'Consultar'}
            </p>
            {product.productType === 'Producto' && product.currentStock !== null && product.currentStock !== undefined && (
              <p className={`text-xs mt-1 font-medium ${product.currentStock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                {product.currentStock > 0 ? `${product.currentStock} en stock` : 'Agotado'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
