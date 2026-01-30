"use client";

import React from "react";
import Drawer from "../ui/Drawer";
import { Button } from "@artifact/ui";
import Link from "next/link";
import { useCart } from "../../hooks/use-cart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, total, removeItem } = useCart();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="right">
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-slate-900">Tu carrito</h2>
          <p className="text-sm text-slate-500">
            Productos reservados durante 15 minutos. Completa tu pago para asegurar stock.
          </p>
        </div>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Tu carrito está vacío.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-3 shadow-sm">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    ${Number(item.price * item.quantity).toLocaleString("es-CL")}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-medium text-rose-500 hover:text-rose-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-sm font-semibold text-slate-500">Total</span>
              <span className="text-lg font-semibold text-slate-900">
                ${Number(total).toLocaleString("es-CL")}
              </span>
            </div>
            <div className="space-y-3 pt-2">
              <Link href="/cart" onClick={onClose}>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-slate-200 text-sm font-semibold"
                >
                  Ver carrito
                </Button>
              </Link>
              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full rounded-full bg-brand text-sm font-semibold text-white hover:bg-brand/90">
                  Proceder al pago
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
