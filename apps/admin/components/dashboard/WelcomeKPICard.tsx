'use client';

import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { ShoppingBag, Box, TrendingUp } from 'lucide-react';

interface WelcomeKPICardProps {
    totalSales: number;
    totalProducts: number;
    loading?: boolean;
}

const WelcomeKPICard: React.FC<WelcomeKPICardProps> = ({ totalSales, totalProducts, loading }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        if (chartInstanceRef.current) chartInstanceRef.current.destroy();

        chartInstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Ventas', 'Resto'],
                datasets: [{
                    data: [85, 15],
                    backgroundColor: ['#3b82f6', 'rgba(255, 255, 255, 0.05)'],
                    borderWidth: 0,
                    borderRadius: 20,
                }]
            },
            options: {
                cutout: '80%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
        };
    }, []);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="card-premium p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]">
            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Resumen Informatica Test</h3>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00a1ff]/10 flex items-center justify-center text-[#00a1ff]">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-[#7b8893] uppercase tracking-wider">Ventas Consolidadas</p>
                            <p className="text-xl font-bold text-white leading-tight">
                                {loading ? '...' : formatCurrency(totalSales)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Box className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-[#7b8893] uppercase tracking-wider">Productos en Catálogo</p>
                            <p className="text-xl font-bold text-white leading-tight">
                                {loading ? '...' : `${totalProducts} unidades`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Donut Chart Container */}
                <div className="w-24 h-24 relative opacity-80 mt-2">
                    <canvas ref={chartRef}></canvas>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <TrendingUp className="w-6 h-6 text-[#00a1ff]" />
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 z-10 flex items-center gap-2 border-t border-white/5">
                <div className="w-2 h-2 rounded-full bg-[#00a1ff] animate-pulse"></div>
                <p className="text-xs text-[#7b8893]">Sincronizado en tiempo real</p>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00a1ff]/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
};

export default WelcomeKPICard;
