'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@artifact/core';
import { CategoryService, useAuth } from '@artifact/core/client';
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  ChevronRight,
  Search,
  Hash,
  Layers,
  MoreVertical,
  ChevronDown,
  FolderTree,
  ExternalLink
} from 'lucide-react';
import {
  Card,
  Typography,
  Button,
  IconButton,
  Input,
  Chip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CategoryForm from './CategoryForm';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const CategoriesView: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter categories and preserve hierarchy mapping
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Organize hierarchical tree
  const categoryTree = useMemo(() => {
    const map = new Map<string, any>();
    const roots: any[] = [];

    // First pass: create all nodes
    categories.forEach(cat => {
      map.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: link nodes
    map.forEach(node => {
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId).children.push(node);
      } else if (!node.parentId) {
        roots.push(node);
      }
    });

    return roots;
  }, [categories]);

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
      toast.error(error?.message || 'Error al eliminar la categoría.');
    },
    onSettled: () => {
      setShowDeleteConfirmModal(false);
      setCategoryToDelete(null);
    },
  });

  const handleAddNew = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
    }
  };

  const CategoryRow = ({ category, depth = 0 }: { category: any; depth?: number }) => (
    <React.Fragment>
      <tr className="group hover:bg-white/[0.03] transition-all duration-300">
        <td className="p-4" style={{ paddingLeft: `${depth * 2 + 1.5}rem` }}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${depth === 0 ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-slate-500/10 border-slate-500/20 text-slate-500'}`}>
              {depth === 0 ? <Layers className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
            </div>
            <div className="flex flex-col">
              <span className={`font-black uppercase italic tracking-tight ${depth === 0 ? 'text-white' : 'text-slate-300'}`}>
                {category.name}
              </span>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{category.slug}</span>
            </div>
          </div>
        </td>
        <td className="p-4">
          <Typography className="text-sm font-medium text-slate-400 line-clamp-1 italic" placeholder="" >
            {category.description || '-'}
          </Typography>
        </td>
        <td className="p-4">
          <div className="flex justify-center">
            <Chip
              value={category.children?.length ? `${category.children.length} Subcategorías` : 'Categoría Final'}
              className={`text-[9px] font-black uppercase tracking-widest rounded-lg px-2 ${category.children?.length ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' : 'bg-slate-500/10 text-slate-500 border border-slate-500/10'}`}
              
            />
          </div>
        </td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-1">
            <IconButton variant="text" color="blue" onClick={() => handleEdit(category)} className="rounded-xl hover:bg-blue-500/10" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
              <Edit2 className="w-4 h-4" />
            </IconButton>
            <IconButton variant="text" color="red" onClick={() => handleDelete(category)} className="rounded-xl hover:bg-red-500/10" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </div>
        </td>
      </tr>
      {category.children?.map((child: any) => (
        <CategoryRow key={child.id} category={child} depth={depth + 1} />
      ))}
    </React.Fragment>
  );

  if (showCategoryForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CategoryForm
          category={editingCategory}
          onSave={async (data) => {
            await saveCategoryMutation.mutateAsync(data);
          }}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          categories={categories}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FolderTree className="w-8 h-8 text-white" />
          </div>
          <div>
            <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none" placeholder="" >
              Jerarquía de <span className="text-blue-500">Categorías</span>
            </Typography>
            <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2" placeholder="" >
              <Tag className="w-4 h-4 text-blue-500/50" /> Organización lógica de productos y servicios
            </Typography>
          </div>
        </div>

        <Button
          variant="gradient"
          color="blue"
          size="lg"
          onClick={handleAddNew}
          className="flex items-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs group"
          placeholder=""  onResize={undefined} onResizeCapture={undefined}
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Nueva Categoría
        </Button>
      </div>

      {/* Glass Search Bar */}
      <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-2 rounded-[2rem] shadow-2xl" placeholder="" >
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="BUSCAR CATEGORÍA POR NOMBRE O SLUG..."
            className="w-full bg-white/[0.03] border-0 rounded-[1.5rem] py-5 px-14 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-widest shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Main Data Table */}
      <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl" placeholder="" >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Categoría / Slug</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Descripción</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Nivel</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {searchTerm ? (
                filteredCategories.map(cat => (
                  <CategoryRow key={cat.id} category={cat} depth={0} />
                ))
              ) : (
                categoryTree.map(cat => (
                  <CategoryRow key={cat.id} category={cat} depth={0} />
                ))
              )}
              {categoriesQuery.isLoading && (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                      <Typography className="text-slate-500 font-black uppercase tracking-widest text-xs" placeholder="" >
                        Cargando jerarquía...
                      </Typography>
                    </div>
                  </td>
                </tr>
              )}
              {!categoriesQuery.isLoading && filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FolderTree className="w-16 h-16 text-slate-800" />
                      <Typography className="text-slate-600 font-bold uppercase tracking-widest text-xs" placeholder="" >
                        No se encontraron categorías
                      </Typography>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title='Eliminar Categoría'
        message={`¿Estás seguro de eliminar "${categoryToDelete?.name}"? Esta acción podría afectar a sus subcategorías.`}
        confirmText='Eliminar permanentemente'
      />
    </div>
  );
};

export default CategoriesView;
