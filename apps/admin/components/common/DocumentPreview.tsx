'use client';

import React from 'react';
import {
    X,
    Download,
    Printer,
    Share2,
    FileText
} from 'lucide-react';
import {
    Card,
    Typography,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { formatCurrencyChilean, formatDate } from '@artifact/core';

interface DocumentPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    document: {
        type: 'boleta' | 'guia' | 'factura';
        folio: number;
        date: string;
        receiver: string;
        rut: string;
        items: any[];
        totals: {
            net: number;
            iva: number;
            total: number;
        };
        origin?: string;
        destination?: string;
    };
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ isOpen, onClose, document }) => {
    if (!isOpen) return null;

    const docTypeLabel = {
        boleta: 'BOLETA ELECTRÓNICA',
        guia: 'GUÍA DE DESPACHO ELECTRÓNICA',
        factura: 'FACTURA ELECTRÓNICA'
    }[document.type];

    const stampColor = {
        boleta: 'border-red-600 text-red-600',
        guia: 'border-blue-600 text-blue-600',
        factura: 'border-red-600 text-red-600'
    }[document.type];

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col gap-4">
                {/* Actions Bar */}
                <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <Typography color="white" className="font-black uppercase tracking-widest text-xs" >
                                Vista Previa de Documento
                            </Typography>
                            <Typography variant="small" className="text-slate-500 font-bold" >
                                Folio #{document.folio}
                            </Typography>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="text" color="white" className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 uppercase font-black text-[10px]"  onResize={undefined} onResizeCapture={undefined}>
                            <Printer className="w-4 h-4" /> Imprimir
                        </Button>
                        <Button variant="text" color="white" className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 uppercase font-black text-[10px]"  onResize={undefined} onResizeCapture={undefined}>
                            <Download className="w-4 h-4" /> PDF
                        </Button>
                        <IconButton variant="text" color="white" onClick={onClose} className="rounded-xl hover:bg-red-500/10"  onResize={undefined} onResizeCapture={undefined}>
                            <X className="w-5 h-5" />
                        </IconButton>
                    </div>
                </div>

                {/* Paper Container */}
                <div className="flex-1 overflow-y-auto bg-slate-100 rounded-[2rem] p-8 md:p-12 shadow-2xl relative">
                    <div className="max-w-[800px] mx-auto bg-white shadow-xl min-h-[1056px] p-12 flex flex-col text-slate-900 border border-slate-200">
                        {/* DTE Header */}
                        <div className="flex justify-between items-start mb-16">
                            <div className="space-y-4">
                                <div className="w-24 h-12 bg-slate-200 rounded flex items-center justify-center font-black italic text-slate-400 uppercase">Artifact</div>
                                <div className="space-y-1">
                                    <Typography className="font-black text-xl uppercase leading-none" >Artifact ERP SpA</Typography>
                                    <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-widest" >Software de Gestión Empresarial</Typography>
                                    <Typography className="text-xs font-medium text-slate-600" >Avenida Providencia 1234, Oficina 501</Typography>
                                    <Typography className="text-xs font-medium text-slate-600" >Santiago, Chile</Typography>
                                </div>
                            </div>

                            {/* Red/Blue SII Stamp */}
                            <div className={`border-4 ${stampColor} p-4 rounded-xl text-center min-w-[250px] space-y-2`}>
                                <Typography className="font-black text-lg" >R.U.T.: 76.543.210-k</Typography>
                                <div className={`border-t-4 ${stampColor} pt-2`}>
                                    <Typography className="font-black text-base leading-tight uppercase" >
                                        {docTypeLabel}
                                    </Typography>
                                </div>
                                <div className={`border-t-4 ${stampColor} pt-2`}>
                                    <Typography className="font-black text-xl" >Nº {document.folio}</Typography>
                                </div>
                                <div className={`border-t-4 ${stampColor} pt-2`}>
                                    <Typography className="font-black text-[10px]" >S.I.I. - {document.type === 'boleta' ? 'SANTIAGO ORIENTE' : 'SANTIAGO SUR'}</Typography>
                                </div>
                            </div>
                        </div>

                        {/* Document Info */}
                        <div className="grid grid-cols-2 gap-4 mb-12 border-t-2 border-slate-900 pt-8">
                            <div className="space-y-4">
                                <div>
                                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest" >Señor(es):</Typography>
                                    <Typography className="font-bold text-slate-900 uppercase" >{document.receiver}</Typography>
                                </div>
                                <div>
                                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest" >R.U.T.:</Typography>
                                    <Typography className="font-bold text-slate-900" >{document.rut || '66.666.666-6'}</Typography>
                                </div>
                            </div>
                            <div className="space-y-4 text-right">
                                <div>
                                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest" >Fecha Emisión:</Typography>
                                    <Typography className="font-bold text-slate-900" >{formatDate(document.date)}</Typography>
                                </div>
                                {document.destination && (
                                    <div>
                                        <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest" >Dirección Destino:</Typography>
                                        <Typography className="font-bold text-slate-900 uppercase" >{document.destination}</Typography>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-y-2 border-slate-900">
                                        <th className="py-2 text-[10px] font-black uppercase tracking-widest">Descripción</th>
                                        <th className="py-2 text-[10px] font-black uppercase tracking-widest text-center">Cant.</th>
                                        <th className="py-2 text-[10px] font-black uppercase tracking-widest text-right">Precio Un.</th>
                                        <th className="py-2 text-[10px] font-black uppercase tracking-widest text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {document.items?.map((item, i) => (
                                        <tr key={i}>
                                            <td className="py-4">
                                                <Typography className="font-bold text-slate-900 text-sm uppercase" >{item.name || item.description || 'Producto'}</Typography>
                                            </td>
                                            <td className="py-4 text-center">
                                                <Typography className="text-slate-600 text-sm font-medium" >{item.quantity}</Typography>
                                            </td>
                                            <td className="py-4 text-right">
                                                <Typography className="text-slate-600 text-sm font-medium" >{formatCurrencyChilean(item.unitPrice || item.price || 0)}</Typography>
                                            </td>
                                            <td className="py-4 text-right">
                                                <Typography className="text-slate-900 text-sm font-bold" >{formatCurrencyChilean(item.total)}</Typography>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end pt-8 border-t-2 border-slate-900 mt-auto">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between items-center text-slate-500">
                                    <Typography className="text-[10px] font-black uppercase tracking-widest" >Monto Neto:</Typography>
                                    <Typography className="font-bold text-sm" >{formatCurrencyChilean(document.totals.net)}</Typography>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <Typography className="text-[10px] font-black uppercase tracking-widest" >I.V.A. 19%:</Typography>
                                    <Typography className="font-bold text-sm" >{formatCurrencyChilean(document.totals.iva)}</Typography>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                    <Typography className="text-xs font-black uppercase tracking-[0.2em]" >Total:</Typography>
                                    <Typography variant="h5" className="font-black text-slate-900" >{formatCurrencyChilean(document.totals.total)}</Typography>
                                </div>
                            </div>
                        </div>

                        {/* SII Timbre (Mock) */}
                        <div className="mt-12 flex flex-col items-center gap-2 opacity-50 grayscale hover:opacity-100 transition-opacity">
                            <div className="w-48 h-16 border-2 border-slate-400 flex items-center justify-center font-black text-[10px] text-slate-400 tracking-[0.3em] uppercase">
                                <div className="text-center">
                                    TIMBRE ELECTRÓNICO SII<br />Verifique documento en www.sii.cl
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentPreview;
