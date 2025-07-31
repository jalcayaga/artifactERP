// frontend/components/ecommerce/ProductCatalogView.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next Image
import { ProductService } from '@/lib/services/productService';
import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card'; // Removed CardHeader, CardTitle as they are not used in ProductCard
import { ShieldCheckIcon, ShoppingCartIcon, CubeIcon } from '@/components/Icons'; 

// Reutilizando ProductCard de la Home Page, o podría ser uno más específico si es necesario.
// Por simplicidad, asumimos que ProductCardHome puede ser usado o adaptado.
interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 h-full flex flex-col border border-border">
        <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image // MODIFIED: Replaced <img> with <Image>
              src={product.images[0]} 
              alt={product.name || 'Imagen de producto'}
              fill // Use fill to cover the container
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Example sizes
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <CubeIcon className="w-20 h-20 text-muted-foreground opacity-50" />
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="text-md font-semibold text-foreground mb-1 group-hover:text-primary transition-colors truncate" title={product.name || 'Nombre no disponible'}>
            {product.name || 'Nombre no disponible'}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">{product.category || 'Seguridad'}</p>
          <p className="text-lg font-bold text-primary mt-auto">
            {product.price ? product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : 'Precio no disponible'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};


const ProductCatalogView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Paginación y filtros

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await ProductService.getPublishedProducts(1, 20); // Cargar más productos para el catálogo
        setProducts(response.data);
      } catch (err: any) {
        setError(err.message || 'No se pudieron cargar los productos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Catálogo de Productos de Seguridad</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Encuentra la tecnología que necesitas para proteger tu hogar o negocio.
        </p>
      </div>

      {/* TODO: Añadir filtros aquí */}
      {/* <div className="mb-8 p-4 bg-card border rounded-lg">Filtros (Próximamente)</div> */}

      {isLoading && <p className="text-center text-muted-foreground py-10">Cargando productos...</p>}
      {error && <p className="text-center text-destructive py-10">{error}</p>}
      
      {!isLoading && !error && products.length === 0 && (
        <div className="text-center py-20">
          <ShoppingCartIcon className="mx-auto h-20 w-20 text-muted-foreground opacity-40" />
          <h3 className="mt-4 text-xl font-semibold text-foreground">Catálogo Vacío</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            No hay productos disponibles en este momento. Vuelve a intentarlo más tarde.
          </p>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* TODO: Añadir paginación aquí */}
    </div>
  );
};

export default ProductCatalogView;
