// components/ProductForm.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArchiveBoxIcon, PlusIcon } from '@/components/Icons';

interface ProductFormProps {
  productData: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productData, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [productType, setProductType] = useState<'Producto' | 'Servicio'>('Producto');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(''); // Selling price
  const [unitPrice, setUnitPrice] = useState(''); // Cost price
  const [currentStock, setCurrentStock] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (productData) {
      setName(productData.name);
      setProductType(productData.productType);
      setSku(productData.sku || '');
      setDescription(productData.description || '');
      setCategory(productData.category || '');
      setPrice(productData.price.toString());
      setUnitPrice(productData.unitPrice?.toString() || '');
      setCurrentStock(productData.currentStock?.toString() || '');
      setIsPublished(productData.isPublished);
    } else {
      // Defaults for new product
      setName('');
      setProductType('Producto');
      setSku('');
      setDescription('');
      setCategory('');
      setPrice('');
      setUnitPrice('');
      setCurrentStock('');
      setIsPublished(true);
    }
    setErrors({});
  }, [productData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido.';
    if (!productType) newErrors.type = 'El tipo es requerido.';
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) newErrors.price = 'El precio de venta debe ser un número positivo o cero.';
    
    if (unitPrice.trim()){
      const unitPriceNum = parseFloat(unitPrice);
      if (isNaN(unitPriceNum) || unitPriceNum < 0) newErrors.unitPrice = 'El precio de costo debe ser un número positivo o cero.';
    }

    if (productType === 'Producto' && currentStock.trim()){
      const stockNum = parseInt(currentStock, 10);
      if (isNaN(stockNum) || stockNum < 0) newErrors.currentStock = 'El stock debe ser un número entero positivo o cero.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const stockValue = productType === 'Producto' ? (currentStock.trim() ? parseInt(currentStock, 10) : null) : null;

    onSave({
      id: productData?.id || '', // Let parent handle ID generation for new items
      name: name.trim(),
      productType,
      sku: sku.trim() || undefined,
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      price: parseFloat(price),
      unitPrice: unitPrice.trim() ? parseFloat(unitPrice) : undefined,
      currentStock: stockValue,
      isPublished,
      // images and longDescription can be added later
    });
  };

  const inputBaseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground";
  const selectBaseClass = `${inputBaseClass} pr-8`; // Added pr-8 for select arrow
  const errorTextClass = "mt-1 text-xs text-destructive";

  return (
    <Card className="max-w-3xl mx-auto border">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
            <ArchiveBoxIcon className="w-6 h-6 mr-2 text-primary" />
            {productData ? `Editar: ${productData.name}` : 'Nuevo Producto/Servicio'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="prod-name" className="block text-sm font-medium text-foreground">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input type="text" id="prod-name" value={name} onChange={(e) => setName(e.target.value)} className={inputBaseClass} aria-describedby="name-error"/>
              {errors.name && <p id="name-error" className={errorTextClass}>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="prod-type" className="block text-sm font-medium text-foreground">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select id="prod-type" value={productType} onChange={(e) => setProductType(e.target.value as 'Producto' | 'Servicio')} className={selectBaseClass} aria-describedby="type-error">
                <option value="Producto">Producto</option>
                <option value="Servicio">Servicio</option>
              </select>
              {errors.type && <p id="type-error" className={errorTextClass}>{errors.type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="prod-sku" className="block text-sm font-medium text-foreground">SKU</label>
              <input type="text" id="prod-sku" value={sku} onChange={(e) => setSku(e.target.value)} className={inputBaseClass} />
            </div>
            <div>
              <label htmlFor="prod-category" className="block text-sm font-medium text-foreground">Categoría</label>
              <input type="text" id="prod-category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputBaseClass} />
            </div>
          </div>
          
          <div>
            <label htmlFor="prod-description" className="block text-sm font-medium text-foreground">Descripción Corta</label>
            <textarea id="prod-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputBaseClass} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div>
              <label htmlFor="prod-price" className="block text-sm font-medium text-foreground">
                Precio Venta (sin IVA) <span className="text-red-500">*</span>
              </label>
              <input type="number" id="prod-price" value={price} onChange={(e) => setPrice(e.target.value)} className={inputBaseClass} placeholder="0.00" step="0.01" aria-describedby="price-error"/>
              {errors.price && <p id="price-error" className={errorTextClass}>{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="prod-unitPrice" className="block text-sm font-medium text-foreground">Precio Costo (sin IVA)</label>
              <input type="number" id="prod-unitPrice" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className={inputBaseClass} placeholder="0.00" step="0.01" aria-describedby="unitPrice-error"/>
              {errors.unitPrice && <p id="unitPrice-error" className={errorTextClass}>{errors.unitPrice}</p>}
            </div>
            {productType === 'Producto' && (
              <div>
                <label htmlFor="prod-currentStock" className="block text-sm font-medium text-foreground">Stock Actual</label>
                <input type="number" id="prod-currentStock" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} className={inputBaseClass} placeholder="0" step="1" aria-describedby="currentStock-error"/>
                {errors.currentStock && <p id="currentStock-error" className={errorTextClass}>{errors.currentStock}</p>}
              </div>
            )}
          </div>
          
          <div className="flex items-center pt-2">
            <input
              id="prod-isPublished"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="prod-isPublished" className="ml-2 block text-sm text-foreground">
              Publicado (visible en tienda/catálogo)
            </label>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2.5 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto order-1 sm:order-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{productData ? 'Actualizar' : 'Guardar'}</span>
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;