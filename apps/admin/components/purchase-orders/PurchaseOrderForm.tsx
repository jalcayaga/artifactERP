'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
    IconButton,
} from "@material-tailwind/react";
import {
    PurchaseOrder,
    CreatePurchaseOrderDto,
    UpdatePurchaseOrderDto,
    Company,
    Product,
    formatCurrencyChilean
} from '@artifact/core';
import { CompanyService, ProductService, useAuth } from '@artifact/core/client';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PurchaseOrderFormProps {
    initialData?: PurchaseOrder | null;
    onSave: (data: CreatePurchaseOrderDto | UpdatePurchaseOrderDto) => Promise<void>;
    isProcessing: boolean;
}

interface OrderItemForm {
    productId: string;
    productName: string; // for display/cache
    quantity: number;
    unitPrice: number;
}

interface FormInputs {
    companyId: string;
    orderDate: string;
    expectedDeliveryDate?: string;
    notes?: string;
    items: OrderItemForm[];
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
    initialData,
    onSave,
    isProcessing,
}) => {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();

    const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            companyId: initialData?.companyId || '',
            orderDate: initialData?.orderDate ? new Date(initialData.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            expectedDeliveryDate: initialData?.expectedDeliveryDate ? new Date(initialData.expectedDeliveryDate).toISOString().split('T')[0] : '',
            items: initialData?.items?.map(i => ({
                productId: i.productId,
                productName: i.productName,
                quantity: i.quantity,
                unitPrice: i.unitPrice
            })) || [{ productId: '', productName: '', quantity: 1, unitPrice: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const suppliersQuery = useQuery({
        queryKey: ['suppliers', token],
        enabled: Boolean(isAuthenticated && token),
        queryFn: async () => {
            if (!token) throw new Error('Sesión expirada');
            return await CompanyService.getAllCompanies(1, 100, { isSupplier: true });
        }
    });

    const productsQuery = useQuery({
        queryKey: ['products-list', token],
        enabled: Boolean(isAuthenticated && token),
        queryFn: async () => {
            if (!token) throw new Error('Sesión expirada');
            return await ProductService.getAllProducts(token, 1, 100); // Fetch first 100 for now
        }
    });

    const suppliers = suppliersQuery.data?.data || [];
    const products = productsQuery.data?.data || [];
    const items = watch('items');

    // Calculate totals for preview
    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const vatAmount = Math.round(subTotal * 0.19);
    const grandTotal = subTotal + vatAmount;

    const onSubmit = async (data: FormInputs) => {
        // transform items to match DTO
        const transformedItems = data.items.map(item => {
            const total = item.quantity * item.unitPrice;
            const tax = Math.round(total * 0.19);
            return {
                productId: item.productId,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                totalPrice: total,
                itemVatAmount: tax,
                totalPriceWithVat: total + tax,
            };
        });

        const payload: CreatePurchaseOrderDto = {
            companyId: data.companyId,
            orderDate: new Date(data.orderDate).toISOString(),
            expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate).toISOString() : undefined,
            items: transformedItems,
            subTotalAmount: subTotal,
            totalVatAmount: vatAmount,
            grandTotal: grandTotal,
            // status is handled by service or backend default (DRAFT)
        };

        await onSave(payload);
    };

    const handleProductChange = (index: number, productId: string) => {
        setValue(`items.${index}.productId`, productId);
        const product = products.find(p => p.id === productId);
        if (product) {
            setValue(`items.${index}.productName`, product.name);
            setValue(`items.${index}.unitPrice`, product.price || 0); // Default to sales price? Purchase price might be diff.
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-5xl mx-auto flex flex-col gap-6 p-4">
            {/* Header Card */}
            <Card className="bg-[#1e293b] text-white">
                <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Typography variant="small" className="mb-2 font-medium text-blue-gray-300">
                            Proveedor *
                        </Typography>
                        <Controller
                            name="companyId"
                            control={control}
                            rules={{ required: 'Proveedor requerido' }}
                            render={({ field }) => (
                                <Select
                                    label="Seleccionar Proveedor"
                                    className="text-white bg-[#0f172a]"
                                    error={!!errors.companyId}
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)}
                                >
                                    {suppliers.map(s => (
                                        <Option key={s.id} value={s.id}>{s.name} {s.rut ? `(${s.rut})` : ''}</Option>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>
                    <div>
                        <Typography variant="small" className="mb-2 font-medium text-blue-gray-300">
                            Fecha de Orden *
                        </Typography>
                        <Input
                            type="date"
                            className="text-white bg-[#0f172a]"
                            {...register('orderDate', { required: true })}
                            error={!!errors.orderDate}
                        />
                    </div>
                    <div>
                        <Typography variant="small" className="mb-2 font-medium text-blue-gray-300">
                            Fecha Entrega Estimada
                        </Typography>
                        <Input
                            type="date"
                            className="text-white bg-[#0f172a]"
                            {...register('expectedDeliveryDate')}
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Items Card */}
            <Card className="bg-[#1e293b] text-white overflow-hidden">
                <div className="p-4 bg-[#0f172a] border-b border-white/5 flex justify-between items-center">
                    <Typography variant="h6" color="white">Items de la Orden</Typography>
                    <Button size="sm" color="blue" variant="text" className="flex items-center gap-2" onClick={() => append({ productId: '', productName: '', quantity: 1, unitPrice: 0 })}>
                        <PlusIcon className="w-4 h-4" /> Agregar Item
                    </Button>
                </div>
                <CardBody className="p-0 overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200">Producto</th>
                                <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200 w-24">Cant.</th>
                                <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200 w-32">Precio Unit. (Neto)</th>
                                <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200 w-32">Total (Neto)</th>
                                <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => {
                                const qty = items[index]?.quantity || 0;
                                const price = items[index]?.unitPrice || 0;
                                const total = qty * price;

                                return (
                                    <tr key={field.id} className="hover:bg-white/5">
                                        <td className="p-4">
                                            <Controller
                                                name={`items.${index}.productId`}
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <div className="w-full min-w-[200px]">
                                                        <select
                                                            className="w-full bg-[#0f172a] border border-blue-gray-800 rounded px-2 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                                            value={field.value}
                                                            onChange={(e) => handleProductChange(index, e.target.value)}
                                                        >
                                                            <option value="">Seleccionar Producto...</option>
                                                            {products.map(p => (
                                                                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <Input
                                                type="number"
                                                min="1"
                                                className="text-white !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{ className: "min-w-[80px]" }}
                                                {...register(`items.${index}.quantity` as const, { valueAsNumber: true, min: 1 })}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <Input
                                                type="number"
                                                min="0"
                                                className="text-white !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{ className: "min-w-[100px]" }}
                                                {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true, min: 0 })}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" className="text-right font-medium text-white">
                                                {formatCurrencyChilean(total)}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <IconButton variant="text" color="red" size="sm" onClick={() => remove(index)}>
                                                <TrashIcon className="w-4 h-4" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {fields.length === 0 && (
                        <div className="p-8 text-center text-blue-gray-400">
                            No hay items en la orden. Agrega productos para continuar.
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Footer Totals & Actions */}
            <Card className="bg-[#1e293b] text-white">
                <CardBody className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="w-full md:w-1/2">
                        <Textarea
                            label="Notas"
                            className="text-white"
                            rows={3}
                            {...register('notes')}
                        />
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-blue-gray-300">Subtotal Neto:</span>
                            <span className="font-medium text-white">{formatCurrencyChilean(subTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-blue-gray-300">IVA (19%):</span>
                            <span className="font-medium text-white">{formatCurrencyChilean(vatAmount)}</span>
                        </div>
                        <div className="border-t border-white/10 my-1"></div>
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-blue-400">Total:</span>
                            <span className="text-white">{formatCurrencyChilean(grandTotal)}</span>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="pt-0 border-t border-white/5 flex justify-end gap-3">
                    <Button variant="outlined" color="white" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button variant="gradient" color="blue" type="submit" loading={isProcessing}>
                        {initialData ? 'Actualizar Orden' : 'Crear Orden'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default PurchaseOrderForm;
