import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PurchaseOrderForm from "@/custom-components/PurchaseOrderForm";
import PurchaseOrderDetailModal from "@/custom-components/PurchaseOrderDetailModal";
import { PlusIcon, TruckIcon, EyeIcon } from "@/icons";
import { PurchaseOrder } from "@/types";

const FIXED_VAT_RATE_PERCENT_DISPLAY_PURCHASES = 19;
const LOCAL_STORAGE_KEY_PURCHASE_ORDERS = "wolfflow_purchase_orders";

const PurchasesView: React.FC = () => {
  const [showPurchaseOrderForm, setShowPurchaseOrderForm] =
    useState<boolean>(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const storedOrders = localStorage.getItem(
        LOCAL_STORAGE_KEY_PURCHASE_ORDERS
      );
      return storedOrders ? JSON.parse(storedOrders) : [];
    } catch (error) {
      console.error("Error loading purchase orders from localStorage:", error);
      return [];
    }
  });
  const [viewingPurchaseOrder, setViewingPurchaseOrder] =
    useState<PurchaseOrder | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_PURCHASE_ORDERS,
        JSON.stringify(purchaseOrders)
      );
    } catch (error) {
      console.error("Error saving purchase orders to localStorage:", error);
    }
  }, [purchaseOrders]);

  const handleCreateNewPurchaseOrder = useCallback(() => {
    setShowPurchaseOrderForm(true);
  }, []);

  const handleSavePurchaseOrder = useCallback((orderData: PurchaseOrder) => {
    setPurchaseOrders((prevOrders) => [...prevOrders, orderData]);
    setShowPurchaseOrderForm(false);
  }, []);

  const handleCancelPurchaseOrderForm = useCallback(() => {
    setShowPurchaseOrderForm(false);
  }, []);

  const handleViewPurchaseOrder = useCallback((order: PurchaseOrder) => {
    setViewingPurchaseOrder(order);
  }, []);

  const handleClosePurchaseOrderDetailModal = useCallback(() => {
    setViewingPurchaseOrder(null);
  }, []);

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
      case "Aprobada":
        return "bg-primary/10 text-primary";
      case "Recibida":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
      case "Cancelada":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (showPurchaseOrderForm) {
    return (
      <PurchaseOrderForm
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
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        ID Orden
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Proveedor
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell"
                      >
                        Fecha Orden
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell"
                      >
                        Subtotal (s/IVA)
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell"
                      >
                        IVA ({FIXED_VAT_RATE_PERCENT_DISPLAY_PURCHASES}%)
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {purchaseOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-accent transition-colors duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-muted-foreground">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">
                            {order.supplierName}
                          </div>
                          <div className="text-xs text-muted-foreground sm:hidden">
                            {new Date(order.orderDate).toLocaleDateString()} -
                            Total: ${order.grandTotal.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground lg:hidden">
                            {order.status}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm hidden lg:table-cell">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden md:table-cell">
                          ${order.subTotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-right hidden lg:table-cell">
                          ${order.totalVatAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary text-right">
                          ${order.grandTotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-3">
                            <button
                              onClick={() => handleViewPurchaseOrder(order)}
                              title="Ver Detalles de Orden"
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Ver detalles de orden ${order.id.substring(
                                0,
                                8
                              )}`}
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
                <TruckIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">
                  No hay órdenes de compra registradas
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Comienza creando una nueva orden de compra para verla listada
                  aquí.
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
    </>
  );
};

export default PurchasesView;
