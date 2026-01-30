// frontend/components/SalesChart.tsx
import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto' // Import Chart.js with auto registration
import { useTheme } from '@/contexts/ThemeContext'
import { formatCurrencyChilean } from '@/lib/utils'

const SalesChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null) // Use Chart type from chart.js
  const { theme } = useTheme()
  const [chartKey, setChartKey] = useState(0)

  useEffect(() => {
    setChartKey((prevKey) => prevKey + 1)
  }, [theme])

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    const canvasCtx = chartRef.current.getContext('2d')
    if (!canvasCtx) return

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
    const salesData = [1250000, 1980000, 1530000, 2250000, 1870000, 2560000]

    const computedStyles = getComputedStyle(document.documentElement)
    const primaryHslVal = computedStyles
      .getPropertyValue('--primary-hsl-values')
      .trim()
    const cardFgHslVal = computedStyles
      .getPropertyValue('--card-foreground-hsl-values')
      .trim()
    const mutedFgHslVal = computedStyles
      .getPropertyValue('--muted-foreground-hsl-values')
      .trim()
    const borderHslVal = computedStyles
      .getPropertyValue('--border-hsl-values')
      .trim()
    const cardHslVal = computedStyles
      .getPropertyValue('--card-hsl-values')
      .trim()

    const primaryColor = `hsl(${primaryHslVal})`
    const primaryColorTransparent = `hsla(${primaryHslVal}, 0.2)`
    const textColor = `hsl(${cardFgHslVal})`
    const mutedTextColor = `hsl(${mutedFgHslVal})`
    const gridColor = `hsla(${borderHslVal}, 0.5)`
    const cardBgColor = `hsl(${cardHslVal})`

    chartInstanceRef.current = new Chart(canvasCtx, {
      // Use the imported Chart object
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
                    return `$${(value / 1000000).toFixed(1)}M`
                  if (Math.abs(value) >= 1000)
                    return `$${(value / 1000).toFixed(0)}K`
                  return formatCurrencyChilean(value)
                }
                return value
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
                let label = context.dataset.label || ''
                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += formatCurrencyChilean(context.parsed.y)
                }
                return label
              },
            },
          },
        },
        interaction: { mode: 'index', intersect: false },
      },
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [theme, chartKey])

  return (
    <div style={{ height: '350px', position: 'relative' }} key={chartKey}>
      <canvas
        ref={chartRef}
        role='img'
        aria-label='Gráfico de resumen de ventas mensuales'
      ></canvas>
    </div>
  )
}

export default SalesChart
