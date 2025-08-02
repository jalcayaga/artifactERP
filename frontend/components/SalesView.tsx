import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importar useRouter
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card'; 
import SaleForm from '@/components/SaleForm';
import SaleDetailModal from '@/components/SaleDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PlusIcon, ShoppingCartIcon, EyeIcon, PencilIcon, TrashIcon, DocumentTextIcon } from '@/components/Icons'; 
import { Sale, UserRole, OrderStatus, Company } from '@/lib/types'; 
import { formatCurrencyChilean } from '@/lib/utils';
import { SaleService } from '@/lib/services/saleService';
import { InvoiceService } from '@/lib/services/invoiceService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


const SalesView: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter(); // Inicializar useRouter
  const [showSaleForm, setShowSaleForm] = useState<boolean>(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);

  const fetchSales = useCallback(async (page: number = 1) => {
    if (!isAuthenticated || (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.EDITOR && currentUser?.role !== UserRole.VIEWER)) {
      setError('No autorizado para ver esta página o no autenticado.');
      setLoading(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
      return;
    }
    setLoading(true);
    try {
      const response = await SaleService.getAllSales(page);
      setSales(response.data);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
      setTotalSales(response.total);
    } catch (err: any) { // Usar 'any' para acceder a 'message'
      console.error('Error fetching sales:', err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login');
      } else {
        setError('Error al cargar las ventas.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, router]); // Añadir isAuthenticated a las dependencias

  useEffect(() => {
    if (!authLoading) {
      fetchSales(currentPage);
    }
  }, [fetchSales, currentPage, authLoading]);

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

  const handleConfirmDeleteSale = useCallback(async () => {
    if (saleToDelete) {
      try {
        // Assuming SaleService will have a delete method
        // await SaleService.deleteSale(saleToDelete.id);
        fetchSales(currentPage);
        setSaleToDelete(null);
        setShowDeleteConfirmModal(false);
      } catch (err: any) {
        console.error('Error deleting sale:', err);
        if (err.message && err.message.includes('Unauthorized')) {
          router.push('/login');
        } else {
          setError('Error al eliminar la venta.');
        }
      }
    }
  }, [saleToDelete, fetchSales, currentPage, router]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setSaleToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);
  
  const handleSaveSale = useCallback(async (saleData: Sale) => {
    try {
      // Assuming this is always for creation now, as editing logic is complex with lots
      // If editing is implemented, it would need to handle lot adjustments (returns, new lots, etc.)
      // For now, we'll just refresh the list after a successful save.
      setShowSaleForm(false);
      setEditingSale(null); 
      fetchSales(currentPage);
    } catch (err: any) {
      console.error("Error saving sale:", err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login');
      } else {
        setError('Error al guardar la venta.');
      }
    }
  }, [fetchSales, currentPage, router]);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      const invoice = await InvoiceService.createInvoiceFromOrder(orderId);
      toast.success(`Factura ${invoice.invoiceNumber} creada exitosamente.`);
      // Optionally, you can navigate to the new invoice page or refresh the sales list
      // to show that the order has been invoiced.
      fetchSales(currentPage);
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      toast.error(error.response?.data?.message || "Error al crear la factura.");
    }
  };

  if (authLoading) {
    return <div className="text-center py-8">Cargando autenticación...</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Cargando ventas...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.EDITOR && currentUser?.role !== UserRole.VIEWER)) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos suficientes.</div>;
  }

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
          <Button
            className="w-full sm:w-auto"
            onClick={handleCreateNewSale}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            <span>Crear Nueva Venta</span>
          </Button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {sales.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>ID Venta</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                      <TableHead className="hidden md:table-cell text-right">Subtotal</TableHead>
                      <TableHead className="hidden lg:table-cell text-right">IVA</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id} className="hover:bg-accent transition-colors duration-150">
                        <TableCell className="font-mono text-muted-foreground">{sale.id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">{sale.company?.name}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{new Date(sale.createdAt).toLocaleDateString()} - Total: {formatCurrencyChilean(sale.grandTotalAmount)}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-right">{formatCurrencyChilean(sale.subTotalAmount)}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-right">{formatCurrencyChilean(sale.vatAmount)}</TableCell>
                        <TableCell className="font-semibold text-primary text-right">{formatCurrencyChilean(sale.grandTotalAmount)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleViewSale(sale)} 
                              title="Ver Detalles de Venta" 
                              aria-label={`Ver detalles de venta ${sale.id.substring(0,8)}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleEditSale(sale)} 
                              title="Editar Venta" 
                              aria-label={`Editar venta ${sale.id.substring(0,8)}`}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleDeleteSaleRequest(sale)} 
                              title="Eliminar Venta" 
                              aria-label={`Eliminar venta ${sale.id.substring(0,8)}`}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </Button>
                            {(sale.status === OrderStatus.DELIVERED || sale.status === OrderStatus.SHIPPED) && !sale.invoice && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGenerateInvoice(sale.id)}
                                title="Generar Factura"
                                aria-label={`Generar factura para la venta ${sale.id.substring(0,8)}`}
                              >
                                <DocumentTextIcon className="w-5 h-5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                  <Button
                    type="button"
                    onClick={handleCreateNewSale}
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Crear Primera Venta</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} (Total: {totalSales} ventas)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
      {viewingSale && (
        <SaleDetailModal 
          sale={viewingSale}
          onClose={handleCloseSaleDetailModal}
          onInvoiceCreated={() => fetchSales(currentPage)}
        />
      )}
      {showDeleteConfirmModal && saleToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteSale}
          title="Confirmar Eliminación de Venta"
          message={<>¿Estás seguro de que quieres eliminar la venta <strong>ID: {saleToDelete.id.substring(0,8)}...</strong> para la empresa <strong>{saleToDelete.company?.name}</strong>? Esta acción no se puede deshacer.</>}
          confirmText="Eliminar Venta"
          confirmButtonClass="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          icon={<TrashIcon className="w-5 h-5 mr-2" />}
        />
      )}
    </>
  );
};

export default SalesView;