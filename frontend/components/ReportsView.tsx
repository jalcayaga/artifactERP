
// frontend/components/ReportsView.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; 
import { 
  ShoppingCartIcon, 
  CreditCardIcon, 
  ArchiveBoxIcon, 
  UsersIcon, 
  TruckIcon, 
  CogIcon,
  ChartPieIcon // Re-added as a fallback if CogIcon isn't what's desired for "custom"
} from '@/components/Icons';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  actionText: string;
  onAction: () => void;
  actionDisabled?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon: Icon, actionText, onAction, actionDisabled }) => {
  return (
    <Card className="flex flex-col h-full border hover:shadow-lg dark:hover:bg-muted/30 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-primary/10 rounded-lg">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-3">
        <button
          onClick={onAction}
          disabled={actionDisabled}
          className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors
                      ${actionDisabled 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 dark:focus:ring-offset-card'}`}
        >
          {actionText}
        </button>
      </CardFooter>
    </Card>
  );
};

const ReportsView: React.FC = () => {
  const reports = [
    {
      id: 'sales-detailed',
      title: 'Informe de Ventas Detallado',
      description: "Análisis completo de ventas por período, cliente, producto, y más. Ideal para entender tendencias y rendimiento.",
      icon: ShoppingCartIcon,
      actionText: 'Generar Informe de Ventas',
      onAction: () => alert('Generando Informe de Ventas Detallado... (Funcionalidad de maqueta)'),
    },
    {
      id: 'financial-summary',
      title: 'Resumen Financiero',
      description: "Vista consolidada de ingresos, egresos, flujo de caja y rentabilidad para un período específico.",
      icon: CreditCardIcon,
      actionText: 'Ver Resumen Financiero',
      onAction: () => alert('Mostrando Resumen Financiero... (Funcionalidad de maqueta)'),
    },
    {
      id: 'inventory-status',
      title: 'Reporte de Inventario',
      description: "Valoración actual del inventario, niveles de stock por producto, alertas de stock bajo y rotación.",
      icon: ArchiveBoxIcon,
      actionText: 'Consultar Inventario',
      onAction: () => alert('Consultando Estado de Inventario... (Funcionalidad de maqueta)'),
    },
    {
      id: 'crm-analysis',
      title: 'Análisis de Clientes (CRM)',
      description: "Información sobre la actividad de los clientes, segmentación, valor de vida del cliente (LTV) y más.",
      icon: UsersIcon,
      actionText: 'Analizar Clientes',
      onAction: () => alert('Realizando Análisis de Clientes... (Funcionalidad de maqueta)'),
    },
    {
      id: 'purchases-suppliers',
      title: 'Detalle de Compras y Proveedores',
      description: "Historial de órdenes de compra, gastos por proveedor, y análisis de costos de adquisición.",
      icon: TruckIcon,
      actionText: 'Ver Reporte de Compras',
      onAction: () => alert('Mostrando Reporte de Compras... (Funcionalidad de maqueta)'),
    },
    {
      id: 'custom-builder',
      title: 'Constructor de Reportes',
      description: "Crea tus propios reportes seleccionando las métricas y dimensiones que necesitas para tu análisis.",
      icon: CogIcon, // Or ChartPieIcon if preferred
      actionText: 'Abrir Constructor',
      onAction: () => alert('Abriendo Constructor de Reportes... (Funcionalidad de maqueta - Próximamente)'),
      actionDisabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-foreground">
        Central de Reportes
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            title={report.title}
            description={report.description}
            icon={report.icon}
            actionText={report.actionText}
            onAction={report.onAction}
            actionDisabled={report.actionDisabled}
          />
        ))}
      </div>

      <Card className="mt-8 border">
         <CardContent className="text-center py-10 px-4">
          <ChartPieIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-40 mb-3" />
          <h3 className="text-lg font-medium text-foreground">
            Explore sus Datos
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Seleccione un reporte para comenzar o utilice el constructor para análisis personalizados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsView;