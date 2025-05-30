import React, { useState, FormEvent, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { TruckIcon, PlusIcon, TrashIcon } from "@/icons";
import { PurchaseOrderItem, PurchaseOrder } from "@/types";

interface PurchaseOrderFormProps {
  onSave: (orderData: PurchaseOrder) => void;
  onCancel: () => void;
}

const FIXED_VAT_RATE_PERCENT_PURCHASES = 19;

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [supplierName, setSupplierName] = useState("");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [observations, setObservations] = useState("");
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [itemErrors, setItemErrors] = useState<{ [key: string]: string }>({});

  const { subTotal, totalVatAmount, grandTotal } = useMemo(() => {
    const currentSubTotal = items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    const currentTotalVatAmount = items.reduce(
      (total, item) => total + item.itemVatAmount,
      0
    );
    const currentGrandTotal = currentSubTotal + currentTotalVatAmount;
    return {
      subTotal: currentSubTotal,
      totalVatAmount: currentTotalVatAmount,
      grandTotal: currentGrandTotal,
    };
  }, [items]);

  const validateItemForm = (): boolean => {
    const newItmErrors: { [key: string]: string } = {};
    if (!newItemName.trim())
      newItmErrors.name = "El nombre del producto o servicio es requerido.";
    const quantityNum = parseFloat(newItemQuantity);
    if (isNaN(quantityNum) || quantityNum <= 0)
      newItmErrors.quantity = "La cantidad debe ser un número positivo.";
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum < 0)
      newItmErrors.price = "El precio debe ser un número positivo o cero.";
    setItemErrors(newItmErrors);
    return Object.keys(newItmErrors).length === 0;
  };

  const handleAddItem = useCallback(() => {
    if (!validateItemForm()) return;
    const quantity = parseFloat(newItemQuantity);
    const unitPrice = parseFloat(newItemPrice);
    const itemSubTotal = quantity * unitPrice;
    const itemVatAmount =
      itemSubTotal * (FIXED_VAT_RATE_PERCENT_PURCHASES / 100);
    const itemTotalPriceWithVat = itemSubTotal + itemVatAmount;
    const newItem: PurchaseOrderItem = {
      id: `po-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productName: newItemName.trim(),
      quantity,
      unitPrice,
      totalPrice: itemSubTotal,
      itemVatAmount,
      totalPriceWithVat: itemTotalPriceWithVat,
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemPrice("");
    setItemErrors({});
  }, [newItemName, newItemQuantity, newItemPrice]);

  const handleRemoveItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const validateMainForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!supplierName.trim())
      newErrors.supplierName = "El nombre del proveedor es requerido.";
    if (!orderDate) newErrors.orderDate = "La fecha de la orden es requerida.";
    if (items.length === 0)
      newErrors.items = "Debe añadir al menos un artículo a la orden.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateMainForm()) return;
    const orderId = `PO-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const orderDetails: PurchaseOrder = {
      id: orderId,
      supplierName: supplierName.trim(),
      orderDate,
      expectedDeliveryDate: expectedDeliveryDate || undefined,
      observations: observations.trim() || undefined,
      status: "Pendiente",
      items,
      vatRatePercent: FIXED_VAT_RATE_PERCENT_PURCHASES,
      subTotal,
      totalVatAmount,
      grandTotal,
    };
    onSave(orderDetails);
  };

  const inputBaseClass =
    "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground";
  const errorTextClass = "mt-1 text-xs text-destructive";

  return (
    <Card className="max-w-4xl mx-auto border">
      <CardHeader>
        <CardTitle className="text-xl">Crear Nueva Orden de Compra</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label
                htmlFor="po-supplier-name"
                className="block text-sm font-medium text-foreground"
              >
                Proveedor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="po-supplier-name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className={inputBaseClass}
                placeholder="Nombre del proveedor"
                aria-describedby="supplierName-error"
              />
              {errors.supplierName && (
                <p
                  id="supplierName-error"
                  className={errorTextClass}
                >
                  {errors.supplierName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="po-order-date"
                className="block text-sm font-medium text-foreground"
              >
                Fecha de Orden <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="po-order-date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className={inputBaseClass}
                aria-describedby="orderDate-error"
              />
              {errors.orderDate && (
                <p
                  id="orderDate-error"
                  className={errorTextClass}
                >
                  {errors.orderDate}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="po-expected-delivery-date"
                className="block text-sm font-medium text-foreground"
              >
                Fecha Entrega Estimada
              </label>
              <input
                type="date"
                id="po-expected-delivery-date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div className="space-y-4 p-4 border border-border rounded-md bg-card">
            {" "}
            {/* Use card for item section bg */}
            <h3 className="text-md font-semibold text-foreground">
              Artículos de la Orden (IVA {FIXED_VAT_RATE_PERCENT_PURCHASES}%)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-5">
                <label
                  htmlFor="po-item-name"
                  className="block text-xs font-medium text-muted-foreground"
                >
                  Producto / Servicio
                </label>
                <input
                  type="text"
                  id="po-item-name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Nombre del artículo"
                  className={`${inputBaseClass} py-1.5 text-sm`}
                  aria-describedby="poItemName-error"
                />
                {itemErrors.name && (
                  <p
                    id="poItemName-error"
                    className={errorTextClass}
                  >
                    {itemErrors.name}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="po-item-quantity"
                  className="block text-xs font-medium text-muted-foreground"
                >
                  Cant.
                </label>
                <input
                  type="number"
                  id="po-item-quantity"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  placeholder="0"
                  className={`${inputBaseClass} py-1.5 text-sm`}
                  aria-describedby="poItemQuantity-error"
                />
                {itemErrors.quantity && (
                  <p
                    id="poItemQuantity-error"
                    className={errorTextClass}
                  >
                    {itemErrors.quantity}
                  </p>
                )}
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="po-item-price"
                  className="block text-xs font-medium text-muted-foreground"
                >
                  P. Unit. (s/IVA)
                </label>
                <input
                  type="number"
                  id="po-item-price"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className={`${inputBaseClass} py-1.5 text-sm`}
                  aria-describedby="poItemPrice-error"
                />
                {itemErrors.price && (
                  <p
                    id="poItemPrice-error"
                    className={errorTextClass}
                  >
                    {itemErrors.price}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-medium py-2 px-3 rounded-md shadow-sm text-sm flex items-center justify-center space-x-1.5 transition-all"
                  aria-label="Añadir artículo a la orden"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
            {items.length > 0 ? (
              <div className="mt-4 -mx-4 sm:mx-0 overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Producto / Servicio
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Cant.
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        P.Unit (s/IVA)
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Subtotal (s/IVA)
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                        IVA Artículo
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Total Artículo
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-foreground">
                          {item.productName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-foreground text-right">
                          {item.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right hidden sm:table-cell">
                          {item.itemVatAmount.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-foreground text-right">
                          {item.totalPriceWithVat.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            title="Eliminar Artículo"
                            className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground italic py-3">
                Aún no se han añadido artículos a la orden.
              </p>
            )}
            {errors.items && (
              <p className={errorTextClass + " text-center"}>{errors.items}</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border space-y-2">
            <div className="flex justify-end items-center">
              <span className="text-md font-medium text-muted-foreground">
                Subtotal (sin IVA):
              </span>
              <span className="ml-4 text-md font-semibold text-foreground w-32 text-right">
                ${subTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-end items-center">
              <span className="text-md font-medium text-muted-foreground">
                IVA ({FIXED_VAT_RATE_PERCENT_PURCHASES}%):
              </span>
              <span className="ml-4 text-md font-semibold text-foreground w-32 text-right">
                ${totalVatAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-end items-center mt-1 pt-1 border-t border-border/50">
              <span className="text-lg font-bold text-foreground">
                Total Orden:
              </span>
              <span className="ml-4 text-2xl font-bold text-primary w-32 text-right">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="po-observations"
              className="block text-sm font-medium text-foreground"
            >
              Observaciones
            </label>
            <textarea
              id="po-observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
              className={inputBaseClass}
              placeholder="Añadir notas adicionales sobre la orden de compra..."
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2.5 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto order-1 sm:order-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2"
          >
            <TruckIcon className="w-5 h-5" /> <span>Guardar Orden</span>
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PurchaseOrderForm;
