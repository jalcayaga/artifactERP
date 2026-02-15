'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Purchase, formatCurrencyChilean, } from '@artifact/core';
import { useCompany, PurchaseService } from '@artifact/core/client';;
import {
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { DataTable } from '@artifact/ui';
import {
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import PurchaseForm from './PurchaseForm';

const PAGE_SIZE = 10;

const PurchasesView: React.FC = () => {
  const { activeCompany, isLoading: isCompanyLoading, error: companyError } = useCompany();
  const queryClient = useQueryClient();

  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCompany?.id]);

  const purchasesQuery = useQuery({
    queryKey: ['purchases', activeCompany?.id, currentPage],
    enabled: Boolean(activeCompany),
    placeholderData: (prev: any) => prev,
    queryFn: async ({ queryKey }) => {
      const [, , page] = queryKey;
      const response = await PurchaseService.getAllPurchases(page as number, PAGE_SIZE);
      return response;
    },
  });

  const purchases = purchasesQuery.data?.data ?? [];
  const totalPages = purchasesQuery.data?.pages ?? 1;
  const totalPurchases = purchasesQuery.data?.total ?? 0;

  const handleCreateNewPurchase = useCallback(() => {
    setShowPurchaseForm(true);
  }, []);

  const handleSavePurchase = useCallback(async () => {
    setShowPurchaseForm(false);
    await queryClient.invalidateQueries({ queryKey: ['purchases'] });
  }, [queryClient]);

  const handleCancelPurchaseForm = useCallback(() => {
    setShowPurchaseForm(false);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const columns = useMemo<ColumnDef<Purchase>[]>(() => {
    return [
      {
        id: 'purchaseId',
        header: 'ID Compra',
        accessorFn: (purchase) => purchase.id,
        cell: ({ row }) => (
          <span className='font-mono text-muted-foreground'>
            {row.original.id.substring(0, 8)}...
          </span>
        ),
      },
      {
        accessorKey: 'company',
        header: 'Empresa',
        cell: ({ row }) => (
          <div className='font-medium text-foreground'>
            {row.original.company?.name ?? 'Sin empresa'}
          </div>
        ),
      },
      {
        accessorKey: 'purchaseDate',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-blue-gray-200 opacity-80">
            {new Date(row.original.purchaseDate).toLocaleDateString('es-CL', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        ),
      },
      {
        accessorKey: 'grandTotal',
        header: 'Total',
        cell: ({ row }) => (
          <span className="text-white font-bold tracking-tight">
            {formatCurrencyChilean(Number(row.original.grandTotal))}
          </span>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    if (purchasesQuery.isError) {
      const error = purchasesQuery.error;
      const message =
        error instanceof Error ? error.message : 'Error al cargar las compras.';
      toast.error(message);
    }
  }, [purchasesQuery.isError, purchasesQuery.error]);

  if (purchasesQuery.isError) {
    const error = purchasesQuery.error;
    const message =
      error instanceof Error ? error.message : 'Error al cargar las compras.';
    return (
      <div className='p-8 text-center'>
        <Typography color="red" className="font-bold" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
          {message}
        </Typography>
      </div>
    );
  }

  if (showPurchaseForm) {
    return <PurchaseForm onSave={handleSavePurchase} onCancel={handleCancelPurchaseForm} />;
  }

  return (
    <>
      <div className='mt-4 mb-8 flex flex-col gap-6'>
        <DataTable<Purchase>
          title="Gestión de Compras"
          description="Monitorea y registra las adquisiciones de productos y servicios."
          columns={columns}
          data={purchases}
          isLoading={purchasesQuery.isLoading}
          filterColumn='company'
          filterPlaceholder='Buscar por proveedor...'
          hidePagination
          renderActions={
            <Button
              className="flex items-center gap-3 bg-blue-500"
              size="sm"
              onClick={handleCreateNewPurchase}
              placeholder=""
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              <PlusIcon className="h-4 w-4 text-white font-bold" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Nueva Compra</span>
            </Button>
          }
          emptyState={
            <div className='text-center py-12 px-4'>
              <ShoppingCartIcon className='mx-auto h-16 w-16 text-blue-gray-400 opacity-40' />
              <Typography variant="h5" color="white" className="mt-4 font-bold" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                No hay compras registradas
              </Typography>
              <Typography className="text-blue-gray-200 mt-2 opacity-70" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                Comienza registrando una nueva compra para alimentar tu inventario.
              </Typography>
              <Button
                variant="gradient"
                color="blue"
                onClick={handleCreateNewPurchase}
                className="mt-6 flex items-center gap-2 mx-auto"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Registrar Primera Compra</span>
              </Button>
            </div>
          }
        />

        {purchases.length > 0 && totalPages > 1 && (
          <div className='flex justify-between items-center px-4'>
            <div>
              <p className='text-sm text-blue-gray-200 opacity-60'>
                Página <span className="text-white font-bold">{currentPage}</span> de <span className="text-white font-bold">{totalPages}</span> (Total: {totalPurchases} compras)
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || purchasesQuery.isFetching}
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
                disabled={currentPage >= totalPages || purchasesQuery.isFetching}
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
    </>
  );
};

export default PurchasesView;
