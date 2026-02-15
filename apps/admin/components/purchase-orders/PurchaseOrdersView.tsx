'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { PurchaseOrder, UserRole, formatCurrencyChilean } from '@artifact/core';
import { PurchaseOrderService, useAuth } from '@artifact/core/client';
import {
  DataTable,
} from '@artifact/ui';
import { ColumnDef } from '@tanstack/react-table';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import {
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 10;

const PurchaseOrdersView: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<PurchaseOrder | null>(null);

  const ordersQuery = useQuery({
    queryKey: ['purchase-orders', token, page],
    enabled: Boolean(isAuthenticated && token),
    queryFn: async () => {
      if (!token) throw new Error('Sesión expirada');
      return await PurchaseOrderService.getAllPurchaseOrders(page, PAGE_SIZE);
    },
  });

  const orders = ordersQuery.data?.data ?? [];
  const totalPages = ordersQuery.data?.pages ?? 1;

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Sesión expirada');
      await PurchaseOrderService.deletePurchaseOrder(id);
    },
    onSuccess: () => {
      toast.success('Orden de Compra eliminada.');
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
    onError: (error: any) => {
      console.error('Error deleting order:', error);
      toast.error('Error al eliminar la orden.');
    },
    onSettled: () => {
      setShowDeleteConfirmModal(false);
      setOrderToDelete(null);
    },
  });

  const handleAddNew = useCallback(() => {
    router.push('/purchase-orders/new');
  }, [router]);

  const handleEdit = useCallback((order: PurchaseOrder) => {
    router.push(`/purchase-orders/${order.id}`);
  }, [router]);

  const handleDelete = useCallback((order: PurchaseOrder) => {
    setOrderToDelete(order);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (orderToDelete) {
      deleteOrderMutation.mutate(orderToDelete.id);
    }
  }, [orderToDelete, deleteOrderMutation]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'blue-gray';
      case 'ISSUED': return 'blue';
      case 'PARTIALLY_RECEIVED': return 'orange';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  const calculateTotal = (order: PurchaseOrder) => {
    return order.grandTotal || 0;
  }

  const columns = useMemo<ColumnDef<PurchaseOrder>[]>(
    () => [
      {
        accessorKey: 'orderDate',
        header: 'Fecha',
        cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString(),
      },
      {
        accessorKey: 'company.name', // Assuming company is populated
        header: 'Proveedor',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-white">{row.original.company?.name || 'Proveedor desconocido'}</span>
            <span className="text-xs text-blue-gray-400">{row.original.company?.rut || '-'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            variant="ghost"
            color={getStatusColor(row.original.status) as any}
            size="sm"
            value={row.original.status.replace('_', ' ')}
            className="rounded-full capitalize font-bold text-xs"
          />
        ),
      },
      {
        accessorKey: 'grandTotal',
        header: 'Total',
        cell: ({ row }) => (
          <span className="font-bold text-white">
            {formatCurrencyChilean(row.original.grandTotal)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className='flex items-center justify-end gap-1'>
            <Tooltip content="Ver / Editar">
              <IconButton
                variant="text"
                color="blue"
                size="sm"
                onClick={() => handleEdit(row.original)}
              >
                <PencilIcon className='w-4 h-4' />
              </IconButton>
            </Tooltip>
            {row.original.status === 'DRAFT' && (
              <Tooltip content="Eliminar">
                <IconButton
                  variant="text"
                  color="red"
                  size="sm"
                  onClick={() => handleDelete(row.original)}
                >
                  <TrashIcon className='w-4 h-4' />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  if (ordersQuery.isError) {
    return <div className="p-8 text-center text-red-500">Error cargar órdenes de compra</div>;
  }

  return (
    <>
      <div className='mt-4 mb-8 flex flex-col gap-6'>
        <DataTable<PurchaseOrder>
          title="Órdenes de Compra"
          description="Gestiona tus adquisiciones y recepciones de inventario."
          columns={columns}
          data={orders}
          isLoading={ordersQuery.isLoading}
          filterColumn='company.name'
          filterPlaceholder='Buscar por proveedor...' // Client side filtering might not work perfectly with dot notation accessor if DataTable doesn't support it deep, but let's try.
          renderActions={
            <Button
              className="flex items-center gap-3 bg-blue-500"
              size="sm"
              onClick={handleAddNew}
            >
              <PlusIcon className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Nueva Orden</span>
            </Button>
          }
          emptyState={
            <div className='text-center py-12 px-4'>
              <ClipboardDocumentCheckIcon className='mx-auto h-16 w-16 text-blue-gray-400 opacity-40' />
              <Typography variant="h5" color="white" className="mt-4 font-bold">
                No hay órdenes de compra
              </Typography>
              <Button
                variant="gradient"
                color="blue"
                onClick={handleAddNew}
                className="mt-6 flex items-center gap-2 mx-auto"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Crear Primera Orden</span>
              </Button>
            </div>
          }
        />
        {/* Pagination controls could go here if DataTable doesn't handle remote pagination well */}
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title='Eliminar Orden'
        message={`¿Estás seguro de eliminar la orden? Esta acción no se puede deshacer.`}
        confirmText='Eliminar'
      />
    </>
  );
};

export default PurchaseOrdersView;
