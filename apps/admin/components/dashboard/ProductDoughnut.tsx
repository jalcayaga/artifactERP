'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Card, Typography } from "@material-tailwind/react";

const ProductDoughnut: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Modernize', 'Spike', 'Ample', 'MaterialM'],
                        datasets: [
                            {
                                data: [36, 17, 22, 31],
                                backgroundColor: [
                                    '#3b82f6', // Blue
                                    '#06b6d4', // Cyan
                                    '#a855f7', // Purple
                                    '#ec4899', // Pink
                                ],
                                borderWidth: 0,
                                hoverOffset: 4,
                            },
                        ],
                    },
                    options: {
                        cutout: '80%',
                        rotation: -90,
                        circumference: 180,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    usePointStyle: true,
                                    pointStyle: 'circle',
                                    color: '#94a3b8', // Slate 400
                                    font: {
                                        family: 'Inter',
                                        size: 11
                                    },
                                    padding: 20,
                                },
                            },
                            tooltip: {
                                backgroundColor: '#1e293b',
                                titleColor: '#fff',
                                bodyColor: '#cbd5e1',
                                borderColor: '#334155',
                                borderWidth: 1,
                                padding: 10,
                                cornerRadius: 8,
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                    },
                });
            }
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <Card className="rounded-3xl bg-[#1e293b] p-6 shadow-sm border border-blue-gray-100/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h6" color="white" className="font-bold">Product Sales</Typography>
            </div>

            <div className="relative flex-1 min-h-[250px] flex items-center justify-center">
                <canvas ref={chartRef}></canvas>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Typography variant="h3" color="white" className="font-bold">8,364</Typography>
                    <span className="text-xs text-blue-gray-200 font-medium bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full mt-1">
                        Best Seller
                    </span>
                </div>
            </div>

            <Typography variant="small" className="text-center text-blue-gray-400 mt-4">
                Overview of sales calculated this month
            </Typography>
        </Card>
    );
};

export default ProductDoughnut;
