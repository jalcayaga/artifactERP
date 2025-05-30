import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; 
import { CreditCardIcon } from '@/icons';

const FinanceView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-foreground">
        Finanzas
      </h1>
      <Card>
        <CardContent className="text-center py-12 px-4">
          <CreditCardIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
          <h3 className="mt-3 text-xl font-semibold text-foreground">
            Módulo de Finanzas
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Gestión de cuentas, transacciones, presupuestos, y más.
          </p>
          <p className="mt-1 text-sm text-muted-foreground italic">
            (Funcionalidad en desarrollo)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceView;