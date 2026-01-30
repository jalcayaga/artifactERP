'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useCompany,
  PurchaseService,
  Purchase,
  formatCurrencyChilean,
} from '@artifact/core';
import {
  Card,
  CardContent,
  Button,
  DataTable,
  PlusIcon,
  ShoppingCartIcon,
} from '@artifact/ui';
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
          <span className='text-muted-foreground'>
            {new Date(row.original.purchaseDate).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessorKey: 'grandTotal',
        header: 'Total',
        cell: ({ row }) => (
          <span className='font-semibold text-primary'>
            {formatCurrencyChilean(row.original.grandTotal)}
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

  if (isCompanyLoading) {
    return <div className='text-center py-8'>Cargando datos de la empresa...</div>;
  }

  if (companyError) {
    return <div className='text-center py-8 text-destructive'>{companyError}</div>;
  }

  if (!activeCompany) {
    return (
      <div className='text-center py-8'>
        Por favor, selecciona una empresa para ver sus compras.
      </div>
    );
  }

  if (purchasesQuery.isLoading) {
    return <div className='text-center py-8'>Cargando compras...</div>;
  }

  if (showPurchaseForm) {
    return <PurchaseForm onSave={handleSavePurchase} onCancel={handleCancelPurchaseForm} />;
  }

  return (
    <>
      <div className='space-y-6 lg:space-y-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Gestión de Compras</h1>
          <Button className='w-full sm:w-auto' onClick={handleCreateNewPurchase}>
            <PlusIcon className='w-5 h-5 mr-2' />
            <span>Registrar Nueva Compra</span>
          </Button>
        </div>

        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            <DataTable<Purchase>
              columns={columns}
              data={purchases}
              filterColumn='company'
              filterPlaceholder='Buscar por empresa...'
              hidePagination
              emptyState={
                <div className='text-center py-12 px-4'>
                  <ShoppingCartIcon className='mx-auto h-16 w-16 text-muted-foreground opacity-40' />
                  <h3 className='mt-3 text-xl font-semibold text-foreground'>
                    No hay compras registradas
                  </h3>
                  <p className='mt-1.5 text-sm text-muted-foreground'>
                    Comienza registrando una nueva compra para verla listada aquí.
                  </p>
                  <div className='mt-6'>
                    <Button type='button' onClick={handleCreateNewPurchase}>
                      <PlusIcon className='w-5 h-5 mr-2' />
                      <span>Registrar Primera Compra</span>
                    </Button>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>

        {purchases.length > 0 && totalPages > 1 && (
          <div className='flex justify-between items-center mt-4'>
            <div>
              <p className='text-sm text-muted-foreground'>
                Página {currentPage} de {totalPages} (Total: {totalPurchases} compras)
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || purchasesQuery.isFetching}
              >
                Anterior
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || purchasesQuery.isFetching}
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
