"use client";

import React from "react";
import Drawer from "../ui/Drawer";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../hooks/use-cart";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { ClientIcon } from "../client-icon";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, total, removeItem, updateQuantity } = useCart();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="right">
      <div className="h-full bg-neutral-900 text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white mb-1">
            Tu <span className="text-brand">Carrito</span>
          </h2>
          <p className="text-sm text-neutral-400">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                <ClientIcon icon={ShoppingCart} className="w-10 h-10 text-brand" />
              </div>
              <p className="text-neutral-400 text-center">
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-brand/30 hover:shadow-[0_0_20px_rgba(0,224,116,0.1)] transition-all duration-300"
                >
                  <div className="flex gap-3">
                    {/* Product Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ClientIcon icon={ShoppingCart} className="w-6 h-6 text-neutral-600" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate mb-1">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-brand">
                        ${item.price.toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-neutral-900/50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        aria-label="Disminuir cantidad"
                      >
                        <ClientIcon icon={Minus} className="w-3 h-3 text-white" />
                      </button>

                      <span className="px-2 text-sm font-semibold min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white/5 transition-all"
                        aria-label="Aumentar cantidad"
                      >
                        <ClientIcon icon={Plus} className="w-3 h-3 text-white" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                      aria-label="Eliminar producto"
                    >
                      <ClientIcon icon={Trash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4 bg-neutral-900/50 backdrop-blur-xl">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-400">Total</span>
              <span className="text-2xl font-bold text-brand">
                ${total.toLocaleString('es-CL')}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link href="/checkout" onClick={onClose}>
                <button className="w-full px-6 py-3 rounded-xl bg-brand text-black font-semibold hover:shadow-[0_0_20px_rgba(0,224,116,0.4)] transition-all">
                  Proceder al Pago
                </button>
              </Link>

              <Link href="/cart" onClick={onClose}>
                <button className="w-full px-6 py-3 rounded-xl border border-white/10 text-white hover:border-brand/30 hover:bg-white/5 transition-all">
                  Ver Carrito Completo
                </button>
              </Link>
            </div>

            {/* Trust Indicator */}
            <p className="text-xs text-neutral-500 text-center">
              ✓ Envío gratis en compras sobre $50.000
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
