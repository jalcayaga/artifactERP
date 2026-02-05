'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  UserRole,
  formatCurrencyChilean,
} from '@artifact/core';
import {
  ProductService,
  useAuth,
} from '@artifact/core/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
} from '@artifact/ui';
import { ColumnDef } from '@tanstack/react-table';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArchiveBoxIcon,
  PlusIcon,
  CubeIcon,
} from '@artifact/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProductForm from './ProductForm';
import ProductDetailModal from './ProductDetailModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';

type InventoryProduct = Product & {
  totalStock?: number;
};

const PAGE_SIZE = 10;

const InventoryView: React.FC = () => {
  const { token, isAuthenticated, currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<InventoryProduct | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<InventoryProduct | null>(null);

  const isAdmin =
    currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPERADMIN;

  const productsQuery = useQuery({
    queryKey: ['products', token, currentPage, PAGE_SIZE],
    enabled: Boolean(isAuthenticated && token && isAdmin),
    placeholderData: (prev: any) => prev,
    queryFn: async (): Promise<{
      data: InventoryProduct[];
      total: number;
      pages: number;
      currentPage: number;
    }> => {
      if (!token) {
        throw new Error('Sesión expirada. Vuelve a iniciar sesión para continuar.');
      }

      const response = await ProductService.getAllProducts(token, currentPage, PAGE_SIZE);

      const productsWithStock: InventoryProduct[] = await Promise.all(
        response.data.map(async (product: Product) => {
          if (product.productType === 'PRODUCT') {
            try {
              const lots = await ProductService.getProductLots(product.id, token);
              const totalStock = lots.reduce((sum, lot) => sum + lot.currentQuantity, 0);
              return { ...product, totalStock };
            } catch (error) {
              console.error('Error fetching lots for product', product.id, error);
              return { ...product, totalStock: undefined };
            }
          }
          return { ...product, totalStock: undefined };
        })
      );

      return {
        data: productsWithStock,
        total: response.total,
        pages: response.pages,
        currentPage: response.currentPage,
      };
    },
  });

  const products = productsQuery.data?.data ?? [];
  const totalPages = productsQuery.data?.pages ?? 1;
  const totalProducts = productsQuery.data?.total ?? 0;

  const saveProductMutation = useMutation({
    mutationFn: async ({
      payload,
      technicalSheetFile,
    }: {
      payload: CreateProductDto & Partial<UpdateProductDto> & { id?: string };
      technicalSheetFile: File | null;
    }) => {
      if (!token) {
        throw new Error('Sesión expirada. Vuelve a iniciar sesión para continuar.');
      }

      let savedProduct: Product;
      if (payload.id) {
        const { id, ...rest } = payload;
        savedProduct = await ProductService.updateProduct(
          id,
          rest as UpdateProductDto,
          token
        );
      } else {
        savedProduct = await ProductService.createProduct(payload as CreateProductDto, token);
      }

      if (technicalSheetFile && savedProduct.id) {
        await ProductService.uploadTechnicalSheet(savedProduct.id, technicalSheetFile, token);
      }

      return savedProduct;
    },
    onSuccess: (product) => {
      toast.success(`Producto ${product.name} guardado correctamente.`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowProductForm(false);
      setEditingProduct(null);
    },
    onError: (error: any) => {
      console.error('Error saving product:', error);
      toast.error(error?.message || 'Error al guardar el producto.');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!token) {
        throw new Error('Sesión expirada. Vuelve a iniciar sesión para continuar.');
      }
      await ProductService.deleteProduct(productId, token);
    },
    onSuccess: (_, productId) => {
      toast.success('Producto eliminado correctamente.');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (viewingProduct?.id === productId) {
        setViewingProduct(null);
      }
    },
    onError: (error: any) => {
      console.error('Error deleting product:', error);
      toast.error(error?.message || 'Error al eliminar el producto.');
    },
    onSettled: () => {
      setShowDeleteConfirmModal(false);
      setProductToDelete(null);
    },
  });

  const handleAddNewProduct = useCallback(() => {
    setEditingProduct(null);
    setShowProductForm(true);
  }, []);

  const handleEditProduct = useCallback((product: InventoryProduct) => {
    setEditingProduct(product);
    setShowProductForm(true);
  }, []);

  const handleDeleteProductRequest = useCallback((product: InventoryProduct) => {
    setProductToDelete(product);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDeleteProduct = useCallback(() => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id);
    }
  }, [productToDelete, deleteProductMutation]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setProductToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);

  const handleViewProduct = useCallback((product: InventoryProduct) => {
    setViewingProduct(product);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setViewingProduct(null);
  }, []);

  const handleSaveProduct = useCallback(
    async (productData: Product, technicalSheetFile: File | null) => {
      await saveProductMutation.mutateAsync({
        payload: productData as CreateProductDto & Partial<UpdateProductDto>,
        technicalSheetFile,
      });
    },
    [saveProductMutation]
  );

  const handleCloseForm = useCallback(() => {
    setShowProductForm(false);
    setEditingProduct(null);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const columns = useMemo<ColumnDef<InventoryProduct>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => {
          const product = row.original;
          const image = product.images?.[0];
          return (
            <div className='flex items-center'>
              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  className='w-10 h-10 rounded-md object-cover mr-3 hidden sm:block'
                />
              ) : (
                <div className='w-10 h-10 rounded-md bg-muted flex items-center justify-center mr-3 hidden sm:block'>
                  <CubeIcon className='w-5 h-5 text-muted-foreground' />
                </div>
              )}
              <div>
                <div className='text-sm font-medium text-foreground'>{product.name}</div>
                <div className='text-xs text-muted-foreground sm:hidden'>
                  {product.sku || '-'}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
        cell: ({ row }) => row.original.sku || '-',
        enableSorting: false,
      },
      {
        accessorKey: 'productType',
        header: 'Tipo',
        cell: ({ row }) =>
          row.original.productType === 'PRODUCT' ? 'Producto' : 'Servicio',
      },
      {
        accessorKey: 'price',
        header: 'Precio Venta',
        cell: ({ row }) => formatCurrencyChilean(Number(row.original.price)),
      },
      {
        accessorKey: 'totalStock',
        header: 'Stock',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.productType === 'PRODUCT'
            ? row.original.totalStock ?? '—'
            : 'N/A',
      },
      {
        accessorKey: 'isPublished',
        header: 'Estado',
        cell: ({ row }) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.original.isPublished
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-muted text-muted-foreground'
              }`}
          >
            {row.original.isPublished ? 'Publicado' : 'Oculto'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className='flex items-center justify-center space-x-1 sm:space-x-2'>
              <button
                onClick={() => handleViewProduct(product)}
                title='Ver Detalles'
                className='text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10'
                aria-label={`Ver detalles de ${product.name}`}
              >
                <EyeIcon className='w-5 h-5' />
              </button>
              <button
                onClick={() => handleEditProduct(product)}
                title='Editar Producto'
                className='text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10'
                aria-label={`Editar producto ${product.name}`}
              >
                <PencilIcon className='w-5 h-5' />
              </button>
              <button
                onClick={() => handleDeleteProductRequest(product)}
                title='Eliminar Producto'
                className='text-destructive hover:text-destructive/80 dark:hover:text-destructive/70 transition-colors p-1 rounded-md hover:bg-destructive/10'
                aria-label={`Eliminar producto ${product.name}`}
              >
                <TrashIcon className='w-5 h-5' />
              </button>
            </div>
          );
        },
      },
    ],
    [handleDeleteProductRequest, handleEditProduct, handleViewProduct]
  );

  if (!isAdmin) {
    return (
      <div className='text-center py-8 text-destructive'>
        Acceso denegado. No tienes permisos de administrador.
      </div>
    );
  }

  if (productsQuery.isLoading) {
    return <div className='text-center py-8'>Cargando productos...</div>;
  }

  if (productsQuery.isError) {
    const message =
      productsQuery.error instanceof Error
        ? productsQuery.error.message
        : 'Error al cargar los productos.';
    return <div className='text-center py-8 text-destructive'>{message}</div>;
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
      <div className='space-y-6 lg:space-y-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Inventario</h1>
          <button
            className='w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2'
            onClick={handleAddNewProduct}
            aria-label='Añadir Nuevo Producto o Servicio'
          >
            <PlusIcon className='w-5 h-5' />
            <span>Nuevo Producto/Servicio</span>
          </button>
        </div>

        <Card className='overflow-hidden border'>
          <CardContent className='p-0'>
            <DataTable<InventoryProduct>
              columns={columns}
              data={products}
              filterColumn='name'
              filterPlaceholder='Buscar por nombre...'
              hidePagination
              emptyState={
                <div className='text-center py-12 px-4'>
                  <ArchiveBoxIcon className='mx-auto h-16 w-16 text-muted-foreground opacity-40' />
                  <h3 className='mt-3 text-xl font-semibold text-foreground'>
                    No hay productos o servicios registrados
                  </h3>
                  <p className='mt-1.5 text-sm text-muted-foreground'>
                    Empieza añadiendo tu primer producto o servicio para gestionar tu
                    inventario y catálogo.
                  </p>
                  <div className='mt-6'>
                    <button
                      type='button'
                      onClick={handleAddNewProduct}
                      className='w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2 mx-auto'
                    >
                      <PlusIcon className='w-5 h-5' />
                      <span>Añadir Primer Producto/Servicio</span>
                    </button>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>

        {products.length > 0 && totalPages > 1 && (
          <div className='flex justify-between items-center mt-4'>
            <div>
              <p className='text-sm text-muted-foreground'>
                Página {currentPage} de {totalPages} (Total: {totalProducts} productos)
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <button
                className='px-4 py-2 border rounded-md text-sm font-medium bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Anterior
              </button>
              <button
                className='px-4 py-2 border rounded-md text-sm font-medium bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed'
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
        <ProductDetailModal product={viewingProduct} onClose={handleCloseDetailModal} />
      )}
      {showDeleteConfirmModal && productToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteProduct}
          title='Confirmar Eliminación'
          message={
            <>
              ¿Estás seguro de que quieres eliminar el producto{' '}
              <strong>{productToDelete.name}</strong>? Esta acción no se puede deshacer.
            </>
          }
          confirmText='Eliminar'
        />
      )}
    </>
  );
};

export default InventoryView;
