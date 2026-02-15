'use client';

// Importaciones de React y componentes/iconos necesarios.
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from '@material-tailwind/react';
import {
  CreditCardIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';
import SalesChart from './SalesChart';
import WelcomeBanner from './WelcomeBanner';
import StatsGroup from './StatsGroup';
import ProductDoughnut from './ProductDoughnut';
import DashboardSkeleton from './DashboardSkeleton';
import { DashboardStats, formatCurrencyChilean } from '@artifact/core';
import { DashboardService, useCompany } from '@artifact/core/client';;

// Interfaz y componente para las tarjetas de estadísticas.
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  footer?: {
    value: string;
    label: string;
    trend: 'up' | 'down' | 'neutral';
  };
  color?: 'blue' | 'green' | 'orange' | 'pink';
}

const MaterialStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  footer,
  color = 'blue'
}) => {
  const gradients = {
    blue: 'from-blue-600 to-blue-400',
    green: 'from-emerald-500 to-teal-400',
    orange: 'from-orange-600 to-orange-400',
    pink: 'from-pink-600 to-rose-400',
  };

  const shadows = {
    blue: 'shadow-blue-500/40',
    green: 'shadow-emerald-500/40',
    orange: 'shadow-orange-500/40',
    pink: 'shadow-pink-500/40',
  };

  return (
    <Card className="relative flex flex-col bg-[#1e293b] bg-clip-border rounded-xl text-white shadow-md border border-blue-gray-100/5">
      <div
        className={`bg-gradient-to-tr ${gradients[color]} ${shadows[color]} -mt-4 mx-4 rounded-xl overflow-hidden text-white shadow-lg absolute -top-2 grid h-12 w-12 place-items-center`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400">
          {title}
        </Typography>
        <Typography variant="h4" className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <div className="border-t border-blue-gray-50 dark:border-zinc-800 p-4">
          <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600 dark:text-gray-400">
            <strong className={`${footer.trend === 'up' ? 'text-green-500' : footer.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
              {footer.value}
            </strong>
            &nbsp;{footer.label}
          </p>
        </div>
      )}
    </Card>
  );
};

// Componente principal del Dashboard.
const DashboardView: React.FC = () => {
  const { activeCompany, isLoading: isCompanyLoading, error: companyError } = useCompany();

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (isCompanyLoading) {
        setLoadingStats(true);
        return;
      }

      if (companyError) {
        setStatsError(companyError);
        setLoadingStats(false);
        return;
      }

      if (activeCompany) {
        try {
          setLoadingStats(true);
          const stats = await DashboardService.getStats(activeCompany.id);
          setDashboardStats(stats);
          setStatsError(null);
        } catch (err) {
          console.error('Error fetching dashboard stats:', err);
          setStatsError('Error al cargar las estadísticas del dashboard.');
        } finally {
          setLoadingStats(false);
        }
      } else {
        setStatsError('No hay una empresa activa seleccionada.');
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [activeCompany, isCompanyLoading, companyError]);

  if (isCompanyLoading || loadingStats) {
    return <DashboardSkeleton />;
  }

  if (statsError || !activeCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 bg-brand/20 border border-brand/30 rounded-3xl mx-auto flex items-center justify-center">
            <span className="text-4xl font-bold text-white">A</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Bienvenido a Artifact ERP</h1>
          <p className="text-slate-400">
            {statsError || 'No hay una empresa activa seleccionada.'}
          </p>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <p className="text-sm text-slate-300">
              Para comenzar, necesitas configurar una empresa en el sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return <div className="text-center p-8">No hay datos de dashboard para mostrar.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Row 1: Welcome Banner (66%) + Stats Group (33%) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <WelcomeBanner />
        </div>
        <div className="xl:col-span-1 h-full">
          <StatsGroup />
        </div>
      </div>

      {/* Row 2: Sales Chart (66%) + Product Doughnut (33%) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 rounded-3xl bg-[#1e293b] p-6 shadow-sm border border-blue-gray-100/5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Typography variant="h6" color="white" className="font-bold">Sales Profit</Typography>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">Profit</button>
              <button className="px-3 py-1 rounded-full bg-[#0f172a] text-blue-gray-200 text-xs font-medium border border-blue-gray-100/5">Expenses</button>
            </div>
          </div>
          <SalesChart />
        </Card>
        <div className="xl:col-span-1 h-full">
          <ProductDoughnut />
        </div>
      </div>


    </div>
  );
};

export default DashboardView;
