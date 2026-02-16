'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    X,
    Save,
    Plus,
    Trash2,
    Search,
    Package,
    Calculator,
    User,
    FileText,
    CreditCard,
    DollarSign,
    Info,
    TrendingUp,
    Building2,
    PackageSearch,
    CheckCircle2
} from 'lucide-react';
import {
    Card,
    Typography,
    Button,
    IconButton,
    Input,
    Select,
    Option,
    Textarea,
} from "@material-tailwind/react";
import { Company, Product, formatCurrencyChilean, cn } from '@artifact/core';
import { CompanyService, ProductService, useAuth } from '@artifact/core/client';
import { toast } from 'sonner';

interface BoletaItem {
    id: string;
    productId?: string;
    name: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    total: number;
    isManual?: boolean;
}

interface BoletaFormProps {
    onCancel: () => void;
    onSave: (data: any) => void;
}

const BoletaForm: React.FC<BoletaFormProps> = ({ onCancel, onSave }) => {
    const { token } = useAuth();

    // Header Data
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const [customerName, setCustomerName] = useState('');
    const [customerRut, setCustomerRut] = useState('');

    // Items Data
    const [items, setItems] = useState<BoletaItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('efectivo');
    const [observations, setObservations] = useState('');

    // Search States per Line
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);

    // Fetch Companies (Clients)
    useEffect(() => {
        if (token) {
            CompanyService.getAllCompanies(1, 1000, { isClient: true })
                .then((res) => {
                    const list = Array.isArray(res) ? res : res?.data ?? [];
                    setCompanies(list);
                })
                .catch((err) => console.error('Error fetching customers:', err));
        }
    }, [token]);

    // Global Product Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length > 2 && token && activeSearchIndex !== null) {
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
    }, [searchTerm, token, activeSearchIndex]);

    const totals = useMemo(() => {
        const total = items.reduce((acc, item) => acc + item.total, 0);
        const net = Math.round(total / 1.19);
        const iva = total - net;
        return { net, iva, total };
    }, [items]);

    const addItem = () => {
        const newItem: BoletaItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: '',
            quantity: 1,
            unitPrice: 0,
            total: 0,
            isManual: true
        };
        setItems([...items, newItem]);
    };

    const handleProductSelect = (index: number, product: Product) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = {
                ...newItems[index],
                productId: product.id,
                name: product.name,
                sku: product.sku,
                unitPrice: product.price || 0,
                total: (product.price || 0) * (newItems[index].quantity || 1),
                isManual: false
            };
            return newItems;
        });
        setActiveSearchIndex(null);
        setSearchTerm('');
        setSearchResults([]);
    };

    const updateItem = (id: string, field: keyof BoletaItem, value: any) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'quantity' || field === 'unitPrice') {
                    updatedItem.total = (updatedItem.quantity || 0) * (updatedItem.unitPrice || 0);
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            toast.error('Debe agregar al menos un item a la boleta.');
            return;
        }
        onSave({
            selectedCompanyId,
            customerName,
            customerRut,
            items,
            totals,
            paymentMethod,
            observations
        });
    };

    return (
        <Card className="max-w-6xl mx-auto border-white/[0.05] bg-[#1a2537]/80 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-[3rem] overflow-hidden border" placeholder="" >
            {/* Facto-Style Premium Header */}
            <div className="p-10 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-br from-blue-600/10 via-transparent to-transparent relative">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <FileText className="w-9 h-9 text-white relative z-10" />
                    </div>
                    <div>
                        <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none text-3xl" placeholder="" >
                            Emisión <span className="text-blue-500">Boleta SII</span>
                        </Typography>
                        <div className="flex items-center gap-4 mt-2">
                            <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2" placeholder="" >
                                <TrendingUp className="w-4 h-4 text-blue-500/50" /> Documento Tributario Electrónico (DTE)
                            </Typography>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <div className="flex items-center gap-1.5 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Servicio Online</span>
                            </div>
                        </div>
                    </div>
                </div>
                <IconButton variant="text" color="white" onClick={onCancel} className="rounded-full bg-white/5 hover:bg-white/10 w-12 h-12" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                    <X className="w-7 h-7" />
                </IconButton>
            </div>

            <form onSubmit={handleSubmit} className="p-12 space-y-12">
                {/* Section: Origin/Entity */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-blue-500" />
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Identificación del Receptor <span className="text-slate-600 text-[10px] ml-2 font-bold italic lowercase">(opcional para ventas menores)</span>
                            </Typography>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05]">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cliente Registrado</label>
                                <Select
                                    label="Buscar Cliente..."
                                    value={selectedCompanyId}
                                    onChange={(val) => {
                                        setSelectedCompanyId(val || '');
                                        const company = companies.find(c => c.id === val);
                                        if (company) {
                                            setCustomerName(company.name);
                                            setCustomerRut(company.rut || '');
                                        }
                                    }}
                                    className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl h-12"
                                    labelProps={{ className: "hidden" }}
                                >
                                    {companies.map((company) => (
                                        <Option key={company.id} value={company.id} className="font-bold uppercase text-xs">
                                            {company.name} ({company.rut})
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">RUT Manual / Invitado</label>
                                <Input
                                    size="lg"
                                    placeholder="12.345.678-9"
                                    className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase"
                                    labelProps={{ className: "hidden" }}
                                    value={customerRut}
                                    onChange={(e) => setCustomerRut(e.target.value)}
                                     crossOrigin={undefined}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre / Razón Social Receptor</label>
                                <Input
                                    size="lg"
                                    placeholder="NOMBRE DEL COMPRADOR"
                                    className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase tracking-tight"
                                    labelProps={{ className: "hidden" }}
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                     crossOrigin={undefined}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-blue-500" />
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Condición de Pago
                            </Typography>
                        </div>
                        <div className="grid grid-cols-1 gap-3 h-full">
                            {['efectivo', 'transferencia', 'tarjeta'].map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setPaymentMethod(method)}
                                    className={cn(
                                        "w-full p-5 rounded-2xl border transition-all flex items-center justify-between group",
                                        paymentMethod === method
                                            ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20"
                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                    )}
                                >
                                    <span className={cn(
                                        "font-black uppercase tracking-widest text-[11px]",
                                        paymentMethod === method ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                                    )}>
                                        {method}
                                    </span>
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                        paymentMethod === method ? "border-white bg-white" : "border-white/20"
                                    )}>
                                        {paymentMethod === method && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Items Section: The "Glosa" Workflow */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Package className="w-5 h-5 text-blue-500" />
                            </div>
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Detalle de la Venta <span className="text-slate-600 text-[10px] ml-2 font-bold uppercase tracking-normal">({items.length} líneas)</span>
                            </Typography>
                        </div>
                        <Button
                            variant="gradient"
                            color="blue"
                            onClick={addItem}
                            className="flex items-center gap-3 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 py-3 shadow-lg shadow-blue-500/10"
                            placeholder="" 
                        >
                            <Plus className="w-4 h-4" /> Agregar Item
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-5 items-start bg-white/[0.03] p-6 rounded-[2rem] border border-white/[0.05] relative group animate-in slide-in-from-right-4 duration-500">
                                {/* Search & Glosa */}
                                <div className="col-span-12 lg:col-span-5 space-y-2 relative">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Glosa / Producto #{index + 1}</label>
                                    <div className="relative">
                                        <Input
                                            size="lg"
                                            placeholder="BUSCAR O ESCRIBIR MANUALMENTE..."
                                            className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase text-xs pr-10"
                                            labelProps={{ className: "hidden" }}
                                            value={activeSearchIndex === index ? searchTerm : item.name}
                                            onFocus={() => {
                                                setActiveSearchIndex(index);
                                                setSearchTerm(item.name);
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setSearchTerm(val);
                                                updateItem(item.id, 'name', val);
                                                updateItem(item.id, 'isManual', true);
                                            }}
                                             crossOrigin={undefined}
                                        />
                                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    </div>

                                    {/* Real-time Search Results */}
                                    {activeSearchIndex === index && searchResults.length > 0 && (
                                        <div className="absolute z-50 w-full bg-[#1A2235] border border-white/10 rounded-2xl shadow-2xl mt-2 overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200">
                                            {searchResults.map((product) => (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    className="w-full px-6 py-4 hover:bg-blue-600 transition-colors flex items-center justify-between text-left group/result"
                                                    onClick={() => handleProductSelect(index, product)}
                                                >
                                                    <div>
                                                        <Typography className="text-white font-black uppercase text-xs" placeholder="" >{product.name}</Typography>
                                                        <Typography className="text-[10px] text-slate-500 group-hover/result:text-blue-100 font-bold uppercase mt-0.5" placeholder="" >
                                                            SKU: {product.sku || 'N/A'} • STOCK: {product.totalStock || 0}
                                                        </Typography>
                                                    </div>
                                                    <Typography className="text-emerald-400 group-hover/result:text-white font-black italic" placeholder="" >
                                                        {formatCurrencyChilean(product.price || 0)}
                                                    </Typography>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* SKU (Indicator only) */}
                                <div className="col-span-4 lg:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">SKU</label>
                                    <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                                        <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-tighter" placeholder="" >
                                            {item.sku || 'MANUAL'}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Qty */}
                                <div className="col-span-3 lg:col-span-1 space-y-2">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 text-center block">Cant.</label>
                                    <Input
                                        size="lg"
                                        type="number"
                                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold text-center"
                                        labelProps={{ className: "hidden" }}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                         crossOrigin={undefined}
                                    />
                                </div>

                                {/* Unit Price */}
                                <div className="col-span-5 lg:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 text-right block">P. Unitario</label>
                                    <Input
                                        size="lg"
                                        type="number"
                                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-black text-right"
                                        labelProps={{ className: "hidden" }}
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                                         crossOrigin={undefined}
                                    />
                                </div>

                                {/* Row Total */}
                                <div className="col-span-10 lg:col-span-1 space-y-2 text-right">
                                    <label className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest mr-1 block">Total</label>
                                    <div className="h-12 flex items-center justify-end pr-2">
                                        <Typography className="text-sm font-black text-white italic" placeholder="" >
                                            {formatCurrencyChilean(item.total)}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="col-span-2 lg:col-span-1 flex justify-end items-center h-full pt-6">
                                    <IconButton variant="text" color="red" onClick={() => removeItem(item.id)} className="rounded-xl hover:bg-red-500/10" placeholder="" >
                                        <Trash2 className="w-5 h-5 text-red-500/40 group-hover:text-red-500 transition-colors" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}

                        {items.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                                <div className="w-20 h-20 rounded-full bg-slate-800/20 flex items-center justify-center mb-6">
                                    <PackageSearch className="w-10 h-10 text-slate-700" />
                                </div>
                                <Typography className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs" placeholder="" >
                                    El documento no tiene líneas de detalle
                                </Typography>
                                <Button
                                    variant="text"
                                    color="blue"
                                    onClick={addItem}
                                    className="mt-6 font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                                    placeholder="" 
                                >
                                    <Plus className="w-4 h-4 cursor-pointer" /> Agregar la primera línea
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/5">
                    {/* Observations */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Observaciones del Documento
                            </Typography>
                        </div>
                        <Textarea
                            rows={6}
                            placeholder="NOTAS INTERNAS O DETALLES ADICIONALES PARA EL RECEPTOR..."
                            className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-3xl p-6 font-bold text-sm tracking-tight"
                            labelProps={{ className: "hidden" }}
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            
                        />
                        <div className="flex items-center gap-3 bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                            <Info className="w-4 h-4 text-blue-500" />
                            <Typography className="text-[10px] text-slate-500 font-bold leading-relaxed" placeholder="" >
                                Estas notas serán visibles en el PDF generado por el SII y quedarán registradas en el historial de ventas del ERP.
                            </Typography>
                        </div>
                    </div>

                    {/* Totals Summary */}
                    <div className="lg:col-span-5">
                        <Card className="bg-[#0f172a]/90 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/[0.08] shadow-2xl space-y-6" placeholder="" >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center opacity-50">
                                    <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]" placeholder="" >Neto Imponible</Typography>
                                    <Typography className="text-lg font-bold text-white tracking-tight" placeholder="" >{formatCurrencyChilean(totals.net)}</Typography>
                                </div>
                                <div className="flex justify-between items-center opacity-50">
                                    <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]" placeholder="" >IVA (19%)</Typography>
                                    <Typography className="text-lg font-bold text-white tracking-tight" placeholder="" >{formatCurrencyChilean(totals.iva)}</Typography>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <div className="flex justify-between items-center bg-blue-600/10 p-6 rounded-2xl border border-blue-600/20">
                                    <div className="flex flex-col">
                                        <Typography className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1" placeholder="" >Total Bruto</Typography>
                                        <Typography className="text-[9px] text-slate-500 font-black uppercase tracking-widest" placeholder="" >Moneda Nacional (CLP)</Typography>
                                    </div>
                                    <Typography variant="h2" color="white" className="font-black italic text-5xl tracking-tighter" placeholder="" >
                                        {formatCurrencyChilean(totals.total)}
                                    </Typography>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                color="blue"
                                fullWidth
                                size="lg"
                                className="flex items-center justify-center gap-4 rounded-3xl font-black uppercase tracking-[0.2em] text-sm py-6 shadow-2xl shadow-blue-500/40 relative group overflow-hidden"
                                placeholder="" 
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <Save className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Validar y Emitir Boleta</span>
                            </Button>

                            <Button
                                variant="text"
                                color="white"
                                fullWidth
                                onClick={onCancel}
                                className="rounded-2xl font-black uppercase tracking-widest text-[10px] py-4 opacity-40 hover:opacity-100 transition-opacity"
                                placeholder="" 
                            >
                                Descartar documento
                            </Button>
                        </Card>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default BoletaForm;
