'use client';

// apps/admin/components/dashboard/SalesChart.tsx
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useTheme, formatCurrencyChilean } from '@artifact/core';

const SalesChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const { theme } = useTheme();
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setChartKey((prevKey) => prevKey + 1);
  }, [theme]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const canvasCtx = chartRef.current.getContext('2d');
    if (!canvasCtx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    const salesData = [1250000, 1980000, 1530000, 2250000, 1870000, 2560000];

    // This part is tricky as it depends on CSS variables that might not be present.
    // For now, we'll provide fallback values to ensure the chart renders.
    const primaryColor = 'hsl(262.1 83.3% 57.8%)'; // Fallback purple
    const primaryColorTransparent = 'hsla(262.1 83.3% 57.8%, 0.2)';
    const textColor = theme === 'dark' ? 'white' : 'black';
    const mutedTextColor = theme === 'dark' ? '#a1a1aa' : '#71717a'; // zinc-400 and zinc-500
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const cardBgColor = theme === 'dark' ? '#09090b' : 'white'; // zinc-950

    chartInstanceRef.current = new Chart(canvasCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ventas del Mes',
            data: salesData,
            borderColor: primaryColor,
            backgroundColor: primaryColorTransparent,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: primaryColor,
            pointBorderColor: cardBgColor,
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: primaryColor,
            pointHoverBorderColor: cardBgColor,
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: gridColor },
            ticks: {
              color: mutedTextColor,
              padding: 8,
              callback: function (value: number | string) {
                if (typeof value === 'number') {
                  if (Math.abs(value) >= 1000000)
                    return `$${(value / 1000000).toFixed(1)}M`;
                  if (Math.abs(value) >= 1000)
                    return `$${(value / 1000).toFixed(0)}K`;
                  return formatCurrencyChilean(value);
                }
                return value;
              },
            },
          },
          x: {
            grid: { display: false },
            ticks: { color: mutedTextColor, padding: 8 },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: cardBgColor,
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: gridColor,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 4,
            usePointStyle: true,
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += formatCurrencyChilean(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
        interaction: { mode: 'index', intersect: false },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [theme, chartKey]);

  return (
    <div style={{ height: '350px', position: 'relative' }} key={chartKey}>
      <canvas
        ref={chartRef}
        role='img'
        aria-label='Gráfico de resumen de ventas mensuales'
      ></canvas>
    </div>
  );
};

export default SalesChart;
