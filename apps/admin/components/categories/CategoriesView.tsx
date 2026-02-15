'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@artifact/core';
import { CategoryService, useAuth } from '@artifact/core/client';
import {
  DataTable,
} from '@artifact/ui';
import { ColumnDef } from '@tanstack/react-table';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import {
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CategoryForm from './CategoryForm';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const PAGE_SIZE = 10;

const CategoriesView: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // const [currentPage, setCurrentPage] = useState(1); // Pagination not implemented in getAllCategories yet? Service returns data array directly.
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ['categories', token],
    enabled: Boolean(isAuthenticated && token),
    queryFn: async () => {
      if (!token) throw new Error('Sesión expirada');
      return await CategoryService.getAllCategories(token);
    },
  });

  const categories = categoriesQuery.data ?? [];

  const saveCategoryMutation = useMutation({
    mutationFn: async (payload: CreateCategoryDto & Partial<UpdateCategoryDto> & { id?: string }) => {
      if (!token) throw new Error('Sesión expirada');

      if (payload.id) {
        const { id, ...rest } = payload;
        return await CategoryService.updateCategory(id, rest, token);
      } else {
        return await CategoryService.createCategory(payload as CreateCategoryDto, token);
      }
    },
    onSuccess: (category) => {
      toast.success(`Categoría ${category.name} guardada correctamente.`);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowCategoryForm(false);
      setEditingCategory(null);
    },
    onError: (error: any) => {
      console.error('Error saving category:', error);
      toast.error(error?.message || 'Error al guardar la categoría.');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Sesión expirada');
      await CategoryService.deleteCategory(id, token);
    },
    onSuccess: () => {
      toast.success('Categoría eliminada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      console.error('Error deleting category:', error);
      toast.error(error?.message || 'Error al eliminar la categoría.');
    },
    onSettled: () => {
      setShowDeleteConfirmModal(false);
      setCategoryToDelete(null);
    },
  });

  const handleAddNew = useCallback(() => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  }, []);

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  }, []);

  const handleDelete = useCallback((category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
    }
  }, [categoryToDelete, deleteCategoryMutation]);

  const handleCloseForm = useCallback(() => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  }, []);

  const handleSave = useCallback(async (data: any) => {
    await saveCategoryMutation.mutateAsync(data);
  }, [saveCategoryMutation]);

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-white">{row.original.name}</span>
            <span className="text-xs text-blue-gray-400">{row.original.slug}</span>
          </div>
        )
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: ({ row }) => row.original.description || '-',
      },
      {
        accessorKey: 'parent',
        header: 'Categoría Padre',
        cell: ({ row }) => row.original.parent?.name || '-',
      },
      {
        accessorKey: 'updatedAt',
        header: 'Última Act.',
        cell: ({ row }) => new Date(row.original.updatedAt || '').toLocaleDateString(),
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
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  if (categoriesQuery.isError) {
    return <div className="p-8 text-center text-red-500">Error cargar categorías</div>;
  }

  if (showCategoryForm) {
    return <CategoryForm
      category={editingCategory}
      onSave={handleSave}
      onCancel={handleCloseForm}
      categories={categories} // Pass existing categories for parent selection
    />;
  }

  return (
    <>
      <div className='mt-4 mb-8 flex flex-col gap-6'>
        <DataTable<Category>
          title="Categorías"
          description="Organiza tus productos en categorías jerárquicas."
          columns={columns}
          data={categories}
          isLoading={categoriesQuery.isLoading}
          filterColumn='name'
          filterPlaceholder='Buscar categorías...'
          renderActions={
            <Button
              className="flex items-center gap-3 bg-blue-500"
              size="sm"
              onClick={handleAddNew}
            >
              <PlusIcon className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Nueva Categoría</span>
            </Button>
          }
          emptyState={
            <div className='text-center py-12 px-4'>
              <TagIcon className='mx-auto h-16 w-16 text-blue-gray-400 opacity-40' />
              <Typography variant="h5" color="white" className="mt-4 font-bold">
                No hay categorías registradas
              </Typography>
              <Button
                variant="gradient"
                color="blue"
                onClick={handleAddNew}
                className="mt-6 flex items-center gap-2 mx-auto"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Crear Categoría</span>
              </Button>
            </div>
          }
        />
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title='Eliminar Categoría'
        message={`¿Estás seguro de eliminar "${categoryToDelete?.name}"?`}
        confirmText='Eliminar'
      />
    </>
  );
};

export default CategoriesView;
