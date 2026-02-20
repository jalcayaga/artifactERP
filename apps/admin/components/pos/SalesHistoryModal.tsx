import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
    IconButton
} from "@material-tailwind/react";
import { XMarkIcon, PrinterIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Order, OrderStatus, formatCurrencyChilean, formatDate } from '@artifact/core';
import { offlineStore, OfflineSale } from '@/lib/offline-store';
import { usePos } from '@/context/PosContext';
import { toast } from 'sonner';

interface SalesHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReprint: (order: Order) => void;
}

export function SalesHistoryModal({ isOpen, onClose, onReprint }: SalesHistoryModalProps) {
    const { shift } = usePos();
    const [offlineSales, setOfflineSales] = useState<OfflineSale[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadOfflineSales();
        }
    }, [isOpen]);

    const loadOfflineSales = async () => {
        setIsLoading(true);
        try {
            const sales = await offlineStore.getPendingSales();
            setOfflineSales(sales);
        } catch (error) {
            console.error("Error loading offline sales", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Combine online shift orders with offline pending sales
    const allSales = [
        ...(shift?.orders || []),
        ...offlineSales.map(s => ({
            ...s,
            id: s.tempId, // Treat tempId as ID for display
            status: 'PENDING_SYNC' as OrderStatus,
            createdAt: new Date(s.createdAt),
            isOffline: true
        }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <Dialog open={isOpen} handler={onClose} size="lg" className="bg-[#0f172a] text-white">
            <DialogHeader className="flex justifies-between items-center border-b border-white/10">
                <div className="flex-1 flex items-center gap-2">
                    <Typography variant="h5" color="white">
                        Historial de Ventas (Turno Actual)
                    </Typography>
                    <IconButton size="sm" variant="text" color="white" onClick={loadOfflineSales} disabled={isLoading}>
                        <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </IconButton>
                </div>
                <IconButton variant="text" color="white" onClick={onClose}>
                    <XMarkIcon className="h-6 w-6" />
                </IconButton>
            </DialogHeader>
            <DialogBody className="h-[60vh] overflow-y-auto p-0">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 sticky top-0">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase">Hora</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase">ID / Folio</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">Total</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Estado</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {allSales.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                                    No hay ventas registradas en este turno.
                                </td>
                            </tr>
                        ) : (
                            allSales.map((sale: any) => (
                                <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-sm text-slate-300 font-mono">
                                        {formatDate(sale.createdAt).split(' ')[1]}
                                    </td>
                                    <td className="p-4 text-sm text-white font-bold">
                                        {sale.isOffline ? (
                                            <span className="text-orange-400">OFF-{sale.id.slice(0, 8)}</span>
                                        ) : (
                                            `#${sale.id.slice(-6).toUpperCase()}`
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-white font-mono text-right">
                                        {formatCurrencyChilean(sale.grandTotalAmount)}
                                    </td>
                                    <td className="p-4 text-center">
                                        {sale.isOffline ? (
                                            <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-1 rounded font-bold uppercase">
                                                Pendiente
                                            </span>
                                        ) : (
                                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded font-bold uppercase">
                                                Sincronizado
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <IconButton
                                            variant="text"
                                            color="blue"
                                            size="sm"
                                            onClick={() => onReprint(sale)}
                                            title="Re-imprimir Ticket"
                                        >
                                            <PrinterIcon className="h-4 w-4" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </DialogBody>
            <DialogFooter className="border-t border-white/10">
                <Button variant="text" color="white" onClick={onClose} className="mr-2">
                    Cerrar
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
