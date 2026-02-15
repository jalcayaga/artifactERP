'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Product, CreateProductDto, UpdateProductDto, UserRole, formatCurrencyChilean, cn } from '@artifact/core';;
import { } from '@artifact/core';
import { ProductService, useAuth } from '@artifact/core/client';;
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
} from '@artifact/ui';
import { ColumnDef } from '@tanstack/react-table';
import {
  PlusIcon,
  ArchiveBoxIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { CubeIcon } from '@heroicons/react/24/solid';
import {
  Typography,
  Button,
  Chip,
  IconButton,
} from "@material-tailwind/react";
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
        cell: ({ row }) => {
          const type = row.original.productType;
          return (
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                type === 'PRODUCT' ? "bg-blue-500" : "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              )} />
              <span className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                type === 'PRODUCT' ? "text-blue-400" : "text-purple-400"
              )}>
                {type === 'PRODUCT' ? 'Producto' : 'Servicio'}
              </span>
            </div>
          );
        }
      },
      {
        accessorKey: 'price',
        header: 'Precio Venta',
        cell: ({ row }) => (
          <span className="text-white font-bold tracking-tight">
            {formatCurrencyChilean(Number(row.original.price))}
          </span>
        ),
      },
      {
        accessorKey: 'totalStock',
        header: 'Stock',
        enableSorting: false,
        cell: ({ row }) => {
          if (row.original.productType !== 'PRODUCT') return <span className="text-blue-gray-400/50 italic opacity-50">N/A</span>;
          const stock = row.original.totalStock ?? 0;
          return (
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-bold",
                stock <= (row.original.reorderLevel || 0) ? "text-red-400" : "text-emerald-400"
              )}>
                {stock}
              </span>
              <span className="text-[10px] text-blue-gray-400 uppercase opacity-60">unids</span>
            </div>
          );
        }
      },
      {
        accessorKey: 'isPublished',
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            variant="ghost"
            color={row.original.isPublished ? "green" : "blue-gray"}
            size="sm"
            value={row.original.isPublished ? "Activo" : "Inactivo"}
            className="rounded-full capitalize font-bold"
          />
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className='flex items-center justify-end gap-1'>
              <IconButton
                variant="text"
                color="blue"
                size="sm"
                onClick={() => handleViewProduct(product)}
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                <EyeIcon className='w-5 h-5' />
              </IconButton>
              <IconButton
                variant="text"
                color="blue"
                size="sm"
                onClick={() => handleEditProduct(product)}
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                <PencilIcon className='w-5 h-5' />
              </IconButton>
              <IconButton
                variant="text"
                color="red"
                size="sm"
                onClick={() => handleDeleteProductRequest(product)}
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                <TrashIcon className='w-5 h-5' />
              </IconButton>
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

  if (productsQuery.isError) {
    const message =
      productsQuery.error instanceof Error
        ? productsQuery.error.message
        : 'Error al cargar los productos.';
    return (
      <div className='p-8 text-center'>
        <Typography color="red" className="font-bold" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
          {message}
        </Typography>
      </div>
    );
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
      <div className='mt-4 mb-8 flex flex-col gap-6'>
        <DataTable<InventoryProduct>
          title="Catálogo de Productos y Servicios"
          description="Gestiona tu inventario y servicios desde una vista única y profesional."
          columns={columns}
          data={products}
          isLoading={productsQuery.isLoading}
          filterColumn='name'
          filterPlaceholder='Buscar por nombre, SKU...'
          hidePagination
          renderActions={
            <Button
              className="flex items-center gap-3 bg-blue-500"
              size="sm"
              onClick={handleAddNewProduct}
              placeholder=""
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              <PlusIcon className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Nuevo Item</span>
            </Button>
          }
          emptyState={
            <div className='text-center py-12 px-4'>
              <ArchiveBoxIcon className='mx-auto h-16 w-16 text-blue-gray-400 opacity-40' />
              <Typography variant="h5" color="white" className="mt-4 font-bold" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                No hay productos o servicios registrados
              </Typography>
              <Typography className="text-blue-gray-200 mt-2 opacity-70" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                Empieza añadiendo tu primer producto o servicio para gestionar tu catálogo.
              </Typography>
              <Button
                variant="gradient"
                color="blue"
                onClick={handleAddNewProduct}
                className="mt-6 flex items-center gap-2 mx-auto"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Registrar Primer Item</span>
              </Button>
            </div>
          }
        />

        {products.length > 0 && totalPages > 1 && (
          <div className='flex justify-between items-center px-4'>
            <div>
              <p className='text-sm text-blue-gray-200 opacity-60'>
                Página <span className="text-white font-bold">{currentPage}</span> de <span className="text-white font-bold">{totalPages}</span> (Total: {totalProducts} productos)
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="bg-white/5 border-blue-gray-100/10 text-white disabled:opacity-30 rounded-lg"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                Anterior
              </Button>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="bg-white/5 border-blue-gray-100/10 text-white disabled:opacity-30 rounded-lg"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                Siguiente
              </Button>
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
