// components/ProductForm.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArchiveBoxIcon, PlusIcon } from '@/components/Icons';
import { UploadService } from '@/lib/services/uploadService';

interface ProductFormProps {
  productData: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productData, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [productType, setProductType] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(''); // Selling price
  const [unitPrice, setUnitPrice] = useState(''); // Cost price
  const [images, setImages] = useState<string[]>([]); // Existing image URLs
  const [newImages, setNewImages] = useState<File[]>([]); // Newly selected image files
  
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
      setImages(productData.images || []); // Initialize existing images
      
      setIsPublished(productData.isPublished);
    } else {
      // Defaults for new product
      setName('');
      setProductType('PRODUCT');
      setSku('');
      setDescription('');
      setCategory('');
      setPrice('');
      setUnitPrice('');
      setImages([]);
      setNewImages([]);
      
      setIsPublished(true);
    }
    setErrors({});
  }, [productData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleRemoveExistingImage = async (index: number) => {
    const imageUrlToRemove = images[index];
    const filename = imageUrlToRemove.split('/').pop(); // Extract filename from URL
    if (filename) {
      try {
        await UploadService.deleteImage(filename);
        setImages(prev => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting image from backend:', error);
        // Optionally, show an error message to the user
      }
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

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

    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let uploadedImageUrls: string[] = [];
    if (newImages.length > 0) {
      try {
        const uploadPromises = newImages.map(image => UploadService.uploadImage(image));
        const results = await Promise.all(uploadPromises);
        uploadedImageUrls = results.map(result => result.url);
      } catch (uploadError) {
        console.error('Error uploading new images:', uploadError);
        setErrors({ images: 'Error al subir las nuevas imágenes.' });
        return;
      }
    }

    const payload: any = {
      id: productData?.id || '', // Let parent handle ID generation for new items
      name: name.trim(),
      productType,
      sku: sku.trim() || undefined,
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      price: parseFloat(price),
      unitPrice: unitPrice.trim() ? parseFloat(unitPrice) : undefined,
      isPublished,
      images: [...images, ...uploadedImageUrls], // Combine existing and new uploaded images
      // longDescription can be added later
    };

    onSave(payload);
  };

  const inputBaseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground";
  const selectBaseClass = `${inputBaseClass} pr-8`; // Added pr-8 for select arrow
  const errorTextClass = "mt-1 text-xs text-destructive";

  const generateSku = () => {
    const cleanedName = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10); // Take first 10 alphanumeric chars
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    setSku(`${cleanedName}-${timestamp}`);
  };

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
              <select id="prod-type" value={productType} onChange={(e) => setProductType(e.target.value as 'PRODUCT' | 'SERVICE')} className={selectBaseClass} aria-describedby="type-error">
                <option value="PRODUCT">Producto</option>
                <option value="SERVICE">Servicio</option>
              </select>
              {errors.type && <p id="type-error" className={errorTextClass}>{errors.type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <label htmlFor="prod-sku" className="block text-sm font-medium text-foreground">SKU</label>
                <input type="text" id="prod-sku" value={sku} onChange={(e) => setSku(e.target.value)} className={inputBaseClass} />
              </div>
              <button
                type="button"
                onClick={generateSku}
                className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-md shadow-sm transition-colors duration-150"
                title="Generar SKU automáticamente"
              >
                Generar
              </button>
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
            
          </div>

          {/* Image Upload Section */}
          <div>
            <label htmlFor="prod-images" className="block text-sm font-medium text-foreground">Imágenes</label>
            <input 
              type="file" 
              id="prod-images" 
              multiple 
              accept="image/*" 
              onChange={handleImageChange} 
              className="mt-1 block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={image} className="relative group">
                  <img src={image} alt={`Producto ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-1 right-1 bg-destructive/80 text-destructive-foreground rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar imagen existente"
                  >
                    X
                  </button>
                </div>
              ))}
              {newImages.map((image, index) => (
                <div key={image.name} className="relative group">
                  <img src={URL.createObjectURL(image)} alt={`Nueva imagen ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-1 right-1 bg-destructive/80 text-destructive-foreground rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar nueva imagen"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
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