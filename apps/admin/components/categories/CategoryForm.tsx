'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  Input,
  Textarea,
  Button,
  Typography,
  Select,
  Option,
  IconButton
} from "@material-tailwind/react";
import {
  X,
  Save,
  Tag,
  Layers,
  Info,
  Type,
  AlignLeft,
  FolderPlus,
  ChevronRight
} from 'lucide-react';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@artifact/core';

interface CategoryFormProps {
  category?: Category | null;
  onSave: (data: CreateCategoryDto & Partial<UpdateCategoryDto> & { id?: string }) => void;
  onCancel: () => void;
  categories: Category[];
}

interface FormInputs {
  name: string;
  description?: string;
  parentId?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSave,
  onCancel,
  categories,
}) => {
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormInputs>({
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      parentId: category?.parentId || '',
    },
  });

  const parentId = watch('parentId');

  useEffect(() => {
    if (category) {
      setValue('name', category.name);
      setValue('description', category.description || '');
      setValue('parentId', category.parentId || '');
    }
  }, [category, setValue]);

  const onSubmit = (data: FormInputs) => {
    onSave({
      ...data,
      id: category?.id,
    });
  };

  // Filter out the category itself and its children to prevent cycles
  const availableParents = categories.filter(c => c.id !== category?.id);

  return (
    <Card className="max-w-2xl mx-auto border-white/[0.05] bg-[#1a2537]/60 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden border" placeholder="" >
      {/* Glossy Header */}
      <div className="p-8 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-transparent relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            {category ? <Layers className="w-8 h-8 text-white" /> : <FolderPlus className="w-8 h-8 text-white" />}
          </div>
          <div>
            <Typography variant="h4" color="white" className="font-black uppercase italic tracking-tighter leading-none text-2xl" placeholder="" >
              {category ? 'Editar' : 'Nueva'} <span className="text-blue-500">Categoría</span>
            </Typography>
            <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2" placeholder="" >
              <Tag className="w-4 h-4 text-blue-500/50" /> {category ? 'Actualización de metadatos' : 'Estructuración jerárquica'}
            </Typography>
          </div>
        </div>
        <IconButton variant="text" color="white" onClick={onCancel} className="rounded-full bg-white/5 hover:bg-white/10" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
          <X className="w-6 h-6" />
        </IconButton>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1 ml-1">
              <Type className="w-3 h-3 text-blue-500" />
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre de la Categoría *</label>
            </div>
            <Input
              size="lg"
              placeholder="EJ: ELECTRÓNICA, ROPA DEPORTIVA..."
              className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-2xl font-bold uppercase tracking-tight"
              labelProps={{ className: "hidden" }}
              {...register('name', { required: 'El nombre es obligatorio' })}
               crossOrigin={undefined}
            />
            {errors.name && (
              <Typography variant="small" color="red" className="mt-1 text-xs font-bold px-2">
                {errors.name.message}
              </Typography>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1 ml-1">
              <AlignLeft className="w-3 h-3 text-blue-500" />
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descripción / Notas</label>
            </div>
            <Textarea
              size="lg"
              placeholder="Describe brevemente de qué se trata esta categoría..."
              className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-2xl font-medium"
              labelProps={{ className: "hidden" }}
              rows={4}
              {...register('description')}
              
            />
          </div>

          {/* Parent Category Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1 ml-1">
              <Layers className="w-3 h-3 text-blue-500" />
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoría Padre (Jerarquía)</label>
            </div>
            <Select
              label="Seleccionar Categoría Raíz"
              className="!border-white/10 !bg-[#1a2537]/80 text-white focus:!border-blue-500 rounded-2xl h-14"
              value={parentId}
              onChange={(val) => setValue('parentId', val || '')}
              labelProps={{ className: "hidden" }}
            >
              <Option value="">Ninguna (Raíz)</Option>
              {availableParents.map((cat) => (
                <Option key={cat.id} value={cat.id} className="font-bold uppercase tracking-tight text-xs flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" /> {cat.name}
                </Option>
              ))}
            </Select>
            <div className="flex items-center gap-2 mt-2 px-1">
              <Info className="w-3 h-3 text-slate-600" />
              <Typography className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter" placeholder="" >
                Permite organizar productos en subniveles lógicos.
              </Typography>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-10 border-t border-white/5">
          <Button variant="text" color="white" onClick={onCancel} className="rounded-2xl font-black uppercase tracking-widest text-xs px-8" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
            Descartar
          </Button>
          <Button
            type="submit"
            variant="gradient"
            color="blue"
            size="lg"
            className="flex items-center gap-3 rounded-2xl font-black uppercase tracking-widest text-sm px-10 py-4 shadow-xl shadow-blue-500/20 group"
            placeholder=""  onResize={undefined} onResizeCapture={undefined}
          >
            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {category ? 'Actualizar Categoría' : 'Crear Categoría'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CategoryForm;
