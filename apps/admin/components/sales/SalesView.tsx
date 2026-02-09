'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Sale, OrderStatus, formatCurrencyChilean,  } from '@artifact/core';;
import {  } from '@artifact/core';
import { useCompany, SaleService, InvoiceService } from '@artifact/core/client';;
import {
  Card,
  CardContent,
  Button,
  DataTable,
  PlusIcon,
  ShoppingCartIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
} from '@artifact/ui';
import { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import SaleForm from './SaleForm';
import SaleDetailModal from './SaleDetailModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const PAGE_SIZE = 10;

const SalesView: React.FC = () => {
  const { activeCompany, isLoading: isCompanyLoading, error: companyError } = useCompany();
  const queryClient = useQueryClient();

  const [showSaleForm, setShowSaleForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCompany?.id]);

  const salesQuery = useQuery({
    queryKey: ['sales', activeCompany?.id, currentPage],
    enabled: Boolean(activeCompany),
    placeholderData: (prev: any) => prev,
    queryFn: async ({ queryKey }) => {
      const [, , page] = queryKey;
      const response = await SaleService.getAllSales(page as number, PAGE_SIZE);
      return response;
    },
  });

  const sales = salesQuery.data?.data ?? [];
  const totalPages = salesQuery.data?.pages ?? 1;
  const totalSales = salesQuery.data?.total ?? 0;

  const deleteSaleMutation = useMutation({
    mutationFn: async (saleId: string) => {
      await SaleService.deleteSale(saleId);
    },
    onSuccess: () => {
      toast.success('Venta eliminada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
    onError: (error: any) => {
      console.error('Error deleting sale:', error);
      toast.error(error?.message || 'Error al eliminar la venta.');
    },
    onSettled: () => {
      setSaleToDelete(null);
      setShowDeleteConfirmModal(false);
      setViewingSale((prev) => {
        if (prev && prev.id === saleToDelete?.id) {
          return null;
        }
        return prev;
      });
    },
  });

  const handleCreateNewSale = useCallback(() => {
    setEditingSale(null);
    setShowSaleForm(true);
  }, []);

  const handleEditSale = useCallback(async (sale: Sale) => {
    try {
      const detailedSale = await SaleService.getSaleById(sale.id);
      setEditingSale(detailedSale);
    } catch (err) {
      console.error('Error fetching sale details:', err);
      toast.error(
        err instanceof Error ? err.message : 'Error al cargar los detalles de la venta.'
      );
      setEditingSale(sale);
    }
    setShowSaleForm(true);
  }, []);

  const handleDeleteSaleRequest = useCallback((sale: Sale) => {
    setSaleToDelete(sale);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDeleteSale = useCallback(() => {
    if (saleToDelete) {
      deleteSaleMutation.mutate(saleToDelete.id);
    }
  }, [saleToDelete, deleteSaleMutation]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setSaleToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);

  const handleSaveSale = useCallback(() => {
    setShowSaleForm(false);
    setEditingSale(null);
    queryClient.invalidateQueries({ queryKey: ['sales'] });
  }, [queryClient]);

  const handleCancelSaleForm = useCallback(() => {
    setShowSaleForm(false);
    setEditingSale(null);
  }, []);

  const handleViewSale = useCallback((sale: Sale) => {
    setViewingSale(sale);
  }, []);

  const handleCloseSaleDetailModal = useCallback(() => {
    setViewingSale(null);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      const invoice = await InvoiceService.createInvoiceFromOrder(orderId);
      toast.success(`Factura ${invoice.invoiceNumber} creada exitosamente.`);
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Error al crear la factura.';
      toast.error(message);
    }
  };

  const columns = useMemo<ColumnDef<Sale>[]>(() => {
    return [
      {
        id: 'saleId',
        header: 'ID Venta',
        accessorFn: (sale) => sale.id,
        cell: ({ row }) => (
          <span className='font-mono text-muted-foreground'>
            {row.original.id.substring(0, 8)}...
          </span>
        ),
      },
      {
        id: 'company',
        header: 'Empresa',
        accessorFn: (sale) => sale.company?.name ?? 'Sin empresa',
        cell: ({ row }) => {
          const sale = row.original;
          return (
            <div>
              <div className='font-medium text-foreground'>{sale.company?.name ?? 'Sin empresa'}</div>
              <div className='text-xs text-muted-foreground sm:hidden'>
                {new Date(sale.createdAt).toLocaleDateString()} · Total:{' '}
                {formatCurrencyChilean(sale.grandTotalAmount)}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className='text-muted-foreground'>
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'subTotal',
        header: 'Subtotal',
        cell: ({ row }) => (
          <span className='text-muted-foreground'>
            {formatCurrencyChilean(row.original.subTotalAmount)}
          </span>
        ),
      },
      {
        id: 'vat',
        header: 'IVA',
        cell: ({ row }) => (
          <span className='text-muted-foreground'>
            {formatCurrencyChilean(row.original.vatAmount)}
          </span>
        ),
      },
      {
        id: 'total',
        header: 'Total',
        cell: ({ row }) => (
          <span className='font-semibold text-primary'>
            {formatCurrencyChilean(row.original.grandTotalAmount)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const sale = row.original;
          return (
            <div className='flex items-center justify-center space-x-1 sm:space-x-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleViewSale(sale)}
                title='Ver Detalles de Venta'
                aria-label={`Ver detalles de venta ${sale.id.substring(0, 8)}`}
              >
                <EyeIcon className='w-5 h-5' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleEditSale(sale)}
                title='Editar Venta'
                aria-label={`Editar venta ${sale.id.substring(0, 8)}`}
              >
                <PencilIcon className='w-5 h-5' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleDeleteSaleRequest(sale)}
                title='Eliminar Venta'
                aria-label={`Eliminar venta ${sale.id.substring(0, 8)}`}
              >
                <TrashIcon className='w-5 h-5' />
              </Button>
              {(sale.status === OrderStatus.DELIVERED ||
                sale.status === OrderStatus.SHIPPED) &&
                !sale.invoice && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleGenerateInvoice(sale.id)}
                    title='Generar Factura'
                    aria-label={`Generar factura para la venta ${sale.id.substring(0, 8)}`}
                  >
                    <DocumentTextIcon className='w-5 h-5' />
                  </Button>
                )}
            </div>
          );
        },
      },
    ];
  }, [handleDeleteSaleRequest, handleEditSale, handleViewSale, handleGenerateInvoice]);

  if (isCompanyLoading) {
    return <div className='text-center py-8'>Cargando datos de la empresa...</div>;
  }

  if (companyError) {
    return <div className='text-center py-8 text-destructive'>{companyError}</div>;
  }

  if (!activeCompany) {
    return (
      <div className='text-center py-8'>
        Por favor, selecciona una empresa para ver sus ventas.
      </div>
    );
  }

  if (salesQuery.isLoading) {
    return <div className='text-center py-8'>Cargando ventas...</div>;
  }

  if (salesQuery.isError) {
    const message =
      salesQuery.error instanceof Error
        ? salesQuery.error.message
        : 'Error al cargar las ventas.';
    return <div className='text-center py-8 text-destructive'>{message}</div>;
  }

  if (showSaleForm) {
    return (
      <SaleForm
        saleData={editingSale}
        onSave={handleSaveSale}
        onCancel={handleCancelSaleForm}
      />
    );
  }

  return (
    <>
      <div className='space-y-6 lg:space-y-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Gestión de Ventas</h1>
          <Button className='w-full sm:w-auto' onClick={handleCreateNewSale}>
            <PlusIcon className='w-5 h-5 mr-2' />
            <span>Crear Nueva Venta</span>
          </Button>
        </div>

        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            <DataTable<Sale>
              columns={columns}
              data={sales}
              filterColumn='company'
              filterPlaceholder='Buscar por empresa...'
              hidePagination
              emptyState={
                <div className='text-center py-12 px-4'>
                  <ShoppingCartIcon className='mx-auto h-16 w-16 text-muted-foreground opacity-40' />
                  <h3 className='mt-3 text-xl font-semibold text-foreground'>
                    No hay ventas registradas
                  </h3>
                  <p className='mt-1.5 text-sm text-muted-foreground'>
                    Comienza creando una nueva venta para verla listada aquí.
                  </p>
                  <div className='mt-6'>
                    <Button type='button' onClick={handleCreateNewSale}>
                      <PlusIcon className='w-5 h-5 mr-2' />
                      <span>Crear Primera Venta</span>
                    </Button>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>

        {sales.length > 0 && totalPages > 1 && (
          <div className='flex justify-between items-center mt-4'>
            <div>
              <p className='text-sm text-muted-foreground'>
                Página {currentPage} de {totalPages} (Total: {totalSales} ventas)
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || salesQuery.isFetching}
              >
                Anterior
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || salesQuery.isFetching}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
      {viewingSale && (
        <SaleDetailModal
          sale={viewingSale}
          onClose={handleCloseSaleDetailModal}
          onInvoiceCreated={() => queryClient.invalidateQueries({ queryKey: ['sales'] })}
        />
      )}
      {showDeleteConfirmModal && saleToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteSale}
          title='Confirmar Eliminación de Venta'
          message={
            <>
              ¿Estás seguro de que quieres eliminar la venta{' '}
              <strong>ID: {saleToDelete.id.substring(0, 8)}...</strong> para la empresa{' '}
              <strong>{saleToDelete.company?.name ?? 'Sin empresa'}</strong>? Esta acción
              no se puede deshacer.
            </>
          }
          confirmText='Eliminar Venta'
          confirmButtonClass='bg-destructive hover:bg-destructive/90 text-destructive-foreground'
          icon={<TrashIcon className='w-5 h-5 mr-2' />}
        />
      )}
    </>
  );
};

export default SalesView;
