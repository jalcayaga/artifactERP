'use client';

import React from 'react';
import { Card, Typography } from '@material-tailwind/react';
import { CreditCard, Wallet, Landmark, RotateCcw } from 'lucide-react';

import { ShoppingCart, User, Package, FileCheck } from 'lucide-react';

interface TransactionsListProps {
    activities: any[];
    loading?: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ activities, loading }) => {
    return (
        <div className="card-premium p-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h5" color="white" className="font-bold tracking-tight text-xl">
                    Actividad Reciente
                </Typography>
            </div>
            <div className="flex flex-col gap-6">
                {loading ? (
                    <p className="text-[#7b8893] text-sm animate-pulse">Cargando actividades...</p>
                ) : activities.length === 0 ? (
                    <p className="text-[#7b8893] text-sm">Sin actividad reciente.</p>
                ) : (
                    activities.map((act, index) => (
                        <div key={index} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl bg-[#00a1ff]/10 flex items-center justify-center border border-[#00a1ff]/10 transition-colors group-hover:bg-[#00a1ff]/20`}>
                                    <ShoppingCart className="w-5 h-5 text-[#00a1ff]" />
                                </div>
                                <div>
                                    <Typography className="font-semibold text-white text-[15px]">
                                        Pedido {act.orderNumber || act.id.substring(0, 8)}
                                    </Typography>
                                    <Typography className="text-[12px] text-[#7b8893] font-medium uppercase tracking-wider">
                                        {act.status} — {new Date(act.createdAt).toLocaleDateString()}
                                    </Typography>
                                </div>
                            </div>
                            <Typography className={`font-bold text-white text-[15px]`}>
                                ${act.grandTotalAmount?.toLocaleString()}
                            </Typography>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-auto pt-6">
                <button className="w-full py-3 rounded-xl bg-[#00a1ff] hover:bg-[#00a1ff]/90 text-white font-bold text-sm transition-all shadow-[0_4px_12px_rgba(0,161,255,0.3)] hover:shadow-[0_8px_20px_rgba(0,161,255,0.4)] active:scale-[0.98]">
                    Ver Toda la Actividad
                </button>
            </div>
        </div>
    );
};

export default TransactionsList;
