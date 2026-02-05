'use client';

// Importaciones de React y componentes/iconos necesarios.
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@artifact/ui'; // Asumiremos que ui/card.tsx será migrado
import {
  ShoppingCartIcon,
  ArchiveBoxIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from '@artifact/ui'; // Asumiremos que Icons.tsx será migrado
import SalesChart from './SalesChart'; // Apunta al componente en la misma carpeta
import { DashboardStats, formatCurrencyChilean } from '@artifact/core';
import { DashboardService, useCompany } from '@artifact/core/client';

// Interfaz y componente para las tarjetas de estadísticas.
interface StatCardProps {
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <Card className="overflow-hidden border border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 mr-4">
            <Icon className="w-6 h-6 text-primary" />
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
    return <div className="text-center p-8">Cargando dashboard...</div>;
  }

  if (statsError) {
    return <div className="text-destructive text-center p-8">{statsError}</div>;
  }

  if (!dashboardStats) {
    return <div className="text-center p-8">No hay datos de dashboard para mostrar.</div>;
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas del Mes"
          value={formatCurrencyChilean(dashboardStats.totalSalesAmount)}
          icon={ShoppingCartIcon}
        />
        <StatCard
          title="Productos en Stock"
          value={dashboardStats.totalProducts.toString()}
          icon={ArchiveBoxIcon}
        />
        <StatCard
          title="Facturas Pendientes"
          value={dashboardStats.pendingInvoices.toString()}
          icon={CreditCardIcon}
        />
        <StatCard
          title="Cotizaciones Aceptadas"
          value={dashboardStats.acceptedQuotes.toString()}
          icon={CheckCircleIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <Card className="lg:col-span-2 border border-border/50">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {dashboardStats.recentActivities.length > 0 ? (
                dashboardStats.recentActivities.map((activity) => (
                  <li key={activity.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                      {activity.user.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{`${activity.user.firstName} ${activity.user.lastName}`}</span>
                        {` creó un pedido con estado ${activity.status}.`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                  No hay actividad reciente.
                </p>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <SalesChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
