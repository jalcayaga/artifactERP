'use client';

import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface FunnelChartProps {
    pendingCount: number;
    acceptedCount: number;
    loading?: boolean;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ pendingCount, acceptedCount, loading }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        if (chartInstanceRef.current) chartInstanceRef.current.destroy();

        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Flujo de Operaciones',
                    data: [10, 15, 8, 12, pendingCount, acceptedCount],
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#06b6d4',
                    fill: true,
                    backgroundColor: 'rgba(6, 182, 212, 0.05)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: { display: false },
                    y: { display: false, min: 0 }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
        };
    }, [pendingCount, acceptedCount]);

    return (
        <div className="card-premium p-6 h-full min-h-[220px] flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest opacity-80">Embudo de Ventas</h3>

            <div className="h-24 mb-2 relative">
                <canvas ref={chartRef}></canvas>
            </div>

            <div className="space-y-4 mt-auto">
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <div>
                        <p className="text-[#7b8893] font-semibold">Facturas Pendientes</p>
                        <p className="text-[10px] text-[#7b8893] uppercase tracking-wide">Esperando pago</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-white text-lg">{loading ? '...' : pendingCount}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div>
                        <p className="text-[#7b8893] font-semibold">Cotizaciones Aceptadas</p>
                        <p className="text-[10px] text-[#7b8893] uppercase tracking-wide">Por facturar</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-white text-lg">{loading ? '...' : acceptedCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunnelChart;
