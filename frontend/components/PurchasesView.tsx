
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card'; 
import PurchaseOrderForm from '@/components/PurchaseOrderForm';
import PurchaseOrderDetailModal from '@/components/PurchaseOrderDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PlusIcon, TruckIcon, EyeIcon, PencilIcon, TrashIcon } from '@/components/Icons';
import { PurchaseOrder } from '@/lib/types'; 
import { formatCurrencyChilean } from '@/lib/utils';

const FIXED_VAT_RATE_PERCENT_DISPLAY_PURCHASES = 19;
const LOCAL_STORAGE_KEY_PURCHASE_ORDERS = 'wolfflow_purchase_orders';

const initialMockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-mock-1',
    supplierName: 'Proveedor Global SA',
    orderDate: '2023-11-05T09:15:00Z',
    expectedDeliveryDate: '2023-11-15T09:00:00Z',
    status: 'Aprobada',
    items: [
      { id: 'po-item-mock-1a', productName: 'Laptop Pro 15"', quantity: 10, unitPrice: 950, totalPrice: 9500, itemVatAmount: 1805, totalPriceWithVat: 11305 },
      { id: 'po-item-mock-1b', productName: 'Mouse Inalámbrico Ergo', quantity: 20, unitPrice: 15, totalPrice: 300, itemVatAmount: 57, totalPriceWithVat: 357 },
    ],
    vatRatePercent: 19,
    subTotal: 9800,
    totalVatAmount: 1862,
    grandTotal: 11662,
    observations: 'Confirmar recepción con Juan Pérez.',
  },
  {
    id: 'po-mock-2',
    supplierName: 'Insumos Tech Ltda.',
    orderDate: '2023-11-10T11:00:00Z',
    status: 'Pendiente',
    items: [
      { id: 'po-item-mock-2a', productName: 'Teclado Mecánico RGB', quantity: 50, unitPrice: 55, totalPrice: 2750, itemVatAmount: 522.5, totalPriceWithVat: 3272.5 },
    ],
    vatRatePercent: 19,
    subTotal: 2750,
    totalVatAmount: 522.5,
    grandTotal: 3272.5,
  },
  {
    id: 'po-mock-3',
    supplierName: 'Distribuidora OfficeMax',
    orderDate: '2023-10-25T16:30:00Z',
    expectedDeliveryDate: '2023-11-02T09:00:00Z',
    status: 'Recibida',
    items: [
      { id: 'po-item-mock-3a', productName: 'Resma Papel Carta (Caja 10)', quantity: 5, unitPrice: 25, totalPrice: 125, itemVatAmount: 23.75, totalPriceWithVat: 148.75 },
      { id: 'po-item-mock-3b', productName: 'Tóner XL Negro Compatible', quantity: 10, unitPrice: 40, totalPrice: 400, itemVatAmount: 76, totalPriceWithVat: 476 },
    ],
    vatRatePercent: 19,
    subTotal: 525,
    totalVatAmount: 99.75,
    grandTotal: 624.75,
    observations: 'Entregado completo.',
  },
];

const PurchasesView: React.FC = () => {
  const [showPurchaseOrderForm, setShowPurchaseOrderForm] = useState<boolean>(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const storedOrders = localStorage.getItem(LOCAL_STORAGE_KEY_PURCHASE_ORDERS);
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders) as PurchaseOrder[];
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
          return parsedOrders;
        }
      }
    } catch (error) {
      console.error("Error loading purchase orders from localStorage:", error);
    }
    return initialMockPurchaseOrders; 
  }); 
  const [viewingPurchaseOrder, setViewingPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState<PurchaseOrder | null>(null);


  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PURCHASE_ORDERS, JSON.stringify(purchaseOrders));
    } catch (error) {
      console.error("Error saving purchase orders to localStorage:", error);
    }
  }, [purchaseOrders]);

  const handleCreateNewPurchaseOrder = useCallback(() => {
    setEditingPurchaseOrder(null);
    setShowPurchaseOrderForm(true);
  }, []);

  const handleEditPurchaseOrder = useCallback((order: PurchaseOrder) => {
    setEditingPurchaseOrder(order);
    setShowPurchaseOrderForm(true);
  }, []);

  const handleDeletePurchaseOrderRequest = useCallback((order: PurchaseOrder) => {
    setPurchaseOrderToDelete(order);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDeletePurchaseOrder = useCallback(() => {
    if (purchaseOrderToDelete) {
      setPurchaseOrders(prevOrders => prevOrders.filter(o => o.id !== purchaseOrderToDelete.id));
      setPurchaseOrderToDelete(null);
      setShowDeleteConfirmModal(false);
    }
  }, [purchaseOrderToDelete]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setPurchaseOrderToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);

  const handleSavePurchaseOrder = useCallback((orderData: PurchaseOrder) => {
     setPurchaseOrders(prevOrders => {
      if (editingPurchaseOrder) {
        return prevOrders.map(o => (o.id === orderData.id ? orderData : o));
      } else {
        return [...prevOrders, orderData];
      }
    });
    setShowPurchaseOrderForm(false);
    setEditingPurchaseOrder(null);
  }, [editingPurchaseOrder]);

  const handleCancelPurchaseOrderForm = useCallback(() => {
    setShowPurchaseOrderForm(false);
    setEditingPurchaseOrder(null);
  }, []);

  const handleViewPurchaseOrder = useCallback((order: PurchaseOrder) => {
    setViewingPurchaseOrder(order);
  }, []);

  const handleClosePurchaseOrderDetailModal = useCallback(() => {
    setViewingPurchaseOrder(null);
  }, []);

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'Pendiente': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
      case 'Aprobada': return 'bg-primary/10 text-primary';
      case 'Recibida': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      case 'Cancelada': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
          <button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2"
            onClick={handleCreateNewPurchaseOrder}
            aria-label="Crear Nueva Orden de Compra"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Crear Nueva Orden</span>
          </button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {purchaseOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID Orden</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Proveedor</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Fecha Orden</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Estado</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Subtotal (s/IVA)</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">IVA ({FIXED_VAT_RATE_PERCENT_DISPLAY_PURCHASES}%)</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {purchaseOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-accent transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-muted-foreground">{order.id.substring(0, 8)}...</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">{order.supplierName}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{new Date(order.orderDate).toLocaleDateString()} - Total: {formatCurrencyChilean(order.grandTotal)}</div>
                          <div className="text-xs text-muted-foreground lg:hidden">{order.status}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm hidden lg:table-cell">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden md:table-cell">{formatCurrencyChilean(order.subTotal)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden lg:table-cell">{formatCurrencyChilean(order.totalVatAmount)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary text-right">{formatCurrencyChilean(order.grandTotal)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                            <button 
                              onClick={() => handleViewPurchaseOrder(order)} 
                              title="Ver Detalles de Orden" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Ver detalles de orden ${order.id.substring(0,8)}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleEditPurchaseOrder(order)} 
                              title="Editar Orden" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Editar orden ${order.id.substring(0,8)}`}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeletePurchaseOrderRequest(order)} 
                              title="Eliminar Orden" 
                              className="text-destructive hover:text-destructive/80 dark:hover:text-destructive/70 transition-colors p-1 rounded-md hover:bg-destructive/10"
                              aria-label={`Eliminar orden ${order.id.substring(0,8)}`}
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
                <TruckIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">
                  No hay órdenes de compra registradas
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Comienza creando una nueva orden de compra para verla listada aquí.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCreateNewPurchaseOrder}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Crear Primera Orden</span>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
          message={<>¿Estás seguro de que quieres eliminar la orden de compra <strong>ID: {purchaseOrderToDelete.id.substring(0,8)}...</strong> para el proveedor <strong>{purchaseOrderToDelete.supplierName}</strong>? Esta acción no se puede deshacer.</>}
          confirmText="Eliminar Orden"
          confirmButtonClass="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          icon={<TrashIcon className="w-5 h-5 mr-2" />}
        />
      )}
    </>
  );
};

export default PurchasesView;