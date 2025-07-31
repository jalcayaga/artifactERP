// components/InventoryView.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Product, CreateProductDto, UpdateProductDto, UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductForm from '@/components/ProductForm';
import ProductDetailModal from '@/components/ProductDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PencilIcon, TrashIcon, EyeIcon, ArchiveBoxIcon, PlusIcon, CubeIcon } from '@/components/Icons';
import { formatCurrencyChilean } from '@/lib/utils';
import { ProductService } from '@/lib/services/productService';
import { useAuth } from '@/contexts/AuthContext';

const InventoryView: React.FC = () => {
  const { token, isAuthenticated, currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = useCallback(async (page: number = 1) => {
    if (!isAuthenticated || !token || currentUser?.role !== UserRole.ADMIN) {
      setError('No autorizado para ver esta página.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await ProductService.getAllProducts(token, page);
      
      const productsWithStock = await Promise.all(
        response.data.map(async (product) => {
          if (product.productType === 'PRODUCT') {
            const lots = await ProductService.getProductLots(product.id, token);
            const totalStock = lots.reduce((sum, lot) => sum + lot.currentQuantity, 0);
            return { ...product, totalStock };
          } else {
            return { ...product, totalStock: undefined }; // Services don't have stock
          }
        })
      );

      setProducts(productsWithStock);
      setTotalPages(response.pages);
      setCurrentPage(response.currentPage);
      setTotalProducts(response.total);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, currentUser]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

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
  
  const handleConfirmDeleteProduct = useCallback(async () => {
    if (productToDelete && token) {
      try {
        await ProductService.deleteProduct(productToDelete.id, token);
        fetchProducts(currentPage); // Re-fetch products after delete
        setProductToDelete(null);
        setShowDeleteConfirmModal(false);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Error al eliminar el producto.');
      }
    }
  }, [productToDelete, token, fetchProducts, currentPage]);

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

  const handleSaveProduct = useCallback(async (productData: Product) => {
    if (!token) return;
    try {
      if (editingProduct) {
        await ProductService.updateProduct(productData.id, productData as UpdateProductDto, token);
      } else {
        await ProductService.createProduct(productData as CreateProductDto, token);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      fetchProducts(currentPage); // Re-fetch products after save
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Error al guardar el producto.');
    }
  }, [editingProduct, token, fetchProducts, currentPage]);

  const handleCloseForm = useCallback(() => {
    setShowProductForm(false);
    setEditingProduct(null);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos de administrador.</div>;
  }

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
                                product.productType === 'PRODUCT' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary-foreground'
                            }`}>
                                {product.productType}
                            </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground text-right">{formatCurrencyChilean(product.price)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden md:table-cell">
                            {product.productType === 'PRODUCT' ? (product.totalStock ?? 'N/A') : 'N/A'}
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
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Añadir Primer Producto/Servicio</span>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        {products.length > 0 && totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} (Total: {totalProducts} productos)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-4 py-2 border rounded-md text-sm font-medium bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Anterior
              </button>
              <button
                className="px-4 py-2 border rounded-md text-sm font-medium bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
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