// components/ProductDetailModal.tsx
import React, { useEffect } from 'react';
import { Product } from '@/lib/types';
import { XIcon, CubeIcon, ArchiveBoxIcon, TagIcon, CheckCircleIcon, XCircleIcon } from '@/components/Icons'; // Added CheckCircleIcon, XCircleIcon

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number | boolean | React.ReactNode; icon?: React.FC<{className?: string}> }> = ({ label, value, icon: Icon }) => {
  let displayValue: React.ReactNode;

  if (typeof value === 'boolean') {
    displayValue = value ? 
        <span className="flex items-center text-emerald-600 dark:text-emerald-400"><CheckCircleIcon className="w-4 h-4 mr-1.5" /> Sí</span> : 
        <span className="flex items-center text-amber-600 dark:text-amber-400"><XCircleIcon className="w-4 h-4 mr-1.5" /> No</span>;
  } else if (value === undefined || value === null || value === '') {
    displayValue = <span className="italic text-muted-foreground">N/A</span>;
  } else {
    displayValue = value;
  }
  
  if (label.toLowerCase().includes("precio") || label.toLowerCase().includes("costo")) {
    if (typeof value === 'number') {
         displayValue = `$${value.toFixed(2)}`;
    } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
         displayValue = `$${parseFloat(value).toFixed(2)}`;
    }
  }


  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-2">
      <dt className="w-full sm:w-2/5 md:w-1/3 text-sm font-medium text-muted-foreground flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2 opacity-70 flex-shrink-0" />}
        {label}
      </dt>
      <dd className="w-full sm:w-3/5 md:w-2/3 mt-1 sm:mt-0 text-sm text-foreground break-words">
        {displayValue}
      </dd>
    </div>
  );
};

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  useEffect(() => {
    if (!product) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [product, onClose]);

  if (!product) return null;

  const ProductTypeIcon = product.productType === 'Producto' ? CubeIcon : ArchiveBoxIcon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-modal-title"
    >
      <div
        className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 sm:p-5 border-b">
          <div className="flex items-center">
            {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover mr-3 sm:mr-4" />
            ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted flex items-center justify-center mr-3 sm:mr-4">
                    <ProductTypeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                </div>
            )}
            <div>
                <h2 id="product-detail-modal-title" className="text-lg sm:text-xl font-semibold text-foreground leading-tight">
                    {product.name}
                </h2>
                <span className={`mt-1 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.productType === 'Producto' ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300' : 'bg-lime-500/10 text-lime-700 dark:text-lime-300'
                }`}>
                    {product.productType}
                </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ml-2"
            aria-label="Cerrar modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-1 overflow-y-auto">
          <dl className="divide-y divide-border/50">
            <DetailItem label="SKU" value={product.sku} icon={TagIcon} />
            <DetailItem label="Descripción" value={product.description} />
            <DetailItem label="Categoría" value={product.category} />
            <DetailItem label="Precio Venta (sin IVA)" value={product.price} />
            {product.productType === 'Producto' && product.unitPrice !== undefined && (
              <DetailItem label="Precio Costo (sin IVA)" value={product.unitPrice} />
            )}
            {product.productType === 'Producto' && (
              <DetailItem label="Stock Actual" value={product.currentStock} />
            )}
            <DetailItem label="Publicado" value={product.isPublished} />
             {product.longDescription && <DetailItem label="Descripción Larga" value={<p className="whitespace-pre-wrap">{product.longDescription}</p>} />}
          </dl>
        </div>

        <div className="px-4 py-3 sm:px-5 bg-muted/50 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;