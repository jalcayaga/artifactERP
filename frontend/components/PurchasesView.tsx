import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importar useRouter
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card'; 
import PurchaseOrderForm from '@/components/PurchaseOrderForm';
import PurchaseOrderDetailModal from '@/components/PurchaseOrderDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PlusIcon, TruckIcon, EyeIcon, PencilIcon, TrashIcon } from '@/components/Icons';
import { Purchase, CreatePurchaseDto, UpdatePurchaseDto, UserRole } from '@/lib/types'; 
import { formatCurrencyChilean } from '@/lib/utils';
import { PurchaseService } from '@/lib/services/purchaseService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const PurchasesView: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter(); // Inicializar useRouter
  const [showPurchaseOrderForm, setShowPurchaseOrderForm] = useState<boolean>(false);
  const [purchaseOrders, setPurchaseOrders] = useState<Purchase[]>([]);
  const [viewingPurchaseOrder, setViewingPurchaseOrder] = useState<Purchase | null>(null);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<Purchase | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPurchases, setTotalPurchases] = useState(0);

  const fetchPurchases = useCallback(async (page: number = 1) => {
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
      const response = await PurchaseService.getAllPurchases(page);
      setPurchaseOrders(response.data);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
      setTotalPurchases(response.total);
    } catch (err: any) {
      console.error('Error fetching purchases:', err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login');
      } else {
        setError('Error al cargar las órdenes de compra.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, router]);

  useEffect(() => {
    if (!authLoading) {
      fetchPurchases(currentPage);
    }
  }, [fetchPurchases, currentPage, authLoading]);

  const handleCreateNewPurchaseOrder = useCallback(() => {
    setEditingPurchaseOrder(null);
    setShowPurchaseOrderForm(true);
  }, []);

  const handleEditPurchaseOrder = useCallback((order: Purchase) => {
    setEditingPurchaseOrder(order);
    setShowPurchaseOrderForm(true);
  }, []);

  const handleDeletePurchaseOrderRequest = useCallback((order: Purchase) => {
    setPurchaseOrderToDelete(order);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDeletePurchaseOrder = useCallback(async () => {
    if (purchaseOrderToDelete) {
      try {
        await PurchaseService.deletePurchase(purchaseOrderToDelete.id);
        fetchPurchases(currentPage);
        setPurchaseOrderToDelete(null);
        setShowDeleteConfirmModal(false);
      } catch (err: any) {
        console.error('Error deleting purchase order:', err);
        if (err.message && err.message.includes('Unauthorized')) {
          router.push('/login');
        } else {
          setError('Error al eliminar la orden de compra.');
        }
      }
    }
  }, [purchaseOrderToDelete, fetchPurchases, currentPage, router]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setPurchaseOrderToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);

  const handleSavePurchaseOrder = useCallback(async (orderData: Purchase) => {
    try {
      const { id, supplier, createdAt, updatedAt, ...dto } = orderData;
      if (editingPurchaseOrder) {
        await PurchaseService.updatePurchase(editingPurchaseOrder.id, dto as UpdatePurchaseDto);
      } else {
        await PurchaseService.createPurchase(dto as CreatePurchaseDto);
      }
      setShowPurchaseOrderForm(false);
      setEditingPurchaseOrder(null);
      fetchPurchases(currentPage);
    } catch (err: any) {
      console.error('Error saving purchase order:', err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login');
      } else {
        setError('Error al guardar la orden de compra.');
      }
    }
  }, [editingPurchaseOrder, fetchPurchases, currentPage, router]);

  const handleCancelPurchaseOrderForm = useCallback(() => {
    setShowPurchaseOrderForm(false);
    setEditingPurchaseOrder(null);
  }, []);

  const handleViewPurchaseOrder = useCallback((order: Purchase) => {
    setViewingPurchaseOrder(order);
  }, []);

  const handleClosePurchaseOrderDetailModal = useCallback(() => {
    setViewingPurchaseOrder(null);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
      case 'RECEIVED': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      case 'CANCELLED': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (authLoading) {
    return <div className="text-center py-8">Cargando autenticación...</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Cargando órdenes de compra...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.EDITOR && currentUser?.role !== UserRole.VIEWER)) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos suficientes.</div>;
  }

  if (showPurchaseOrderForm) {
    return (
      <PurchaseOrderForm 
        orderData={editingPurchaseOrder}
        onSave={handleSavePurchaseOrder}
        onCancel={handleCancelPurchaseOrderForm}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Gestión de Compras
          </h1>
          <Button
            className="w-full sm:w-auto"
            onClick={handleCreateNewPurchaseOrder}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            <span>Crear Nueva Orden</span>
          </Button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {purchaseOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>ID Orden</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead className="hidden sm:table-cell">Fecha Orden</TableHead>
                      <TableHead className="hidden lg:table-cell">Estado</TableHead>
                      <TableHead className="hidden md:table-cell text-right">Subtotal (s/IVA)</TableHead>
                      <TableHead className="hidden lg:table-cell text-right">IVA</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-accent transition-colors duration-150">
                        <TableCell className="font-mono text-muted-foreground">{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">{order.supplier?.name}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{new Date(order.purchaseDate).toLocaleDateString()} - Total: {formatCurrencyChilean(order.grandTotal)}</div>
                          <div className="text-xs text-muted-foreground lg:hidden">{order.status}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{new Date(order.purchaseDate).toLocaleDateString()}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(order.status)}`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-right">{formatCurrencyChilean(order.subTotalAmount)}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-right">{formatCurrencyChilean(order.totalVatAmount)}</TableCell>
                        <TableCell className="font-semibold text-primary text-right">{formatCurrencyChilean(order.grandTotal)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleViewPurchaseOrder(order)} 
                              title="Ver Detalles de Orden" 
                              aria-label={`Ver detalles de orden ${order.id.substring(0,8)}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleEditPurchaseOrder(order)} 
                              title="Editar Orden" 
                              aria-label={`Editar orden ${order.id.substring(0,8)}`}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleDeletePurchaseOrderRequest(order)} 
                              title="Eliminar Orden" 
                              aria-label={`Eliminar orden ${order.id.substring(0,8)}`}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <TruckIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">
                  No hay órdenes de compra registradas
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Comienza creando una nueva orden de compra para verla listada aquí.
                </p>
                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={handleCreateNewPurchaseOrder}
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Crear Primera Orden</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} (Total: {totalPurchases} órdenes)
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
      {viewingPurchaseOrder && (
        <PurchaseOrderDetailModal 
          order={viewingPurchaseOrder}
          onClose={handleClosePurchaseOrderDetailModal}
        />
      )}
      {showDeleteConfirmModal && purchaseOrderToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeletePurchaseOrder}
          title="Confirmar Eliminación de Orden"
          message={<>¿Estás seguro de que quieres eliminar la orden de compra <strong>ID: {purchaseOrderToDelete.id.substring(0,8)}...</strong> para el proveedor <strong>{purchaseOrderToDelete.supplier?.name}</strong>? Esta acción no se puede deshacer.</>}
          confirmText="Eliminar Orden"
          confirmButtonClass="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          icon={<TrashIcon className="w-5 h-5 mr-2" />}
        />
      )}
    </>
  );
};

export default PurchasesView;