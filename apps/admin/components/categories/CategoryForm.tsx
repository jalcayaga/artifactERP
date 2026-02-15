'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
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

  // Filter out the category itself and its children to prevent cycles (simple check for itself)
  const availableParents = categories.filter(c => c.id !== category?.id);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-[#1e293b] text-white">
      <div className="p-6 border-b border-blue-gray-100/10">
        <Typography variant="h5" color="white">
          {category ? 'Editar Categoría' : 'Nueva Categoría'}
        </Typography>
        <Typography color="gray" className="mt-1 font-normal text-sm">
          Complete la información de la categoría. Use nombres claros y descriptivos.
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="flex flex-col gap-6">
          <div>
            <Input
              label="Nombre *"
              color="blue"
              className="text-white"
              {...register('name', { required: 'El nombre es obligatorio' })}
              error={!!errors.name}
            />
            {errors.name && (
              <Typography variant="small" color="red" className="mt-1 text-xs">
                {errors.name.message}
              </Typography>
            )}
          </div>

          <div>
            <Textarea
              label="Descripción"
              color="blue"
              className="text-white"
              {...register('description')}
            />
          </div>

          <div>
            <Select
              label="Categoría Padre"
              className="text-white"
              value={parentId}
              onChange={(val) => setValue('parentId', val)}
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
            >
              <Option value="">Ninguna (Raíz)</Option>
              {availableParents.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
            <Typography variant="small" color="gray" className="mt-1 text-xs">
              Opcional. Seleccione para crear una subcategoría.
            </Typography>
          </div>

        </CardBody>

        <CardFooter className="pt-0 flex justify-end gap-3 border-t border-blue-gray-100/10 p-6">
          <Button variant="outlined" color="white" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="gradient" color="blue" type="submit">
            {category ? 'Guardar Cambios' : 'Crear Categoría'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CategoryForm;
