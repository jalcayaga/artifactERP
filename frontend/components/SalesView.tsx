
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card'; 
import SaleForm from '@/components/SaleForm';
import SaleDetailModal from '@/components/SaleDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PlusIcon, ShoppingCartIcon, EyeIcon, PencilIcon, TrashIcon } from '@/components/Icons';
import { Sale } from '@/lib/types'; 
import { formatCurrencyChilean } from '@/lib/utils';

const FIXED_VAT_RATE_PERCENT_DISPLAY = 19;
const LOCAL_STORAGE_KEY_SALES = 'wolfflow_sales';

const initialMockSales: Sale[] = [
  {
    id: 'sale-mock-1',
    clientName: 'Cliente Ejemplo Ltda.',
    saleDate: '2023-10-15T10:30:00Z',
    observations: 'Entrega prioritaria solicitada.',
    items: [
      { id: 'item-mock-1a', productName: 'Laptop Pro 15"', quantity: 1, unitPrice: 1000, totalItemPrice: 1000, itemVatAmount: 190 },
      { id: 'item-mock-1b', productName: 'Mouse Inalámbrico Ergo', quantity: 2, unitPrice: 20, totalItemPrice: 40, itemVatAmount: 7.6 },
    ],
    vatRatePercent: 19,
    subTotal: 1040,
    totalVatAmount: 197.6,
    grandTotal: 1237.6,
  },
  {
    id: 'sale-mock-2',
    clientName: 'Ana Pérez',
    saleDate: '2023-10-20T14:45:00Z',
    items: [
      { id: 'item-mock-2a', productName: 'Servicio de Consultoría Tech (5hrs)', quantity: 5, unitPrice: 70, totalItemPrice: 350, itemVatAmount: 66.5 },
    ],
    vatRatePercent: 19,
    subTotal: 350,
    totalVatAmount: 66.5,
    grandTotal: 416.5,
  },
  {
    id: 'sale-mock-3',
    clientName: 'Comercializadora Rápida SpA',
    saleDate: '2023-11-01T09:00:00Z',
    observations: 'Pago confirmado. Despachar a bodega central.',
    items: [
      { id: 'item-mock-3a', productName: 'Teclado Mecánico RGB', quantity: 10, unitPrice: 80, totalItemPrice: 800, itemVatAmount: 152 },
      { id: 'item-mock-3b', productName: 'Monitor Curvo 32"', quantity: 2, unitPrice: 350, totalItemPrice: 700, itemVatAmount: 133 },
    ],
    vatRatePercent: 19,
    subTotal: 1500,
    totalVatAmount: 285,
    grandTotal: 1785,
  },
];


const SalesView: React.FC = () => {
  const [showSaleForm, setShowSaleForm] = useState<boolean>(false);
  const [savedSales, setSavedSales] = useState<Sale[]>(() => {
    try {
      const storedSales = localStorage.getItem(LOCAL_STORAGE_KEY_SALES);
      if (storedSales) {
        const parsedSales = JSON.parse(storedSales) as Sale[];
        if (Array.isArray(parsedSales) && parsedSales.length > 0) {
          return parsedSales;
        }
      }
    } catch (error) {
      console.error("Error loading sales from localStorage:", error);
    }
    return initialMockSales; 
  }); 
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SALES, JSON.stringify(savedSales));
    } catch (error) {
      console.error("Error saving sales to localStorage:", error);
    }
  }, [savedSales]);

  const handleCreateNewSale = useCallback(() => {
    setEditingSale(null); // Asegurarse de que no hay una venta en edición
    setShowSaleForm(true);
  }, []);

  const handleEditSale = useCallback((sale: Sale) => {
    setEditingSale(sale);
    setShowSaleForm(true);
  }, []);

  const handleDeleteSaleRequest = useCallback((sale: Sale) => {
    setSaleToDelete(sale);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDeleteSale = useCallback(() => {
    if (saleToDelete) {
      setSavedSales(prevSales => prevSales.filter(s => s.id !== saleToDelete.id));
      setSaleToDelete(null);
      setShowDeleteConfirmModal(false);
    }
  }, [saleToDelete]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setSaleToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);
  
  const handleSaveSale = useCallback((saleData: Sale) => {
    setSavedSales(prevSales => {
      if (editingSale) { 
        return prevSales.map(s => (s.id === saleData.id ? saleData : s));
      } else { 
        return [...prevSales, saleData];
      }
    });
    setShowSaleForm(false);
    setEditingSale(null); 
  }, [editingSale]);

  const handleCancelSaleForm = useCallback(() => {
    setShowSaleForm(false);
    setEditingSale(null);
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
        saleData={editingSale} // Pasar la venta en edición
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
                          <div className="text-xs text-muted-foreground sm:hidden">{new Date(sale.saleDate).toLocaleDateString()} - Total: {formatCurrencyChilean(sale.grandTotal)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{new Date(sale.saleDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden md:table-cell">{formatCurrencyChilean(sale.subTotal)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden lg:table-cell">{formatCurrencyChilean(sale.totalVatAmount)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary text-right">{formatCurrencyChilean(sale.grandTotal)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                            <button 
                              onClick={() => handleViewSale(sale)} 
                              title="Ver Detalles de Venta" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Ver detalles de venta ${sale.id.substring(0,8)}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleEditSale(sale)} 
                              title="Editar Venta" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Editar venta ${sale.id.substring(0,8)}`}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSaleRequest(sale)} 
                              title="Eliminar Venta" 
                              className="text-destructive hover:text-destructive/80 dark:hover:text-destructive/70 transition-colors p-1 rounded-md hover:bg-destructive/10"
                              aria-label={`Eliminar venta ${sale.id.substring(0,8)}`}
                            >
                              <TrashIcon className="w-5 h-5" />
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
      {showDeleteConfirmModal && saleToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteSale}
          title="Confirmar Eliminación de Venta"
          message={<>¿Estás seguro de que quieres eliminar la venta <strong>ID: {saleToDelete.id.substring(0,8)}...</strong> para el cliente <strong>{saleToDelete.clientName}</strong>? Esta acción no se puede deshacer.</>}
          confirmText="Eliminar Venta"
          confirmButtonClass="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          icon={<TrashIcon className="w-5 h-5 mr-2" />}
        />
      )}
    </>
  );
};

export default SalesView;