
// frontend/components/FinanceView.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknotesIcon, TrendingUpIcon, TrendingDownIcon, CalendarDaysIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@/components/Icons';
import Chart from 'chart.js/auto';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrencyChilean } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  bgColorClass?: string;
  textColorClass?: string;
}

const FinanceStatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, bgColorClass = 'bg-primary/10 dark:bg-primary/20', textColorClass = 'text-primary' }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${bgColorClass} mr-4`}>
            <Icon className={`w-6 h-6 ${textColorClass}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CashFlowChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const { theme } = useTheme();
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setChartKey(prevKey => prevKey + 1); // Force re-render on theme change
  }, [theme]);

  useEffect(() => {
    if (!chartRef.current) return;
    const canvasCtx = chartRef.current.getContext('2d');
    if (!canvasCtx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const incomeData = [1500000, 1700000, 1600000, 1800000, 1750000, 1900000];
    const expenseData = [1200000, 1300000, 1400000, 1350000, 1500000, 1450000];

    const computedStyles = getComputedStyle(document.documentElement);
    const primaryHslVal = computedStyles.getPropertyValue('--primary-hsl-values').trim();
    const destructiveHslVal = "0 72% 51%"; // Approx. red-600, adjust if you have --destructive-hsl-values
    const cardFgHslVal = computedStyles.getPropertyValue('--card-foreground-hsl-values').trim();
    const mutedFgHslVal = computedStyles.getPropertyValue('--muted-foreground-hsl-values').trim();
    const borderHslVal = computedStyles.getPropertyValue('--border-hsl-values').trim();
    const cardHslVal = computedStyles.getPropertyValue('--card-hsl-values').trim();

    const incomeColor = `hsl(${primaryHslVal})`; // Greenish
    const expenseColor = `hsl(${destructiveHslVal})`; // Reddish
    const textColor = `hsl(${cardFgHslVal})`;
    const mutedTextColor = `hsl(${mutedFgHslVal})`;
    const gridColor = `hsla(${borderHslVal}, 0.5)`;
    const cardBgColor = `hsl(${cardHslVal})`;

    chartInstanceRef.current = new Chart(canvasCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos',
            data: incomeData,
            backgroundColor: `hsla(${primaryHslVal}, 0.7)`,
            borderColor: incomeColor,
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Egresos',
            data: expenseData,
            backgroundColor: `hsla(${destructiveHslVal}, 0.7)`,
            borderColor: expenseColor,
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: {
              color: mutedTextColor, padding: 8,
              callback: value => typeof value === 'number' ? formatCurrencyChilean(value) : value
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: mutedTextColor, padding: 8, }
          }
        },
        plugins: {
          legend: { position: 'top', labels: { color: textColor } },
          tooltip: {
            backgroundColor: cardBgColor, titleColor: textColor, bodyColor: textColor,
            borderColor: gridColor, borderWidth: 1, padding: 10, cornerRadius: 4,
            callbacks: {
              label: context => `${context.dataset.label}: ${formatCurrencyChilean(context.parsed.y)}`
            }
          }
        },
        interaction: { mode: 'index', intersect: false },
      }
    });
    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [theme, chartKey]);

  return (
    <div style={{ height: '380px', position: 'relative' }} key={chartKey}>
      <canvas ref={chartRef} role="img" aria-label="Gráfico de flujo de caja"></canvas>
    </div>
  );
};

const FinanceView: React.FC = () => {
  const mockAccountsReceivable = [
    { id: 'ar1', client: 'Cliente Alfa S.A.', invoice: 'F00123', amount: 1250000, dueDate: 'Vence en 5 días', overdue: false },
    { id: 'ar2', client: 'Servicios Beta Ltda.', invoice: 'F00115', amount: 875000, dueDate: 'VENCIDA (Hace 10 días)', overdue: true },
    { id: 'ar3', client: 'Comercial Gamma', invoice: 'F00128', amount: 2300000, dueDate: 'Vence en 15 días', overdue: false },
  ];

  const mockAccountsPayable = [
    { id: 'ap1', supplier: 'Proveedor Zeta Inc.', invoice: 'PZ-987', amount: 750000, dueDate: 'Vence Hoy', urgent: true },
    { id: 'ap2', supplier: 'Insumos Omega', invoice: 'IO-654', amount: 420000, dueDate: 'Vence en 7 días', urgent: false },
    { id: 'ap3', supplier: 'Logística Delta', invoice: 'LD-321', amount: 115000, dueDate: 'Vence en 20 días', urgent: false },
  ];
  
  const mockRecentTransactions = [
    { id: 'tx1', type: 'Ingreso', description: 'Pago Factura F00110 - Cliente Alfa', date: 'Hoy', amount: 1850000 },
    { id: 'tx2', type: 'Egreso', description: 'Pago Proveedor Zeta Inc. PZ-980', date: 'Ayer', amount: 650000 },
    { id: 'tx3', type: 'Ingreso', description: 'Abono Proyecto Beta', date: 'Hace 2 días', amount: 950000 },
    { id: 'tx4', type: 'Egreso', description: 'Compra de Insumos Oficina', date: 'Hace 3 días', amount: 85000 },
    { id: 'tx5', type: 'Egreso', description: 'Pago arriendo oficina Noviembre', date: 'Hace 5 días', amount: 1200000 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-foreground">Finanzas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceStatCard title="Saldo Actual (Cuentas)" value={formatCurrencyChilean(15750000)} icon={BanknotesIcon} />
        <FinanceStatCard title="Ingresos del Mes" value={formatCurrencyChilean(7850000)} icon={TrendingUpIcon} bgColorClass="bg-emerald-500/10 dark:bg-emerald-500/20" textColorClass="text-emerald-600 dark:text-emerald-400" />
        <FinanceStatCard title="Gastos del Mes" value={formatCurrencyChilean(4320000)} icon={TrendingDownIcon} bgColorClass="bg-rose-500/10 dark:bg-rose-500/20" textColorClass="text-rose-600 dark:text-rose-400" />
        <FinanceStatCard title="Próximo Vencimiento" value={`${formatCurrencyChilean(750000)} (Hoy)`} icon={CalendarDaysIcon} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-xl">Flujo de Caja (Últimos 6 Meses)</CardTitle></CardHeader>
        <CardContent className="p-4 pt-2"><CashFlowChart /></CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Estado de Cuentas</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-md font-semibold text-primary mb-2">Cuentas por Cobrar</h3>
              <ul className="space-y-2.5 text-sm">
                {mockAccountsReceivable.map(item => (
                  <li key={item.id} className={`p-2.5 rounded-md ${item.overdue ? 'bg-amber-500/10' : 'bg-muted/50'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{item.client} <span className="text-xs text-muted-foreground">({item.invoice})</span></span>
                      <span className={`font-semibold ${item.overdue ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>{formatCurrencyChilean(item.amount)}</span>
                    </div>
                    <p className={`text-xs ${item.overdue ? 'text-amber-500' : 'text-muted-foreground'}`}>{item.dueDate}</p>
                  </li>
                ))}
              </ul>
               <button className="mt-3 text-xs font-medium text-primary hover:text-primary/80">Ver todas las cuentas por cobrar</button>
            </div>
            <div>
              <h3 className="text-md font-semibold text-rose-600 dark:text-rose-400 mb-2">Cuentas por Pagar</h3>
              <ul className="space-y-2.5 text-sm">
                {mockAccountsPayable.map(item => (
                  <li key={item.id} className={`p-2.5 rounded-md ${item.urgent ? 'bg-rose-500/10' : 'bg-muted/50'}`}>
                     <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{item.supplier} <span className="text-xs text-muted-foreground">({item.invoice})</span></span>
                      <span className={`font-semibold ${item.urgent ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'}`}>{formatCurrencyChilean(item.amount)}</span>
                    </div>
                    <p className={`text-xs ${item.urgent ? 'text-rose-500' : 'text-muted-foreground'}`}>{item.dueDate}</p>
                  </li>
                ))}
              </ul>
              <button className="mt-3 text-xs font-medium text-primary hover:text-primary/80">Ver todas las cuentas por pagar</button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-lg">Transacciones Recientes</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockRecentTransactions.map(tx => (
                <li key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
                  <div className="flex items-center">
                    {tx.type === 'Ingreso' ? 
                      <ArrowUpCircleIcon className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" /> : 
                      <ArrowDownCircleIcon className="w-6 h-6 text-rose-500 mr-3 flex-shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'Ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {tx.type === 'Ingreso' ? '+' : '-'}{formatCurrencyChilean(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-4 text-sm font-medium text-primary hover:text-primary/80 w-full text-center">Ver todas las transacciones</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceView;