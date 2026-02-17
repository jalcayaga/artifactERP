'use client';

import React from 'react';
import { Sale, OrderStatus, formatCurrencyChilean } from '@artifact/core';
import {
    Card,
    Typography,
    IconButton,
    Tooltip
} from "@material-tailwind/react";
import {
    Clock,
    CheckCircle2,
    Package,
    ArrowUpRight,
    XCircle,
    MoreVertical,
    Calendar,
    Building2,
    ChevronRight
} from 'lucide-react';

interface SalesWorkflowViewProps {
    sales: Sale[];
    onViewDetails: (sale: Sale) => void;
    onUpdateStatus?: (saleId: string, newStatus: OrderStatus) => void;
    customLabels?: Record<string, string>;
}

const statusLabels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING_PAYMENT]: 'Pendiente de Pago',
    [OrderStatus.PROCESSING]: 'En Proceso',
    [OrderStatus.SHIPPED]: 'Enviada',
    [OrderStatus.DELIVERED]: 'Entregada',
    [OrderStatus.CANCELLED]: 'Cancelada',
    [OrderStatus.COMPLETED]: 'Completada',
    [OrderStatus.REFUNDED]: 'Reembolsada',
};

const statusConfig: Record<string, { color: string, icon: any, label: string, nextStatus?: OrderStatus }> = {
    [OrderStatus.PENDING_PAYMENT]: {
        color: 'border-orange-500/20 bg-orange-500/5',
        icon: Clock,
        label: 'Pendiente',
        nextStatus: OrderStatus.PROCESSING
    },
    [OrderStatus.PROCESSING]: {
        color: 'border-purple-500/20 bg-purple-500/5',
        icon: Package,
        label: 'En Proceso',
        nextStatus: OrderStatus.SHIPPED
    },
    [OrderStatus.SHIPPED]: {
        color: 'border-indigo-500/20 bg-indigo-500/5',
        icon: ArrowUpRight,
        label: 'Enviada',
        nextStatus: OrderStatus.DELIVERED
    },
    [OrderStatus.DELIVERED]: {
        color: 'border-emerald-500/20 bg-emerald-500/5',
        icon: CheckCircle2,
        label: 'Entregada'
    },
    [OrderStatus.CANCELLED]: {
        color: 'border-red-500/20 bg-red-500/5',
        icon: XCircle,
        label: 'Cancelada'
    },
};

const SalesWorkflowView: React.FC<SalesWorkflowViewProps> = ({ sales, onViewDetails, onUpdateStatus, customLabels = {} }) => {
    const getStatusLabel = (status: OrderStatus) => customLabels[status] || statusLabels[status] || statusConfig[status]?.label || status;
    const columns = [
        OrderStatus.PENDING_PAYMENT,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED
    ];

    const getSalesByStatus = (status: string) => sales.filter(s => s.status === status);

    return (
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide min-h-[600px]">
            {columns.map((status) => (
                <div key={status} className="flex-shrink-0 w-80 flex flex-col gap-4">
                    <div className={`p-4 rounded-2xl border ${statusConfig[status].color} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg">
                                {React.createElement(statusConfig[status].icon, { className: "w-4 h-4 text-white" })}
                            </div>
                            <Typography variant="small" color="white" className="font-black uppercase tracking-widest text-[10px]" placeholder="">
                                {getStatusLabel(status)}
                            </Typography>
                        </div>
                        <Typography variant="small" className="text-slate-500 font-bold bg-white/5 px-2 py-0.5 rounded-md text-[10px]" placeholder="">
                            {getSalesByStatus(status).length}
                        </Typography>
                    </div>

                    <div className="space-y-3 flex-1">
                        {getSalesByStatus(status).map((sale) => (
                            <Card
                                key={sale.id}
                                className="bg-[#1a2537]/60 border border-white/5 p-4 hover:border-blue-500/30 transition-all cursor-pointer group rounded-2xl"
                                onClick={() => onViewDetails(sale)}
                                placeholder=""
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Typography variant="small" color="white" className="font-black italic uppercase tracking-tighter text-xs group-hover:text-blue-400 transition-colors" placeholder="">
                                                #{sale.id.substring(0, 8)}
                                            </Typography>
                                            <div className="flex items-center gap-2 mt-1 opacity-60">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                <Typography className="text-[9px] text-slate-400 font-bold uppercase tracking-widest" placeholder="">
                                                    {new Date(sale.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </div>
                                        </div>
                                        <IconButton size="sm" variant="text" color="blue" className="rounded-xl" placeholder="">
                                            <MoreVertical className="w-4 h-4 text-slate-500" />
                                        </IconButton>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3 h-3 text-blue-500" />
                                            <Typography className="text-[11px] font-bold text-slate-200 line-clamp-1 truncate uppercase" placeholder="">
                                                {sale.company?.name || 'Cliente Particular'}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                        <Typography className="text-xs font-black text-blue-400 italic" placeholder="">
                                            {formatCurrencyChilean(sale.grandTotalAmount)}
                                        </Typography>

                                        {statusConfig[status].nextStatus && onUpdateStatus && (
                                            <Tooltip content={`Mover a ${getStatusLabel(statusConfig[status].nextStatus!)}`}>
                                                <IconButton
                                                    size="sm"
                                                    variant="text"
                                                    color="blue-gray"
                                                    className="rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUpdateStatus(sale.id, statusConfig[status].nextStatus!);
                                                    }}
                                                    placeholder=""
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {getSalesByStatus(status).length === 0 && (
                            <div className="h-24 rounded-2xl border border-dashed border-white/5 flex items-center justify-center opacity-20">
                                <Typography className="text-[10px] uppercase font-black tracking-widest text-slate-500" placeholder="">
                                    Sin ventas
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalesWorkflowView;
