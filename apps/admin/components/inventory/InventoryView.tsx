'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Product, CreateProductDto, UpdateProductDto, UserRole, formatCurrencyChilean, cn } from '@artifact/core';
import { ProductService, useAuth } from '@artifact/core/client';
import {
  Card,
  CardContent,
  DataTable,
} from '@artifact/ui';
import { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Package,
  Eye,
  Pencil,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Layers,
  Archive,
  Zap,
  ShieldCheck
} from 'lucide-react';
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

  const [statusFilter, setStatusFilter] = useState<'all' | 'product' | 'service' | 'low-stock'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<InventoryProduct | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<InventoryProduct | null>(null);

  const isAdmin =
    currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPERADMIN;

  const productsQuery = useQuery({
    queryKey: ['products', token, currentPage, PAGE_SIZE, statusFilter],
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

      // Note: Backend might not support statusFilter directly yet, we'll fetch and filter if needed, 
      // but optimally backend should handle it. For now, we'll use base fetch.
      const response = await ProductService.getAllProducts(token, currentPage, PAGE_SIZE);

      let data = response.data;

      const productsWithStock: InventoryProduct[] = await Promise.all(
        data.map(async (product: Product) => {
          if (product.productType === 'PRODUCT') {
            try {
              const lots = await ProductService.getProductLots(product.id, token);
              const totalStock = lots.reduce((sum, lot) => sum + lot.currentQuantity, 0);
              return { ...product, totalStock };
            } catch (error) {
              return { ...product, totalStock: 0 };
            }
          }
          return { ...product, totalStock: undefined };
        })
      );

      // Client-side mapping for specialized filters if backend doesn't support them
      let filteredData = productsWithStock;
      if (statusFilter === 'product') filteredData = filteredData.filter(p => p.productType === 'PRODUCT');
      if (statusFilter === 'service') filteredData = filteredData.filter(p => p.productType === 'SERVICE');
      if (statusFilter === 'low-stock') filteredData = filteredData.filter(p => p.productType === 'PRODUCT' && (p.totalStock ?? 0) <= (p.reorderLevel || 0));

      return {
        data: filteredData,
        total: response.total,
        pages: response.pages,
        currentPage: response.currentPage,
      };
    },
  });

  const products = productsQuery.data?.data ?? [];
  const totalPages = productsQuery.data?.pages ?? 1;
  const totalProducts = productsQuery.data?.total ?? 0;

  // Inventory stats
  const stats = useMemo(() => {
    const totalItems = totalProducts;
    const lowStockItems = products.filter(p => p.productType === 'PRODUCT' && (p.totalStock ?? 0) <= (p.reorderLevel || 0)).length;
    const inventoryValue = products.reduce((acc, p) => acc + (p.productType === 'PRODUCT' ? (p.totalStock ?? 0) * Number(p.unitPrice || 0) : 0), 0);
    const publishedItems = products.filter(p => p.isPublished).length;

    return [
      { label: 'Ítems Totales', value: totalItems.toString(), icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { label: 'Crítico / Bajo Stock', value: lowStockItems.toString(), icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
      { label: 'Valor del Inventario', value: formatCurrencyChilean(inventoryValue), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { label: 'Publicados Tienda', value: publishedItems.toString(), icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];
  }, [products, totalProducts]);

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
      toast.success(`Ítem ${product.name} actualizado exitosamente.`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowProductForm(false);
      setEditingProduct(null);
    },
    onError: (error: any) => {
      console.error('Error saving product:', error);
      toast.error(error?.message || 'Hubo un problema al guardar el registro.');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!token) {
        throw new Error('Sesión expirada.');
      }
      await ProductService.deleteProduct(productId, token);
    },
    onSuccess: () => {
      toast.success('El ítem ha sido eliminado del catálogo.');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al eliminar el ítem.');
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
        header: 'Producto / SKU',
        cell: ({ row }) => {
          const product = row.original;
          const image = product.images?.[0];
          return (
            <div className='flex items-center gap-4'>
              <div className="relative h-12 w-12 flex-shrink-0 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                {image ? (
                  <img
                    src={image}
                    alt={product.name}
                    className='relative h-full w-full rounded-xl object-cover border border-white/10'
                  />
                ) : (
                  <div className='relative h-full w-full rounded-xl bg-slate-800/50 flex items-center justify-center border border-dashed border-slate-700/50'>
                    <Package className='w-6 h-6 text-slate-600' />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className='text-sm font-black text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight'>{product.name}</div>
                <div className='flex items-center gap-2'>
                  <span className='px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-400 border border-white/5 uppercase tracking-wider'>
                    {product.sku || 'SIN SKU'}
                  </span>
                  {product.category && (
                    <span className="text-[9px] text-blue-500/70 font-bold uppercase tracking-widest">{product.category}</span>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'productType',
        header: 'Naturaleza',
        cell: ({ row }) => {
          const type = row.original.productType;
          return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${type === 'PRODUCT'
              ? 'bg-blue-500/5 border-blue-500/10 text-blue-400'
              : 'bg-purple-500/5 border-purple-500/10 text-purple-400'
              }`}>
              <div className={cn(
                "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                type === 'PRODUCT' ? "bg-blue-500" : "bg-purple-500"
              )} />
              <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                {type === 'PRODUCT' ? 'Producto' : 'Servicio'}
              </span>
            </div>
          );
        }
      },
      {
        accessorKey: 'price',
        header: 'P. Venta Neto',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-white font-black tracking-tight text-sm">
              {formatCurrencyChilean(Number(row.original.price))}
            </span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Bruto: {formatCurrencyChilean(Number(row.original.price) * 1.19)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'totalStock',
        header: 'Disponibilidad',
        enableSorting: false,
        cell: ({ row }) => {
          if (row.original.productType !== 'PRODUCT') return (
            <div className="flex items-center gap-1.5 text-slate-600 opacity-40">
              <Zap className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Servicio</span>
            </div>
          );

          const stock = row.original.totalStock ?? 0;
          const reorder = row.original.reorderLevel ?? 0;
          const isLow = stock <= reorder;

          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "px-2 py-0.5 rounded text-[11px] font-black",
                  isLow ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                )}>
                  {stock} <span className="text-[9px] opacity-70">UNIDS</span>
                </div>
              </div>
              {reorder > 0 && (
                <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest ml-1">
                  Mín: {reorder}
                </div>
              )}
            </div>
          );
        }
      },
      {
        accessorKey: 'isPublished',
        header: 'Canales',
        cell: ({ row }) => (
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] border inline-flex items-center gap-2 transition-all ${row.original.isPublished
            ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.05)]'
            : 'text-slate-500 bg-slate-500/5 border-slate-500/10'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${row.original.isPublished ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            {row.original.isPublished ? "Público" : "Borrador"}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className='flex items-center justify-end gap-1.5'>
              <IconButton
                variant="text"
                className="text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                size="sm"
                onClick={() => handleViewProduct(product)}
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Eye className='w-4 h-4' />
              </IconButton>
              <IconButton
                variant="text"
                className="text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                size="sm"
                onClick={() => handleEditProduct(product)}
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Pencil className='w-4 h-4' />
              </IconButton>
              <IconButton
                variant="text"
                className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                size="sm"
                onClick={() => handleDeleteProductRequest(product)}
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Trash2 className='w-4 h-4' />
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12 bg-black/20 rounded-[2rem] border border-white/5 backdrop-blur-sm">
        <div className="p-6 bg-red-500/10 rounded-3xl mb-6">
          <ShieldCheck className="h-12 w-12 text-red-500 opacity-50" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Acceso Restringido</h3>
        <p className="text-slate-400 max-w-sm text-sm font-medium">No posees credenciales de administrador para gestionar el catálogo maestro.</p>
      </div>
    );
  }

  if (productsQuery.isError) {
    const message = productsQuery.error instanceof Error ? productsQuery.error.message : 'Error al cargar el catálogo.';
    return (
      <div className='p-16 text-center bg-red-500/5 border border-red-500/10 rounded-[2rem] backdrop-blur-xl'>
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <Typography color="red" className="text-xl font-black uppercase italic tracking-tight" placeholder="" >
          Señal Interrumpida
        </Typography>
        <p className="text-slate-400 mt-2 font-medium">{message}</p>
        <Button
          className="mt-8 bg-red-600/20 text-red-400 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all rounded-xl px-10"
          onClick={() => productsQuery.refetch()}
          placeholder=""
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Reintentar Sincronización
        </Button>
      </div>
    );
  }

  if (showProductForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProductForm
          productData={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCloseForm}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header section with glassmorphism */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Archive className="h-6 w-6 text-white italic" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Inventario <span className="text-blue-500">Maestro</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] ml-1">Control de Catálogo y Valorización de Stock</p>
        </div>

        <Button
          className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-3 px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/30 active:scale-95 group overflow-hidden relative"
          onClick={handleAddNewProduct}
          placeholder=""
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <Plus className="h-5 w-5 font-black" strokeWidth={3} />
          <span className="font-black uppercase tracking-[0.15em] text-xs">Registrar Ítem</span>
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
            <Card className="relative border-white/[0.05] bg-[#1a2537]/40 backdrop-blur-2xl hover:bg-[#1a2537]/60 transition-all duration-300 rounded-3xl overflow-hidden active:scale-98 shadow-2xl border">
              <CardContent className="p-6 flex items-center justify-between border-none shadow-none">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">{stat.label}</p>
                  <h3 className="text-2xl font-black text-white tracking-tighter italic">{stat.value}</h3>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg} border border-white/5 shadow-inner`}>
                  <stat.icon className={`h-7 w-7 ${stat.color} stroke-[2.5px]`} />
                </div>
              </CardContent>
              <div className="h-1 w-full bg-slate-800/50 relative">
                <div className={`absolute left-0 top-0 h-full w-1/3 ${stat.color.replace('text-', 'bg-')} opacity-30 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <Card className="border-white/[0.05] bg-[#1a2537]/40 backdrop-blur-3xl overflow-hidden rounded-[2rem] shadow-2xl border">
        {/* Table Filters & Search */}
        <div className="p-6 border-b border-white/[0.05] flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white/[0.01]">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative group w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Search className="h-4 w-4" strokeWidth={3} />
              </div>
              <input
                type="text"
                placeholder="BUSCAR EN CATÁLOGO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/40 border border-white/[0.08] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all shadow-inner"
              />
            </div>

            <div className="flex bg-slate-950/40 p-1 rounded-2xl border border-white/[0.05] shadow-inner w-full sm:w-auto">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'product', label: 'Productos' },
                { id: 'service', label: 'Servicios' },
                { id: 'low-stock', label: 'Críticos' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`flex-1 sm:flex-none px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 ${statusFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105 z-10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="text"
              className="px-6 py-3 rounded-2xl border border-white/[0.05] bg-white/[0.01] text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
              placeholder=""
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Filter className="h-4 w-4" strokeWidth={2} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Más Filtros</span>
            </Button>

            <div className="h-10 w-px bg-white/[0.05] mx-1 hidden sm:block" />

            <Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2" placeholder="" >
              Mostrando <span className="text-white">{products.length}</span> ítems
            </Typography>
          </div>
        </div>

        {/* Data Table with refined styling */}
        <CardContent className="p-0 shadow-none border-none">
          <DataTable<InventoryProduct>
            columns={columns}
            data={products.filter(p =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            isLoading={productsQuery.isLoading}
            className="border-none"
            emptyState={
              <div className='text-center py-28 px-4'>
                <div className="relative inline-block mb-8">
                  <div className="absolute -inset-4 bg-blue-600/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-[#1a2537] rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl">
                    <Archive className='h-12 w-12 text-slate-700 opacity-40 italic' />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sin Resultados Coincidentes</h3>
                <p className="text-slate-500 mt-3 max-w-xs mx-auto text-sm font-bold uppercase tracking-wider opacity-60">
                  No hemos encontrado registros que coincidan con los criterios de búsqueda actuales.
                </p>
                <div className="flex gap-4 justify-center mt-10">
                  <Button
                    variant="outlined"
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                    className="border-white/10 text-slate-400 hover:text-white rounded-xl px-8"
                    placeholder=""
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <span className="font-bold uppercase tracking-widest text-[10px]">Limpiar Filtros</span>
                  </Button>
                  <Button
                    color="blue"
                    onClick={handleAddNewProduct}
                    className="flex items-center gap-3 px-10 rounded-xl bg-blue-600 shadow-xl shadow-blue-600/20"
                    placeholder=""
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <Plus className="h-4 w-4 font-black" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Registrar Nuevo</span>
                  </Button>
                </div>
              </div>
            }
          />
        </CardContent>

        {/* Pagination Console */}
        {products.length > 0 && totalPages > 1 && (
          <div className='p-6 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-950/20'>
            <div>
              <p className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]'>
                Consola de Navegación <span className="mx-3 opacity-20">|</span> Página <span className="text-blue-500">{currentPage}</span> de <span className="text-white">{totalPages}</span>
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <Button
                variant="text"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-10 rounded-xl px-6 py-2.5 transition-all text-[10px] font-black uppercase tracking-widest"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Anterior
              </Button>
              <div className="flex gap-1.5 h-1.5">
                {[...Array(totalPages)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-full rounded-full transition-all duration-500 ${currentPage === i + 1 ? 'bg-blue-500 w-6' : 'bg-slate-800'}`} />
                ))}
              </div>
              <Button
                variant="text"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-10 rounded-xl px-6 py-2.5 transition-all text-[10px] font-black uppercase tracking-widest"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals & Dialogs */}
      {viewingProduct && (
        <ProductDetailModal product={viewingProduct} onClose={handleCloseDetailModal} />
      )}

      {showDeleteConfirmModal && productToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteProduct}
          title='Autorizar Eliminación'
          confirmText='Eliminar Definitivamente'
          message={
            <div className="space-y-4">
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Estás a punto de eliminar el ítem <strong className="text-white">&quot;{productToDelete.name}&quot;</strong> del catálogo maestro. Esta operación es irreversible y afectará reportes históricos.
              </p>
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                  Requiere confirmación administrativa de alto nivel
                </p>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default InventoryView;
