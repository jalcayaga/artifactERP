'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductService } from '@/lib/services/productService';
import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCartIcon, CubeIcon, SearchIcon } from '@/components/Icons';
import { Input } from '@/components/ui/input'; // Assuming you have a generic Input component
import { Button } from '@/components/ui/button'; // Assuming you have a generic Button component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming you have a Select component

interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 h-full flex flex-col border border-border">
        <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name || 'Imagen de producto'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12; // Adjusted for better catalog display

  // Hardcoded categories for now
  const categories = [
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'iluminacion', label: 'Iluminación' },
    { value: 'automatizacion', label: 'Automatización' },
    { value: 'energia', label: 'Energía' },
    { value: 'comunicacion', label: 'Comunicación' },
  ];

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ProductService.getPublishedProducts(
        currentPage,
        productsPerPage,
        selectedCategory
      );
      setProducts(response.data);
      setTotalPages(response.pages);
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar los productos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, productsPerPage, selectedCategory, searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? undefined : value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page on applying filters
    fetchProducts();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Catálogo de Productos de Seguridad</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Encuentra la tecnología que necesitas para proteger tu hogar o negocio.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 p-4 bg-card border rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="col-span-full md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Buscar Producto</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">Categoría</label>
          <Select onValueChange={handleCategoryChange} value={selectedCategory || 'all'}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-foreground mb-1">Precio Mín.</label>
            <Input
              id="minPrice"
              type="number"
              placeholder="Mínimo"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-foreground mb-1">Precio Máx.</label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="Máximo"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
        <div className="col-span-full md:col-span-4 flex justify-end">
          <Button onClick={handleApplyFilters} className="w-full md:w-auto">Aplicar Filtros</Button>
        </div>
      </div>

      {isLoading && <p className="text-center text-muted-foreground py-10">Cargando productos...</p>}
      {error && <p className="text-center text-destructive py-10">{error}</p>}

      {!isLoading && !error && products.length === 0 && (
        <div className="text-center py-20">
          <ShoppingCartIcon className="mx-auto h-20 w-20 text-muted-foreground opacity-40" />
          <h3 className="mt-4 text-xl font-semibold text-foreground">Catálogo Vacío</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            No hay productos disponibles que coincidan con los filtros.
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

      {/* Paginación */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalogView;