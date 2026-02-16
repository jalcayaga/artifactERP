'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    FileText,
    Plus,
    Trash2,
    Search,
    Package,
    Building2,
    Calendar,
    Save,
    X,
    Info,
    ChevronDown,
    ShieldCheck,
    Briefcase,
    Zap
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
    Menu,
    MenuHandler,
    MenuList,
    MenuItem
} from "@material-tailwind/react";
import {
    Product,
    Company,
    formatCurrencyChilean,
    cn
} from '@artifact/core';
import {
    ProductService,
    CompanyService,
    useAuth
} from '@artifact/core/client';
import { toast } from 'sonner';

interface DirectInvoiceFormProps {
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
}

const DTE_TYPES = [
    { id: '33', name: 'Factura Electrónica', color: 'blue' },
    { id: '34', name: 'Factura Exenta', color: 'purple' },
    { id: '39', name: 'Boleta Electrónica', color: 'emerald' },
    { id: '41', name: 'Boleta Exenta', color: 'teal' },
    { id: '52', name: 'Guía de Despacho', color: 'amber' },
    { id: '61', name: 'Nota de Crédito', color: 'red' },
    { id: '56', name: 'Nota de Débito', color: 'pink' }
];

const FIXED_VAT_RATE_PERCENT = 19;

const DirectInvoiceForm = ({ onSave, onCancel }: DirectInvoiceFormProps) => {
    const { token } = useAuth();

    // Header State
    const [dteType, setDteType] = useState(DTE_TYPES[0]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
    const [isExport, setIsExport] = useState(false);

    // Items State
    const [items, setItems] = useState<any[]>([
        { id: Math.random().toString(36).substr(2, 9), name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);

    // Totals Processing
    const totals = useMemo(() => {
        const net = items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice) || 0), 0);
        const vat = dteType.id === '33' || dteType.id === '39' || dteType.id === '61' ? Math.round(net * (FIXED_VAT_RATE_PERCENT / 100)) : 0;
        return {
            net,
            vat,
            total: net + vat
        };
    }, [items, dteType]);

    // Side Effects
    useEffect(() => {
        if (token) {
            CompanyService.getAllCompanies(1, 1000)
                .then(res => setCompanies(Array.isArray(res) ? res : res?.data ?? []))
                .catch(err => console.error(err));
        }
    }, [token]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (token && activeSearchIndex !== null && searchTerm.length > 2) {
                ProductService.searchProducts(token, searchTerm)
                    .then(res => setSearchResults(Array.isArray(res) ? res : res?.data ?? []))
                    .catch(err => console.error(err));
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, token, activeSearchIndex]);

    // Handlers
    const addItem = () => {
        setItems([...items, { id: Math.random().toString(36).substr(2, 9), name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].totalPrice = (parseFloat(newItems[index].quantity) || 0) * (parseFloat(newItems[index].unitPrice) || 0);
        }
        setItems(newItems);
    };

    const selectProduct = (index: number, product: Product) => {
        updateItem(index, 'name', product.name);
        updateItem(index, 'unitPrice', product.price || 0);
        setActiveSearchIndex(null);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompany) return toast.error('Debe seleccionar un receptor.');

        const payload = {
            dteType: dteType.id,
            companyId: selectedCompany.id,
            date: documentDate,
            items: items.map(i => ({
                name: i.name,
                quantity: parseFloat(i.quantity),
                unitPrice: parseFloat(i.unitPrice),
                total: i.totalPrice
            })),
            ...totals
        };

        await onSave(payload);
    };

    return (
        <Card className="max-w-6xl mx-auto border-white/[0.05] bg-[#1a2537]/80 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-[3rem] overflow-hidden border" placeholder="" >
            {/* Header: DTE Selection */}
            <div className="p-10 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-br from-blue-600/10 via-transparent to-transparent">
                <div className="flex items-center gap-6">
                    <Menu placement="bottom-start">
                        <MenuHandler>
                            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 cursor-pointer hover:scale-105 transition-transform active:scale-95">
                                <FileText className="w-9 h-9 text-white" />
                            </div>
                        </MenuHandler>
                        <MenuList className="bg-[#1A2235] border-white/10 rounded-2xl p-2 shadow-3xl min-w-[240px]">
                            {DTE_TYPES.map(type => (
                                <MenuItem
                                    key={type.id}
                                    onClick={() => setDteType(type)}
                                    className="flex items-center justify-between font-black uppercase tracking-widest text-[10px] py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
                                >
                                    {type.name}
                                    <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded-md text-slate-500">{type.id}</span>
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none text-3xl" placeholder="" >
                                Emisión de <span className="text-blue-500">{dteType.name}</span>
                            </Typography>
                        </div>
                        <div className="flex items-center gap-4">
                            <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2" placeholder="" >
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Certificación SII Activa
                            </Typography>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <div className="flex items-center gap-1.5 text-blue-400">
                                <Zap className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Flujo Inmediato</span>
                            </div>
                        </div>
                    </div>
                </div>
                <IconButton variant="text" color="white" onClick={onCancel} className="rounded-full bg-white/5 hover:bg-white/10 w-12 h-12" placeholder="" >
                    <X className="w-7 h-7" />
                </IconButton>
            </div>

            <form onSubmit={handleSubmit} className="p-12 space-y-12">
                {/* Section 1: Entity & Logistics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-blue-500" />
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Identificación del Receptor
                            </Typography>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05]">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Razón Social / Receptor</label>
                                <Select
                                    label="Buscar Entidad..."
                                    value={selectedCompany?.id}
                                    onChange={(val) => {
                                        const company = companies.find(c => c.id === val);
                                        if (company) setSelectedCompany(company);
                                    }}
                                    className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl h-12"
                                    labelProps={{ className: "hidden" }}
                                >
                                    {companies.map((c) => (
                                        <Option key={c.id} value={c.id} className="font-bold uppercase text-xs">
                                            {c.name} ({c.rut})
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">RUT</label>
                                <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                                    <Typography className="text-white font-black uppercase text-xs tracking-widest" placeholder="" >
                                        {selectedCompany?.rut || '---'}
                                    </Typography>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Giro</label>
                                <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 overflow-hidden">
                                    <Typography className="text-white font-black uppercase text-[10px] tracking-tight truncate" placeholder="" >
                                        {selectedCompany?.giro || 'NO ESPECIFICADO'}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Información Documento
                            </Typography>
                        </div>
                        <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05] space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha Contable</label>
                                <Input
                                    type="date"
                                    className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase tracking-widest text-xs h-12"
                                    labelProps={{ className: "hidden" }}
                                    value={documentDate}
                                    onChange={(e) => setDocumentDate(e.target.value)}
                                     crossOrigin={undefined}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Operación</label>
                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
                                    <Button
                                        onClick={() => setIsExport(false)}
                                        className={cn("flex-1 py-2 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all", !isExport ? "bg-blue-600 text-white" : "bg-transparent text-slate-500 hover:text-white")}
                                        placeholder="" 
                                    >Nacional</Button>
                                    <Button
                                        onClick={() => setIsExport(true)}
                                        className={cn("flex-1 py-2 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all", isExport ? "bg-blue-600 text-white" : "bg-transparent text-slate-500 hover:text-white")}
                                        placeholder="" 
                                    >Exportación</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Items / Glosas */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Package className="w-5 h-5 text-blue-500" />
                            </div>
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Detalle de Líneas de Facturación <span className="text-slate-600 text-[10px] ml-2 font-bold uppercase tracking-normal">({items.length} glosas)</span>
                            </Typography>
                        </div>
                        <Button
                            variant="gradient"
                            color="blue"
                            onClick={addItem}
                            className="flex items-center gap-3 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 py-3 shadow-lg shadow-blue-500/10"
                            placeholder="" 
                        >
                            <Plus className="w-4 h-4" /> Nueva Glosa
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-5 items-start bg-white/[0.03] p-6 rounded-[2rem] border border-white/[0.05] relative group animate-in slide-in-from-right-4 duration-500">
                                <div className="col-span-12 lg:col-span-6 space-y-2 relative">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Descripción de la Glosa</label>
                                    <div className="relative">
                                        <Input
                                            size="lg"
                                            placeholder="BUSCAR O ESCRIBIR..."
                                            className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase text-xs pr-10"
                                            labelProps={{ className: "hidden" }}
                                            value={activeSearchIndex === index ? searchTerm : item.name}
                                            onFocus={() => {
                                                setActiveSearchIndex(index);
                                                setSearchTerm(item.name);
                                            }}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                updateItem(index, 'name', e.target.value);
                                            }}
                                             crossOrigin={undefined}
                                        />
                                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    </div>

                                    {/* Search Results */}
                                    {activeSearchIndex === index && searchResults.length > 0 && (
                                        <div className="absolute z-50 w-full bg-[#1A2235] border border-white/10 rounded-2xl shadow-2xl mt-2 overflow-hidden backdrop-blur-3xl">
                                            {searchResults.map((product) => (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    className="w-full px-5 py-4 hover:bg-blue-600 transition-colors flex items-center justify-between text-left group/res"
                                                    onClick={() => selectProduct(index, product)}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-black uppercase text-[11px]">{product.name}</span>
                                                        <span className="text-[9px] text-slate-500 group-hover/res:text-blue-100 uppercase tracking-widest mt-0.5">SKU: {product.sku || 'S/N'}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="bg-blue-500/10 text-blue-400 group-hover/res:bg-white/20 group-hover/res:text-white px-2 py-0.5 rounded-md text-[9px] font-black">
                                                            {formatCurrencyChilean(product.price || 0)}
                                                        </span>
                                                        <span className="text-[8px] text-slate-600 group-hover/res:text-blue-200 uppercase mt-0.5 font-bold">Stock: {product.stock || 0}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-6 lg:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Cant.</label>
                                    <Input
                                        type="number"
                                        size="lg"
                                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold text-center"
                                        labelProps={{ className: "hidden" }}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                         crossOrigin={undefined}
                                    />
                                </div>

                                <div className="col-span-6 lg:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Precio Neto</label>
                                    <Input
                                        type="number"
                                        size="lg"
                                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-black text-right pr-4"
                                        labelProps={{ className: "hidden" }}
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                                         crossOrigin={undefined}
                                    />
                                </div>

                                <div className="col-span-10 lg:col-span-1 pt-8 flex items-center justify-end px-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black text-slate-600 uppercase mb-1">Total</span>
                                        <Typography className="text-sm font-black text-white italic" placeholder="" >
                                            {formatCurrencyChilean(item.totalPrice)}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="col-span-2 lg:col-span-1 pt-8 flex justify-center">
                                    <IconButton
                                        variant="text"
                                        color="red"
                                        onClick={() => removeItem(item.id)}
                                        className="rounded-xl hover:bg-red-500/10 opacity-40 group-hover:opacity-100 transition-opacity"
                                        placeholder="" 
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Section: Notes & Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/5">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-blue-500" />
                            <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                                Observaciones del Documento
                            </Typography>
                        </div>
                        <Textarea
                            rows={5}
                            placeholder="MENCIONES LEGALES, OC CLIENTE, O CUALQUIER INFORMACIÓN QUE DEBA APARECER EN EL PDF..."
                            className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-3xl p-6 font-bold text-sm tracking-tight"
                            labelProps={{ className: "hidden" }}
                            
                        />
                    </div>

                    <div className="lg:col-span-5">
                        <Card className="bg-[#0f172a]/90 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/[0.08] shadow-2xl space-y-6" placeholder="" >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center opacity-50">
                                    <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]" placeholder="" >Suma Neta</Typography>
                                    <Typography className="text-lg font-bold text-white tracking-tight" placeholder="" >{formatCurrencyChilean(totals.net)}</Typography>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]" placeholder="" >IVA ({FIXED_VAT_RATE_PERCENT}%)</Typography>
                                    <Typography className="text-lg font-bold text-white tracking-tight" placeholder="" >{formatCurrencyChilean(totals.vat)}</Typography>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <div className="flex justify-between items-center bg-blue-600/10 p-6 rounded-2xl border border-blue-600/20 shadow-inner">
                                    <div className="flex flex-col">
                                        <Typography className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1" placeholder="" >Total Documento</Typography>
                                        <Typography className="text-[10px] text-slate-500 font-black uppercase tracking-widest" placeholder="" >CLP / Moneda Nacional</Typography>
                                    </div>
                                    <Typography variant="h2" color="white" className="font-black italic text-4xl tracking-tighter" placeholder="" >
                                        {formatCurrencyChilean(totals.total)}
                                    </Typography>
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                variant="gradient"
                                color="blue"
                                fullWidth
                                size="lg"
                                className="flex items-center justify-center gap-4 rounded-3xl font-black uppercase tracking-[0.2em] text-sm py-6 shadow-2xl shadow-blue-500/40 relative group overflow-hidden"
                                placeholder="" 
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <Save className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Transmitir al SII</span>
                            </Button>

                            <Button
                                variant="text"
                                color="white"
                                fullWidth
                                onClick={onCancel}
                                className="rounded-2xl font-black uppercase tracking-widest text-[10px] py-4 opacity-40 hover:opacity-100 transition-opacity"
                                placeholder="" 
                            >
                                Descartar y Volver
                            </Button>
                        </Card>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default DirectInvoiceForm;
