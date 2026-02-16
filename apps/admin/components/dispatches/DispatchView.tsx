'use client';

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    Truck,
    MapPin,
    Calendar,
    User,
    Hash,
    ChevronRight,
    Printer,
    MoreVertical,
    CheckCircle2,
    Package,
    ArrowRight
} from 'lucide-react';
import {
    Card,
    Typography,
    Button,
    IconButton,
    Input,
    Chip,
} from "@material-tailwind/react";
import { formatDate } from '@artifact/core';
import DocumentPreview from '../common/DocumentPreview';

// Mock data for Guías de Despacho
const MOCK_DISPATCHES = [
    { id: 1, folio: 4501, date: '2023-12-10', receiver: 'Constructora Maipo', rut: '76.123.456-k', items: 15, origin: 'Bodega Central', destination: 'Obra San Bernardo', status: 'delivered' },
    { id: 2, folio: 4502, date: '2023-12-15', receiver: 'Transportes TransLog', rut: '77.987.654-3', items: 8, origin: 'Bodega Norte', destination: 'Cliente Final - Las Condes', status: 'on_way' },
];

const DispatchView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<any>(null);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none" >
                        Guías de <span className="text-blue-500">Despacho</span>
                    </Typography>
                    <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2" >
                        <Truck className="w-4 h-4 text-blue-500/50" /> Control logístico y traslado de mercaderías
                    </Typography>
                </div>

                <Button
                    variant="gradient"
                    color="blue"
                    size="lg"
                    className="flex items-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs group"
                     onResize={undefined} onResizeCapture={undefined}
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Nueva Guía
                </Button>
            </div>

            {/* Glass Search & Filter Bar */}
            <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-2 rounded-[2rem] shadow-2xl" >
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <div className="relative w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="BUSCAR POR FOLIO, DESTINO O RECEPTOR..."
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
                            className={`flex items-center gap-3 rounded-2xl font-black px-6 py-4 uppercase tracking-widest text-xs transition-all ${showFilters ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
                             onResize={undefined} onResizeCapture={undefined}
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Info Cards Grid (Facto-like overview but modern) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'En Tránsito', count: 12, icon: Truck, color: 'blue' },
                    { label: 'Entregadas Hoy', count: 45, icon: CheckCircle2, color: 'emerald' },
                    { label: 'Pendientes', count: 5, icon: Package, color: 'orange' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-6 rounded-3xl" >
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1" >{stat.label}</Typography>
                                <Typography variant="h3" color="white" className="font-black italic" >{stat.count}</Typography>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center border border-${stat.color}-500/20`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Data Table */}
            <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl" >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Folio</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Fecha / Cliente</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ruta de Entrega</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Items</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Estado</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {MOCK_DISPATCHES.map((dispatch) => (
                                <tr key={dispatch.id} className="group hover:bg-white/[0.03] cursor-pointer transition-all duration-300">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 transition-colors shadow-inner">
                                                <Hash className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <span className="text-white font-black italic">{dispatch.folio}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white uppercase italic tracking-tight">{dispatch.receiver}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="w-3 h-3 text-slate-600" />
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">{formatDate(dispatch.date)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3 bg-white/5 py-2 px-4 rounded-xl border border-white/5 w-fit">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Origen</span>
                                                <span className="text-[11px] font-bold text-slate-300">{dispatch.origin}</span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-blue-500/50" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Destino</span>
                                                <span className="text-[11px] font-bold text-blue-400">{dispatch.destination}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-black text-white">{dispatch.items}</span>
                                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Unidades</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-center">
                                            <Chip
                                                value={dispatch.status === 'delivered' ? 'Entregada' : 'En Tránsito'}
                                                size="sm"
                                                className={`${dispatch.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'} text-[9px] font-black uppercase tracking-widest rounded-lg px-2 border`}
                                                
                                            />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <IconButton
                                                variant="text"
                                                color="blue"
                                                onClick={() => setPreviewDoc({ ...dispatch, type: 'guia', items: [{ name: `Traslado de mercaderías (${dispatch.items} unidades)`, quantity: dispatch.items, total: 0, unitPrice: 0 }], totals: { net: 0, iva: 0, total: 0 } })}
                                                className="rounded-xl bg-blue-500/5 hover:bg-blue-500/15"
                                                 onResize={undefined} onResizeCapture={undefined}
                                            >
                                                <Printer className="w-4 h-4" />
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

export default DispatchView;
