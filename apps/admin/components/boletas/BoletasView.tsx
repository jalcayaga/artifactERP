'use client';

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    FileText,
    Download,
    Calendar,
    User,
    Hash,
    ChevronRight,
    Printer,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle
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
import { formatCurrencyChilean, formatDate } from '@artifact/core';

import BoletaForm from './BoletaForm';
import DocumentPreview from '../common/DocumentPreview';

// Mock data based on Facto's screenshots
const MOCK_BOLETAS = [
    { id: 1, folio: 117, date: '2023-12-12', receiver: 'Junta de Vecinos Berlin', rut: '65.568.320-8', net: 2040920, iva: 387775, total: 2428695, status: 'emitted' },
    { id: 2, folio: 118, date: '2023-12-14', receiver: 'JJVV Lo Bermudez', rut: '65.061.600-6', net: 2100000, iva: 399000, total: 2499000, status: 'emitted' },
];

const BoletasView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<any>(null);

    if (showForm) {
        return (
            <div className="animate-in fade-in zoom-in-95 duration-500">
                <BoletaForm
                    onCancel={() => setShowForm(false)}
                    onSave={(data) => {
                        console.log('Emitiendo boleta:', data);
                        setShowForm(false);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none" >
                        Gestión de <span className="text-blue-500">Boletas</span>
                    </Typography>
                    <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2" >
                        <FileText className="w-4 h-4 text-blue-500/50" /> Emisión y control de documentos tributarios
                    </Typography>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex flex-col items-end px-4 border-r border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <Typography variant="small" className="text-white font-black italic" >
                                450 Folios
                            </Typography>
                        </div>
                        <Typography variant="small" className="text-[10px] text-slate-500 font-bold uppercase tracking-widest" >
                            Disponibles Clase 39
                        </Typography>
                    </div>

                    <Button
                        variant="gradient"
                        color="blue"
                        size="lg"
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs group"
                         onResize={undefined} onResizeCapture={undefined}
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Nueva Boleta
                    </Button>
                </div>
            </div>

            {/* Glass Search & Filter Bar */}
            <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-2 rounded-[2rem] shadow-2xl" >
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <div className="relative w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="BUSCAR POR FOLIO, RUT O CLIENTE..."
                            className="w-full bg-white/[0.03] border-0 rounded-[1.5rem] py-5 px-14 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-widest shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 px-2">
                        <Button
                            variant="text"
                            color="white"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-3 rounded-2xl font-black px-6 py-4 uppercase tracking-widest text-xs transition-all ${showFilters ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
                             onResize={undefined} onResizeCapture={undefined}
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                        </Button>
                    </div>
                </div>

                {/* Expanded Filters - Facto Style but Glassmorphic */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 mt-2 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rango de Fecha</label>
                            <div className="flex items-center gap-2">
                                <Input size="md" type="date" className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl" labelProps={{ className: "hidden" }}  crossOrigin={undefined} containerProps={{ className: "min-w-[100px]" }} />
                                <span className="text-slate-600">-</span>
                                <Input size="md" type="date" className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl" labelProps={{ className: "hidden" }}  crossOrigin={undefined} containerProps={{ className: "min-w-[100px]" }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RUT Receptor</label>
                            <Input size="md" placeholder="12.345.678-9" className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold" labelProps={{ className: "hidden" }}  crossOrigin={undefined} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado SII</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-slate-300 text-sm font-bold focus:border-blue-500 outline-none">
                                <option value="all" className="bg-[#1a2537]">TODOS LOS ESTADOS</option>
                                <option value="emitted" className="bg-[#1a2537]">ACEPTADO POR SII</option>
                                <option value="pending" className="bg-[#1a2537]">PENDIENTE DE ENVÍO</option>
                                <option value="rejected" className="bg-[#1a2537]">RECHAZADO</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button color="blue" fullWidth className="rounded-xl font-black uppercase tracking-widest py-3 shadow-lg shadow-blue-500/20"  onResize={undefined} onResizeCapture={undefined}>
                                Aplicar Búsqueda
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Main Data Table */}
            <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl" >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Folio</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Fecha</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Receptor</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Monto Neto</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">IVA</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Total</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Estado</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {MOCK_BOLETAS.map((boleta) => (
                                <tr key={boleta.id} className="group hover:bg-white/[0.03] cursor-pointer transition-all duration-300">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 transition-colors shadow-inner">
                                                <Hash className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <span className="text-white font-black italic">{boleta.folio}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-300 whitespace-nowrap">{formatDate(boleta.date)}</span>
                                            <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-0.5">Emisión DTE</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col min-w-[180px]">
                                            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight italic line-clamp-1">{boleta.receiver}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <User className="w-3 h-3 text-slate-600" />
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">{boleta.rut}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="text-sm font-bold text-slate-400">{formatCurrencyChilean(boleta.net)}</span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="text-sm font-bold text-slate-500">{formatCurrencyChilean(boleta.iva)}</span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="text-md font-black italic text-white">{formatCurrencyChilean(boleta.total)}</span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-center">
                                            <Chip
                                                value="Aceptado SII"
                                                size="sm"
                                                className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg px-2"
                                                icon={<CheckCircle2 className="h-3 w-3" />}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <IconButton
                                                variant="text"
                                                color="blue"
                                                onClick={() => setPreviewDoc({ ...boleta, type: 'boleta', items: [{ name: 'Venta de productos/servicios', quantity: 1, total: boleta.total, net: boleta.net, iva: boleta.iva, unitPrice: boleta.total }], totals: { net: boleta.net, iva: boleta.iva, total: boleta.total } })}
                                                className="rounded-xl bg-blue-500/5 hover:bg-blue-500/15"
                                                 onResize={undefined} onResizeCapture={undefined}
                                            >
                                                <Printer className="w-4 h-4" />
                                            </IconButton>
                                            <IconButton variant="text" color="white" className="rounded-xl bg-white/5 hover:bg-white/10"  onResize={undefined} onResizeCapture={undefined}>
                                                <Download className="w-4 h-4 text-slate-400" />
                                            </IconButton>
                                            <IconButton variant="text" color="white" className="rounded-xl bg-white/5 hover:bg-white/10"  onResize={undefined} onResizeCapture={undefined}>
                                                <MoreVertical className="w-4 h-4 text-slate-500" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Facto-style Pagination but Premium */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-widest text-[10px]" >
                        Mostrando 1-2 de 48 documentos totales
                    </Typography>
                    <div className="flex items-center gap-2">
                        <Button variant="text" size="sm" color="white" className="rounded-xl text-[10px] font-black px-4 bg-white/5"  onResize={undefined} onResizeCapture={undefined}>Anterior</Button>
                        <div className="flex items-center gap-1">
                            <IconButton size="sm" variant="gradient" color="blue" className="rounded-xl text-[10px] font-bold shadow-blue-500/20 shadow-lg"  onResize={undefined} onResizeCapture={undefined}>1</IconButton>
                            <IconButton size="sm" variant="text" color="white" className="rounded-xl text-[10px] font-bold bg-white/5 hover:bg-white/10 text-slate-400"  onResize={undefined} onResizeCapture={undefined}>2</IconButton>
                        </div>
                        <Button variant="text" size="sm" color="white" className="rounded-xl text-[10px] font-black px-4 bg-white/5"  onResize={undefined} onResizeCapture={undefined}>Siguiente</Button>
                    </div>
                </div>
            </Card>

            {previewDoc && (
                <DocumentPreview
                    isOpen={!!previewDoc}
                    onClose={() => setPreviewDoc(null)}
                    document={previewDoc}
                />
            )}
        </div>
    );
};

export default BoletasView;
