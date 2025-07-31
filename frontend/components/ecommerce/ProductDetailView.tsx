// frontend/components/ecommerce/ProductDetailView.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { ProductService } from '@/lib/services/productService';
import { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ShieldCheckIcon, ShoppingCartIcon, CheckCircleIcon, WrenchScrewdriverIcon, TagIcon, ArchiveBoxIcon, PlusIcon, MinusIcon } from '@/components/Icons';
import { formatCurrencyChilean } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface ProductDetailViewProps {
  productId: string;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [includeInstallation, setIncludeInstallation] = useState(false);
  const [showAddedToCartMessage, setShowAddedToCartMessage] = useState(false);

  const { addItem } = useCart();
  const router = useRouter();
  
  // Mocked installation service price, should come from Product data if service is a product itself
  const MOCK_INSTALLATION_PRICE = 50000; 

  useEffect(() => {
    if (!productId) {
        setIsLoading(false);
        setError("ID de producto no válido.");
        return;
    }
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedProduct = await ProductService.getPublishedProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          if (fetchedProduct.images && fetchedProduct.images.length > 0) {
            setSelectedImage(fetchedProduct.images[0]);
          }
        } else {
          setError('Producto no encontrado.');
        }
      } catch (err: any) {
        setError(err.message || 'No se pudo cargar el producto.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, includeInstallation);
      setShowAddedToCartMessage(true);
      setTimeout(() => setShowAddedToCartMessage(false), 3000); // Hide message after 3 seconds
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity, includeInstallation);
      router.push('/checkout');
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground min-h-[60vh] flex items-center justify-center">Cargando detalles del producto...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-destructive min-h-[60vh] flex items-center justify-center">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground min-h-[60vh] flex items-center justify-center">Producto no disponible.</div>;
  }
  
  const isService = product.productType === 'SERVICE';
  const stockAvailable = !isService && product.totalStock !== null && product.totalStock !== undefined && product.totalStock > 0;
  const canAddToCart = isService || (stockAvailable && product.totalStock! >= quantity);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* Image Gallery - spans 2 cols on lg screens */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-square bg-muted rounded-xl overflow-hidden border border-border shadow-sm sticky top-24">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="w-full h-full object-contain p-2" />
            ) : product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShieldCheckIcon className="w-24 h-24 text-muted-foreground opacity-30" />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all duration-150 ease-in-out
                              ${selectedImage === img ? 'border-primary shadow-md scale-105' : 'border-transparent hover:border-border hover:opacity-80'}`}
                >
                  <img src={img} alt={`${product.name} - thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info - spans 3 cols on lg screens */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-2">
            {product.category && <p className="text-sm font-medium text-primary uppercase tracking-wider">{product.category}</p>}
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">{product.name}</h1>
            {product.sku && <p className="text-xs text-muted-foreground flex items-center"><TagIcon className="w-3.5 h-3.5 mr-1.5"/> SKU: {product.sku}</p>}
          </div>

          <p className="text-3xl sm:text-4xl font-semibold text-primary">
            {formatCurrencyChilean(product.price)}
            <span className="text-sm text-muted-foreground ml-2">IVA Incluido</span>
          </p>
          
          {product.description && <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>}

          {product.productType === 'PRODUCT' && product.totalStock !== null && product.totalStock !== undefined && (
            <p className={`text-sm font-medium flex items-center ${product.totalStock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
              <ArchiveBoxIcon className="w-4 h-4 mr-1.5" />
              {product.totalStock > 0 ? `${product.totalStock} unidades disponibles` : 'Producto Agotado'}
            </p>
          )}
          
          <Card className="bg-muted/50 dark:bg-card/60 border-border/70">
            <CardContent className="p-4 space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-3">
                <label htmlFor="quantity" className="text-sm font-medium text-foreground">Cantidad:</label>
                <div className="flex items-center border border-input rounded-md bg-background shadow-sm">
                  <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-lg text-muted-foreground hover:bg-accent rounded-l-md transition-colors focus:outline-none focus:ring-1 focus:ring-primary" aria-label="Disminuir cantidad"><MinusIcon className="w-4 h-4"/></button>
                  <input 
                    type="number" 
                    id="quantity" 
                    name="quantity"
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value,10) || 1))}
                    className="w-12 text-center border-x border-input bg-transparent text-foreground focus:outline-none py-2 appearance-none [-moz-appearance:_textfield]"
                    aria-label="Cantidad de producto"
                  />
                  <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-lg text-muted-foreground hover:bg-accent rounded-r-md transition-colors focus:outline-none focus:ring-1 focus:ring-primary" aria-label="Aumentar cantidad"><PlusIcon className="w-4 h-4"/></button>
                </div>
              </div>

              {/* Installation Service Option */}
              {product.productType === 'PRODUCT' && ( // Only show for 'PRODUCT' type
                <div className="flex items-center space-x-2.5 pt-2">
                    <input
                    type="checkbox"
                    id="includeInstallation"
                    checked={includeInstallation}
                    onChange={(e) => setIncludeInstallation(e.target.checked)}
                    className="h-4 w-4 text-primary border-border rounded focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-card"
                    aria-label="Añadir servicio de instalación"
                    />
                    <label htmlFor="includeInstallation" className="text-sm text-foreground flex items-center cursor-pointer">
                    <WrenchScrewdriverIcon className="w-4 h-4 mr-1.5 text-primary/90"/>
                    Añadir Servicio de Instalación (+{formatCurrencyChilean(MOCK_INSTALLATION_PRICE)})
                    </label>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={!canAddToCart || isLoading}
                  className="w-full sm:w-auto flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-card transition-all duration-200 ease-in-out text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2.5" />
                  Añadir al Carrito
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={!canAddToCart || isLoading}
                  className="w-full sm:w-auto flex items-center justify-center bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:focus:ring-offset-card transition-all duration-200 ease-in-out text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Comprar Ahora
                </button>
              </div>
              
              {product.productType === 'PRODUCT' && product.totalStock !== null && product.totalStock !== undefined && product.totalStock < quantity && product.totalStock > 0 &&
                <p className="text-xs text-destructive mt-1">No hay suficiente stock. Solo {product.totalStock} unidades disponibles.</p>
              }
              {showAddedToCartMessage && (
                <div className="mt-3 flex items-center text-sm text-emerald-600 dark:text-emerald-400 transition-opacity duration-300">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  ¡Producto añadido al carrito!
                </div>
              )}
            </CardContent>
          </Card>

          {product.longDescription && (
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Detalles Adicionales:</h3>
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{product.longDescription}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
