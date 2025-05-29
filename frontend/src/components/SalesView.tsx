import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Importar Card de shadcn/ui
import SaleForm from '@/components/SaleForm';
import SaleDetailModal from '@/components/SaleDetailModal';
import { PlusIcon, ShoppingCartIcon, EyeIcon } from '@/components/Icons';
import { Sale } from '@/types';

const FIXED_VAT_RATE_PERCENT_DISPLAY = 19;
const LOCAL_STORAGE_KEY_SALES = 'wolfflow_sales';

const SalesView: React.FC = () => {
  const [showSaleForm, setShowSaleForm] = useState<boolean>(false);
  const [savedSales, setSavedSales] = useState<Sale[]>(() => {
    try {
      const storedSales = localStorage.getItem(LOCAL_STORAGE_KEY_SALES);
      return storedSales ? JSON.parse(storedSales) : [];
    } catch (error) {
      console.error("Error loading sales from localStorage:", error);
      return [];
    }
  }); 
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SALES, JSON.stringify(savedSales));
    } catch (error) {
      console.error("Error saving sales to localStorage:", error);
    }
  }, [savedSales]);

  const handleCreateNewSale = useCallback(() => {
    setShowSaleForm(true);
  }, []);

  const handleSaveSale = useCallback((saleData: Sale) => {
    setSavedSales(prevSales => [...prevSales, saleData]); 
    setShowSaleForm(false);
  }, []);

  const handleCancelSaleForm = useCallback(() => {
    setShowSaleForm(false);
  }, []);

  const handleViewSale = useCallback((sale: Sale) => {
    setViewingSale(sale);
  }, []);

  const handleCloseSaleDetailModal = useCallback(() => {
    setViewingSale(null);
  }, []);

  if (showSaleForm) {
    return (
      <SaleForm 
        onSave={handleSaveSale}
        onCancel={handleCancelSaleForm}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Gestión de Ventas
          </h1>
          <button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2"
            onClick={handleCreateNewSale}
            aria-label="Crear Nueva Venta"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Crear Nueva Venta</span>
          </button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {savedSales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID Venta</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Fecha</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Subtotal</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">IVA ({FIXED_VAT_RATE_PERCENT_DISPLAY}%)</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {savedSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-accent transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-muted-foreground">{sale.id.substring(0, 8)}...</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">{sale.clientName}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{new Date(sale.saleDate).toLocaleDateString()} - Total: ${sale.grandTotal.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{new Date(sale.saleDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden md:table-cell">${sale.subTotal.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden lg:table-cell">${sale.totalVatAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary text-right">${sale.grandTotal.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-3">
                            <button 
                              onClick={() => handleViewSale(sale)} 
                              title="Ver Detalles de Venta" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Ver detalles de venta ${sale.id.substring(0,8)}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <ShoppingCartIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">
                  No hay ventas registradas
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Comienza creando una nueva venta para verla listada aquí.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCreateNewSale}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Crear Primera Venta</span>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {viewingSale && (
        <SaleDetailModal 
          sale={viewingSale}
          onClose={handleCloseSaleDetailModal}
        />
      )}
    </>
  );
};

export default SalesView;