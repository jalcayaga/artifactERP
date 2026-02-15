'use client';

import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

import { FileText, CheckCircle2 } from 'lucide-react';

interface RevenueChartProps {
    pendingInvoices: number;
    acceptedQuotes: number;
    loading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ pendingInvoices, acceptedQuotes, loading }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        if (chartInstanceRef.current) chartInstanceRef.current.destroy();

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Facturas Pendientes', 'Cotizaciones Aceptadas'],
                datasets: [
                    {
                        label: 'Documentos',
                        data: [pendingInvoices, acceptedQuotes],
                        backgroundColor: ['#f59e0b', '#10b981'],
                        borderRadius: 6,
                        barThickness: 40,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8', stepSize: 1 }
                    }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
        };
    }, [pendingInvoices, acceptedQuotes]);

    return (
        <div className="card-premium p-6 h-full min-h-[220px] flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest opacity-80">Estado de Documentos</h3>

            <div className="h-40 mb-4 relative">
                <canvas ref={chartRef}></canvas>
            </div>

            <div className="flex items-center justify-between text-xs mt-auto">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                    <div className="flex flex-col">
                        <span className="text-[#7b8893] font-semibold">Pendientes</span>
                        <span className="text-white font-bold text-sm">{loading ? '...' : pendingInvoices}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00a1ff] shadow-[0_0_8px_rgba(0,161,255,0.4)]"></div>
                    <div className="flex flex-col">
                        <span className="text-[#7b8893] font-semibold">Aceptadas</span>
                        <span className="text-white font-bold text-sm">{loading ? '...' : acceptedQuotes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;
