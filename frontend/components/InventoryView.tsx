// components/InventoryView.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductForm from '@/components/ProductForm';
import ProductDetailModal from '@/components/ProductDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PencilIcon, TrashIcon, EyeIcon, ArchiveBoxIcon, PlusIcon, CubeIcon } from '@/components/Icons';

const initialMockProducts: Product[] = [
  { id: 'prod_1', name: 'Laptop Pro 15"', productType: 'Producto', sku: 'LP15-001', description: 'Laptop de alto rendimiento para profesionales.', price: 1200.00, unitPrice: 950.00, currentStock: 50, category: 'Electrónica', isPublished: true, images: ['https://picsum.photos/seed/laptop1/400/300'] },
  { id: 'prod_2', name: 'Servicio de Consultoría Tech', productType: 'Servicio', sku: 'CONSULT-01', description: 'Consultoría especializada en soluciones TI.', price: 75.00, unitPrice: undefined, currentStock: null, category: 'Servicios', isPublished: true },
  { id: 'prod_3', name: 'Mouse Inalámbrico Ergo', productType: 'Producto', sku: 'ME-004', description: 'Mouse ergonómico para mayor comodidad.', price: 25.00, unitPrice: 15.00, currentStock: 150, category: 'Accesorios', isPublished: true, images: ['https://picsum.photos/seed/mouse1/400/300'] },
  { id: 'prod_4', name: 'Teclado Mecánico RGB', productType: 'Producto', sku: 'TM-RGB-07', description: 'Teclado mecánico con iluminación RGB personalizable.', price: 89.99, unitPrice: 60.00, currentStock: 0, category: 'Accesorios', isPublished: false },
  { id: 'prod_5', name: 'Soporte Técnico Remoto (Hora)', productType: 'Servicio', sku: 'SUP-REM-HR', description: 'Soporte técnico remoto por hora.', price: 50.00, unitPrice: undefined, currentStock: null, category: 'Servicios', isPublished: true },
];

const LOCAL_STORAGE_KEY_PRODUCTS = 'wolfflow_products';

const InventoryView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
      return storedProducts ? JSON.parse(storedProducts) : initialMockProducts;
    } catch (error) {
      console.error("Error loading products from localStorage:", error);
      return initialMockProducts;
    }
  });
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products to localStorage:", error);
    }
  }, [products]);

  const handleAddNewProduct = useCallback(() => {
    setEditingProduct(null);
    setShowProductForm(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  }, []);

  const handleDeleteProductRequest = useCallback((product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirmModal(true);
  }, []);
  
  const handleConfirmDeleteProduct = useCallback(() => {
    if (productToDelete) {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productToDelete.id));
      setProductToDelete(null);
      setShowDeleteConfirmModal(false);
    }
  }, [productToDelete]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setProductToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);

  const handleViewProduct = useCallback((product: Product) => {
    setViewingProduct(product);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setViewingProduct(null);
  }, []);

  const handleSaveProduct = useCallback((productData: Product) => {
    setProducts(prevProducts => {
      if (editingProduct) {
        return prevProducts.map(p => (p.id === productData.id ? productData : p));
      } else {
        const newId = productData.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return [...prevProducts, { ...productData, id: newId }];
      }
    });
    setShowProductForm(false);
    setEditingProduct(null);
  }, [editingProduct]);

  const handleCloseForm = useCallback(() => {
    setShowProductForm(false);
    setEditingProduct(null);
  }, []);

  if (showProductForm) {
    return (
      <ProductForm
        productData={editingProduct}
        onSave={handleSaveProduct}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Productos y Servicios
          </h1>
          <button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2"
            onClick={handleAddNewProduct}
            aria-label="Añadir Nuevo Producto o Servicio"
          >
            <PlusIcon className="w-5 h-5" /> 
            <span>Nuevo Producto/Servicio</span>
          </button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">SKU</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Precio Venta</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Stock</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Estado</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-accent transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-3 hidden sm:block" />
                            ) : (
                                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mr-3 hidden sm:block">
                                    <CubeIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                            )}
                            <div>
                                <div className="text-sm font-medium text-foreground">{product.name}</div>
                                <div className="text-xs text-muted-foreground sm:hidden">{product.sku || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{product.sku || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.productType === 'Producto' ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300' : 'bg-lime-500/10 text-lime-700 dark:text-lime-300'
                            }`}>
                                {product.productType}
                            </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground text-right">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden md:table-cell">
                            {product.productType === 'Producto' ? (product.currentStock ?? 'N/A') : 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm hidden lg:table-cell">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.isPublished ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          }`}>
                            {product.isPublished ? 'Publicado' : 'Borrador'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                            <button 
                              onClick={() => handleViewProduct(product)} 
                              title="Ver Detalles" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Ver detalles de ${product.name}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleEditProduct(product)} 
                              title="Editar Producto" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Editar producto ${product.name}`}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProductRequest(product)} 
                              title="Eliminar Producto" 
                              className="text-destructive hover:text-destructive/80 dark:hover:text-destructive/70 transition-colors p-1 rounded-md hover:bg-destructive/10"
                              aria-label={`Eliminar producto ${product.name}`}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <ArchiveBoxIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">No hay productos o servicios registrados</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Empieza añadiendo tu primer producto o servicio para gestionar tu inventario y catálogo.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAddNewProduct}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Añadir Primer Producto/Servicio</span>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {viewingProduct && (
        <ProductDetailModal 
          product={viewingProduct}
          onClose={handleCloseDetailModal}
        />
      )}

      {showDeleteConfirmModal && productToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteProduct}
          title="Confirmar Eliminación"
          message={<>¿Estás seguro de que quieres eliminar <strong>{productToDelete.name}</strong>? Esta acción no se puede deshacer.</>}
          confirmText="Eliminar"
          confirmButtonClass="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          icon={<TrashIcon className="w-5 h-5 mr-2" />}
        />
      )}
    </>
  );
};

export default InventoryView;