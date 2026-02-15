'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto } from '@artifact/core';
import { WarehouseService, useAuth } from '@artifact/core/client';
import {
  DataTable,
} from '@artifact/ui';
import { ColumnDef } from '@tanstack/react-table';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  XCircleIcon,
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
import WarehouseForm from './WarehouseForm';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const PAGE_SIZE = 10;

const WarehousesView: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [showWarehouseForm, setShowWarehouseForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(null);

  const warehousesQuery = useQuery({
    queryKey: ['warehouses', token],
    enabled: Boolean(isAuthenticated && token),
    queryFn: async () => {
      if (!token) throw new Error('Sesión expirada');
      return await WarehouseService.getAllWarehouses(token);
    },
  });

  const warehouses = warehousesQuery.data ?? [];

  const saveWarehouseMutation = useMutation({
    mutationFn: async (payload: CreateWarehouseDto & Partial<UpdateWarehouseDto> & { id?: string }) => {
      if (!token) throw new Error('Sesión expirada');

      if (payload.id) {
        const { id, ...rest } = payload;
        return await WarehouseService.updateWarehouse(id, rest, token);
      } else {
        return await WarehouseService.createWarehouse(payload as CreateWarehouseDto, token);
      }
    },
    onSuccess: (warehouse) => {
      toast.success(`Bodega ${warehouse.name} guardado correctamente.`);
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      setShowWarehouseForm(false);
      setEditingWarehouse(null);
    },
    onError: (error: any) => {
      console.error('Error saving warehouse:', error);
      toast.error(error?.message || 'Error al guardar la bodega.');
    },
  });

  const deleteWarehouseMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Sesión expirada');
      await WarehouseService.deleteWarehouse(id, token);
    },
    onSuccess: () => {
      toast.success('Bodega eliminada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
    onError: (error: any) => {
      console.error('Error deleting warehouse:', error);
      toast.error(error?.message || 'Error al eliminar la bodega.');
    },
    onSettled: () => {
      setShowDeleteConfirmModal(false);
      setWarehouseToDelete(null);
    },
  });

  const handleAddNew = useCallback(() => {
    setEditingWarehouse(null);
    setShowWarehouseForm(true);
  }, []);

  const handleEdit = useCallback((warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setShowWarehouseForm(true);
  }, []);

  const handleDelete = useCallback((warehouse: Warehouse) => {
    setWarehouseToDelete(warehouse);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (warehouseToDelete) {
      deleteWarehouseMutation.mutate(warehouseToDelete.id);
    }
  }, [warehouseToDelete, deleteWarehouseMutation]);

  const handleCloseForm = useCallback(() => {
    setShowWarehouseForm(false);
    setEditingWarehouse(null);
  }, []);

  const handleSave = useCallback(async (data: any) => {
    await saveWarehouseMutation.mutateAsync(data);
  }, [saveWarehouseMutation]);

  const columns = useMemo<ColumnDef<Warehouse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-white">{row.original.name}</span>
          </div>
        )
      },
      {
        accessorKey: 'address',
        header: 'Dirección',
        cell: ({ row }) => row.original.address || '-',
      },
      {
        accessorKey: 'isDefault',
        header: 'Por Defecto',
        cell: ({ row }) => (
          row.original.isDefault ? (
            <Chip color="green" value="Principal" size="sm" variant="ghost" className="rounded-full" />
          ) : (
            <span className="text-gray-500">-</span>
          )
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Creada el',
        cell: ({ row }) => new Date(row.original.createdAt || '').toLocaleDateString(),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className='flex items-center justify-end gap-1'>
            <Tooltip content="Editar">
              <IconButton
                variant="text"
                color="blue"
                size="sm"
                onClick={() => handleEdit(row.original)}
              >
                <PencilIcon className='w-4 h-4' />
              </IconButton>
            </Tooltip>
            {!row.original.isDefault && (
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

  if (warehousesQuery.isError) {
    return <div className="p-8 text-center text-red-500">Error cargar bodegas</div>;
  }

  if (showWarehouseForm) {
    return <WarehouseForm
      warehouse={editingWarehouse}
      onSave={handleSave}
      onCancel={handleCloseForm}
    />;
  }

  return (
    <>
      <div className='mt-4 mb-8 flex flex-col gap-6'>
        <DataTable<Warehouse>
          title="Bodegas"
          description="Administra tus almacenes y ubicaciones de inventario."
          columns={columns}
          data={warehouses}
          isLoading={warehousesQuery.isLoading}
          filterColumn='name'
          filterPlaceholder='Buscar bodegas...'
          renderActions={
            <Button
              className="flex items-center gap-3 bg-blue-500"
              size="sm"
              onClick={handleAddNew}
            >
              <PlusIcon className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Nueva Bodega</span>
            </Button>
          }
          emptyState={
            <div className='text-center py-12 px-4'>
              <BuildingOffice2Icon className='mx-auto h-16 w-16 text-blue-gray-400 opacity-40' />
              <Typography variant="h5" color="white" className="mt-4 font-bold">
                No hay bodegas registradas
              </Typography>
              <Button
                variant="gradient"
                color="blue"
                onClick={handleAddNew}
                className="mt-6 flex items-center gap-2 mx-auto"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Crear Bodega</span>
              </Button>
            </div>
          }
        />
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title='Eliminar Bodega'
        message={`¿Estás seguro de eliminar "${warehouseToDelete?.name}"?`}
        confirmText='Eliminar'
      />
    </>
  );
};

export default WarehousesView;
