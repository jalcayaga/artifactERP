'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { formatCurrencyChilean } from '@artifact/core';;
import { useTheme } from '@artifact/core/client';;

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
    const previousData = [1100000, 1750000, 1400000, 2000000, 1600000, 2200000];

    // Brand color based on reference (Blue/Cyan)
    const primaryColor = '#3b82f6'; // Blue-500
    const secondaryColor = '#06b6d4'; // Cyan-500
    const textColor = theme === 'dark' ? '#fff' : '#1f2937';
    const mutedTextColor = theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // Create gradient
    const gradient = canvasCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // Blue
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    chartInstanceRef.current = new Chart(canvasCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Este Período',
            data: salesData,
            borderColor: '#3b82f6', // Blue line
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 3,
          },
          {
            label: 'Período Anterior',
            data: previousData,
            borderColor: '#06b6d4', // Cyan line for comparison
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 2,
            borderDash: [5, 5],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: gridColor,
            },
            border: {
              display: false,
            },
            ticks: {
              color: mutedTextColor,
              padding: 12,
              font: {
                size: 11,
              },
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
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: mutedTextColor,
              padding: 8,
              font: {
                size: 11,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: mutedTextColor,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: 'rgba(0, 255, 127, 0.3)',
            borderWidth: 1,
            padding: 16,
            cornerRadius: 12,
            displayColors: true,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              title: function (context: any) {
                return context[0].label;
              },
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
    <div style={{ height: '320px', position: 'relative' }} key={chartKey}>
      <canvas
        ref={chartRef}
        role='img'
        aria-label='Gráfico de tendencia de ventas mensuales comparando período actual vs anterior'
      ></canvas>
    </div>
  );
};

export default SalesChart;
