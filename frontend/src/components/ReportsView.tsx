import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; 
import { ChartPieIcon } from '@/icons';

const ReportsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-foreground">
        Reportes
      </h1>
      <Card>
        <CardContent className="text-center py-12 px-4">
          <ChartPieIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
          <h3 className="mt-3 text-xl font-semibold text-foreground">
            Módulo de Reportes
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Visualiza informes detallados sobre ventas, finanzas, inventario y más.
          </p>
          <p className="mt-1 text-sm text-muted-foreground italic">
            (Funcionalidad en desarrollo)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsView;