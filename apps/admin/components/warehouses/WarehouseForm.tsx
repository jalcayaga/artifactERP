'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto } from '@artifact/core';

interface WarehouseFormProps {
  warehouse?: Warehouse | null;
  onSave: (data: CreateWarehouseDto & Partial<UpdateWarehouseDto> & { id?: string }) => void;
  onCancel: () => void;
}

interface FormInputs {
  name: string;
  address?: string;
  isDefault: boolean;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({
  warehouse,
  onSave,
  onCancel,
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      name: warehouse?.name || '',
      address: warehouse?.address || '',
      isDefault: warehouse?.isDefault || false,
    },
  });

  useEffect(() => {
    if (warehouse) {
      setValue('name', warehouse.name);
      setValue('address', warehouse.address || '');
      setValue('isDefault', warehouse.isDefault);
    }
  }, [warehouse, setValue]);

  const onSubmit = (data: FormInputs) => {
    onSave({
      ...data,
      id: warehouse?.id,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-[#1e293b] text-white">
      <div className="p-6 border-b border-blue-gray-100/10">
        <Typography variant="h5" color="white">
          {warehouse ? 'Editar Bodega' : 'Nueva Bodega'}
        </Typography>
        <Typography color="gray" className="mt-1 font-normal text-sm">
          Complete la información de la bodega.
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
            <Input
              label="Dirección"
              color="blue"
              className="text-white"
              {...register('address')}
            />
          </div>

          <div className="flex items-center">
            <Checkbox
              label={
                <div>
                  <Typography color="white" className="font-medium">
                    Bodega Principal
                  </Typography>
                  <Typography color="gray" className="font-normal text-xs">
                    Esta bodega será seleccionada por defecto en nuevas operaciones.
                  </Typography>
                </div>
              }
              containerProps={{
                className: "-mt-1",
              }}
              {...register('isDefault')}
            />
          </div>

        </CardBody>

        <CardFooter className="pt-0 flex justify-end gap-3 border-t border-blue-gray-100/10 p-6">
          <Button variant="outlined" color="white" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="gradient" color="blue" type="submit">
            {warehouse ? 'Guardar Cambios' : 'Crear Bodega'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WarehouseForm;
