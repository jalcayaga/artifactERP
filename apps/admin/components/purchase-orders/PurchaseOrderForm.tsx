'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
    ShoppingCart,
    Plus,
    Trash2,
    Search,
    Package,
    Building2,
    Calendar,
    Save,
    X,
    Info,
    Truck,
    PackageSearch,
    Clock
} from 'lucide-react';
import {
    Card,
    Typography,
    Button,
    IconButton,
    Input,
    Select,
    Option,
    Textarea
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
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PurchaseOrderFormProps {
    initialData?: PurchaseOrder | null;
    onSave: (data: CreatePurchaseOrderDto | UpdatePurchaseOrderDto) => Promise<void>;
    isProcessing: boolean;
}

interface OrderItemForm {
    id?: string;
    productId: string;
    productName: string;
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

const FIXED_VAT_RATE_PERCENT = 19;

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
    initialData,
    onSave,
    isProcessing,
}) => {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);

    const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            companyId: initialData?.companyId || '',
            orderDate: initialData?.orderDate ? new Date(initialData.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            expectedDeliveryDate: initialData?.expectedDeliveryDate ? new Date(initialData.expectedDeliveryDate).toISOString().split('T')[0] : '',
            notes: (initialData as any)?.notes || '',
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
            const res = await CompanyService.getAllCompanies(1, 100, { isSupplier: true });
            return Array.isArray(res) ? res : res?.data ?? [];
        }
    });

    const suppliers = suppliersQuery.data || [];
    const formItems = watch('items');

    // Real-time Search Logic (per line)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (token && activeLineIndex !== null && searchTerm.length > 2) {
                ProductService.searchProducts(token, searchTerm)
                    .then((res) => {
                        const products = Array.isArray(res) ? res : res?.data ?? [];
                        setSearchResults(products);
                    })
                    .catch((err) => console.error('Error searching products:', err));
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, token, activeLineIndex]);

    const { subTotal, vatAmount, grandTotal } = useMemo(() => {
        const net = formItems.reduce((sum, item) => sum + ((parseFloat(item.quantity as any) || 0) * (parseFloat(item.unitPrice as any) || 0)), 0);
        const vat = Math.round(net * (FIXED_VAT_RATE_PERCENT / 100));
        return {
            subTotal: net,
            vatAmount: vat,
            grandTotal: net + vat
        };
    }, [formItems]);

    const handleProductSelect = (index: number, product: Product) => {
        setValue(`items.${index}.productId`, product.id);
        setValue(`items.${index}.productName`, product.name);
        setValue(`items.${index}.unitPrice`, product.price || 0); // Reference price
        setActiveLineIndex(null);
        setSearchTerm('');
        setSearchResults([]);
    };

    const onSubmit = async (data: FormInputs) => {
        const transformedItems = data.items.map(item => {
            const total = item.quantity * item.unitPrice;
            const tax = Math.round(total * (FIXED_VAT_RATE_PERCENT / 100));
            return {
                productId: item.productId,
                productName: item.productName,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                totalPrice: total,
                itemVatAmount: tax,
                totalPriceWithVat: total + tax,
            };
        });

        const payload: any = {
            companyId: data.companyId,
            orderDate: new Date(data.orderDate).toISOString(),
            expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate).toISOString() : undefined,
            notes: data.notes,
            items: transformedItems,
            subTotalAmount: subTotal,
            totalVatAmount: vatAmount,
            grandTotal: grandTotal,
        };

        if (initialData?.id) {
            payload.id = initialData.id;
        }

        await onSave(payload);
    };

    return (
        <Card className="max-w-6xl mx-auto border-white/[0.05] bg-[#1a2537]/80 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-[3rem] overflow-hidden border" placeholder="" >
            {/* Arctic Header for Purchase Orders */}
            <div className="p-10 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-br from-blue-400/10 via-transparent to-transparent relative">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500 flex items-center justify-center shadow-2xl shadow-blue-500/40 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <ShoppingCart className="w-9 h-9 text-white relative z-10" />
                    </div>
                    <div>
                        <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none text-3xl" placeholder="" >
                            Orden de <span className="text-blue-400">Compra Formal</span>
                        </Typography>
                        <div className="flex items-center gap-4 mt-2">
                            <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2" placeholder="" >
                                <Truck className="w-4 h-4 text-blue-500/50" /> Solicitud de Mercadería
                            </Typography>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <div className="flex items-center gap-1.5 text-blue-400/60">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{initialData ? 'Editando Documento' : 'Nuevo Borrador'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <IconButton variant="text" color="white" onClick={() => router.back()} className="rounded-full bg-white/5 hover:bg-white/10 w-12 h-12" placeholder="" >
                    <X className="w-7 h-7" />
                </IconButton>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-12 space-y-12">
                {/* Header Section: Provider & Dates */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-6 space-y-8">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-blue-400" />
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Proveedor Destinatario
                            </Typography>
                        </div>
                        <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05]">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Buscar por RUT o Nombre</label>
                                    <Controller
                                        name="companyId"
                                        control={control}
                                        rules={{ required: 'Proveedor requerido' }}
                                        render={({ field }) => (
                                            <Select
                                                label="Seleccionar Proveedor"
                                                className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl h-12"
                                                labelProps={{ className: "hidden" }}
                                                value={field.value}
                                                onChange={(val) => field.onChange(val)}
                                            >
                                                {suppliers.map(s => (
                                                    <Option key={s.id} value={s.id} className="font-bold uppercase text-xs">{s.name} ({s.rut})</Option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.companyId && <span className="text-[10px] text-red-400 font-bold uppercase ml-1 italic">{errors.companyId.message}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                    Emisión
                                </Typography>
                            </div>
                            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05]">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha de Orden</label>
                                <Input crossOrigin=""
                                    type="date"
                                    size="lg"
                                    className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase text-xs"
                                    labelProps={{ className: "hidden" }}
                                    {...register('orderDate', { required: true })}
                                />
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-emerald-400">
                                <Clock className="w-5 h-5" />
                                <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                    Expectativa
                                </Typography>
                            </div>
                            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05]">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entrega Estimada</label>
                                <Input crossOrigin=""
                                    type="date"
                                    size="lg"
                                    className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase text-xs"
                                    labelProps={{ className: "hidden" }}
                                    {...register('expectedDeliveryDate')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Items Table */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Package className="w-5 h-5 text-blue-500" />
                            </div>
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Detalle de Requerimientos <span className="text-slate-600 text-[10px] ml-2 font-bold uppercase tracking-normal">({fields.length} líneas)</span>
                            </Typography>
                        </div>
                        <Button
                            variant="gradient"
                            color="blue"
                            onClick={() => append({ productId: '', productName: '', quantity: 1, unitPrice: 0 })}
                            className="flex items-center gap-3 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 py-3 shadow-lg shadow-blue-500/10"
                            placeholder="" 
                        >
                            <Plus className="w-4 h-4" /> Agregar Item
                        </Button>
                    </div>

                    <div className="table-responsive">
                        <table className="w-full border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-left">
                                    <th className="px-6 pb-2"><Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest" placeholder="" >Producto / Glosa</Typography></th>
                                    <th className="px-6 pb-2 text-center w-24"><Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest" placeholder="" >Cant.</Typography></th>
                                    <th className="px-6 pb-2 text-right w-40"><Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest" placeholder="" >Neto Listado</Typography></th>
                                    <th className="px-6 pb-2 text-right w-40"><Typography className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest" placeholder="" >Subtotal</Typography></th>
                                    <th className="px-6 pb-2 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field, index) => {
                                    const qty = formItems[index]?.quantity || 0;
                                    const price = formItems[index]?.unitPrice || 0;
                                    const total = qty * price;

                                    return (
                                        <tr key={field.id} className="bg-white/[0.03] border border-white/[0.05] group animate-in slide-in-from-right-4 duration-500">
                                            <td className="px-6 py-5 rounded-l-[1.5rem] relative">
                                                <div className="relative">
                                                    <Input crossOrigin=""
                                                        size="md"
                                                        placeholder="BUSCAR O ESCRIBIR..."
                                                        className="!border-white/10 !bg-transparent text-white focus:!border-blue-500 rounded-lg font-bold uppercase text-xs pr-10"
                                                        labelProps={{ className: "hidden" }}
                                                        value={activeLineIndex === index ? searchTerm : formItems[index]?.productName}
                                                        onFocus={() => {
                                                            setActiveLineIndex(index);
                                                            setSearchTerm(formItems[index]?.productName || '');
                                                        }}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setSearchTerm(val);
                                                            setValue(`items.${index}.productName`, val);
                                                        }}
                                                    />
                                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                                </div>

                                                {/* Search Results */}
                                                {activeLineIndex === index && searchResults.length > 0 && (
                                                    <div className="absolute z-50 w-[120%] left-0 bg-[#1A2235] border border-white/10 rounded-2xl shadow-2xl mt-2 overflow-hidden backdrop-blur-3xl">
                                                        {searchResults.map((product) => (
                                                            <button
                                                                key={product.id}
                                                                type="button"
                                                                className="w-full px-5 py-3.5 hover:bg-blue-600 transition-colors flex items-center justify-between text-left group/res"
                                                                onClick={() => handleProductSelect(index, product)}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span className="text-white font-black uppercase text-[11px]">{product.name}</span>
                                                                    <span className="text-[9px] text-slate-500 group-hover/res:text-blue-100 uppercase mt-0.5">SKU: {product.sku || 'N/A'}</span>
                                                                </div>
                                                                <span className="bg-blue-500/10 text-blue-400 group-hover/res:bg-white/20 group-hover/res:text-white px-2 py-1 rounded-md text-[9px] font-black">
                                                                    REF: {formatCurrencyChilean(product.price || 0)}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <Input crossOrigin=""
                                                    type="number"
                                                    size="md"
                                                    className="!border-white/10 !bg-transparent text-white focus:!border-blue-500 rounded-lg font-bold text-center text-xs"
                                                    labelProps={{ className: "hidden" }}
                                                    {...register(`items.${index}.quantity` as const, { valueAsNumber: true, min: 1 })}
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <Input crossOrigin=""
                                                    type="number"
                                                    size="md"
                                                    className="!border-white/10 !bg-transparent text-white focus:!border-blue-500 rounded-lg font-black text-right text-xs"
                                                    labelProps={{ className: "hidden" }}
                                                    {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true, min: 0 })}
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Typography className="text-sm font-black text-white italic" placeholder="" >
                                                    {formatCurrencyChilean(total)}
                                                </Typography>
                                            </td>
                                            <td className="px-6 py-5 rounded-r-[1.5rem] flex justify-center items-center">
                                                <IconButton variant="text" color="red" onClick={() => remove(index)} className="rounded-xl hover:bg-red-500/10" placeholder="" >
                                                    <Trash2 className="w-4 h-4 text-red-500/40 group-hover:text-red-500 transition-colors" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {fields.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-blue-500/[0.01]">
                                <PackageSearch className="w-10 h-10 text-slate-700 mb-4" />
                                <Typography className="text-slate-600 font-black uppercase tracking-widest text-[10px]" placeholder="" >
                                    No hay items definidos para esta orden
                                </Typography>
                            </div>
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/5">
                    {/* General Notes */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-3">
                            <Info className="w-5 h-5 text-blue-400" />
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Instrucciones o Notas
                            </Typography>
                        </div>
                        <Textarea
                            rows={5}
                            placeholder="ESPECIFICACIONES DE ENTREGA, CONTACTO O COMENTARIOS ADICIONALES..."
                            className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-3xl p-6 font-bold text-sm tracking-tight"
                            labelProps={{ className: "hidden" }}
                            {...register('notes')}
                        />
                    </div>

                    {/* Totals Summary */}
                    <div className="lg:col-span-5">
                        <Card className="bg-[#0f172a]/90 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/[0.08] shadow-2xl space-y-6" placeholder="" >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center opacity-50">
                                    <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]" placeholder="" >Suma Neta</Typography>
                                    <Typography className="text-lg font-bold text-white tracking-tight" placeholder="" >{formatCurrencyChilean(subTotal)}</Typography>
                                </div>
                                <div className="flex justify-between items-center opacity-50">
                                    <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]" placeholder="" >Impuesto (19%)</Typography>
                                    <Typography className="text-lg font-bold text-white tracking-tight" placeholder="" >{formatCurrencyChilean(vatAmount)}</Typography>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <div className="flex justify-between items-center bg-blue-600/10 p-6 rounded-2xl border border-blue-600/20">
                                    <div className="flex flex-col">
                                        <Typography className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1" placeholder="" >Estimado Bruto</Typography>
                                        <Typography className="text-[9px] text-slate-500 font-black uppercase tracking-widest" placeholder="" >CLP Estimado</Typography>
                                    </div>
                                    <Typography variant="h2" color="white" className="font-black italic text-4xl tracking-tighter" placeholder="" >
                                        {formatCurrencyChilean(grandTotal)}
                                    </Typography>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                color="blue"
                                fullWidth
                                size="lg"
                                disabled={isProcessing || fields.length === 0}
                                className="flex items-center justify-center gap-4 rounded-3xl font-black uppercase tracking-[0.2em] text-sm py-6 shadow-2xl shadow-blue-500/40 relative group overflow-hidden"
                                placeholder="" 
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <Save className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">{isProcessing ? 'Procesando...' : (initialData ? 'Actualizar Orden' : 'Emitir Orden')}</span>
                            </Button>

                            <Button
                                variant="text"
                                color="white"
                                fullWidth
                                onClick={() => router.back()}
                                className="rounded-2xl font-black uppercase tracking-widest text-[10px] py-4 opacity-40 hover:opacity-100 transition-opacity"
                                placeholder="" 
                            >
                                Descartar Cambios
                            </Button>
                        </Card>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default PurchaseOrderForm;
