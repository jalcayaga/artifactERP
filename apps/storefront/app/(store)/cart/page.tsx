"use client";

import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Minus, Plus, Trash2, Tag } from "lucide-react";
import { ClientIcon } from "@/components/client-icon";
import { useState } from "react";

export default function CartPage() {
  const { items, total, removeItem, clearCart, updateQuantity } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
  } | null>(null);

  const applyDiscount = () => {
    // Demo discount codes
    const discounts: Record<string, number> = {
      "WELCOME10": 10000,
      "SAVE20": 20000,
      "PROMO50": 50000,
    };

    const upperCode = discountCode.toUpperCase();
    if (discounts[upperCode]) {
      setAppliedDiscount({
        code: upperCode,
        amount: discounts[upperCode],
      });
      setDiscountCode("");
    } else {
      alert("Código de descuento inválido");
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
  };

  const subtotal = total;
  const discountAmount = appliedDiscount?.amount || 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Tu Carrito de <span className="text-brand">Compras</span>
          </h1>
          <p className="text-neutral-400">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center mb-6">
              <ClientIcon icon={ShoppingCart} className="w-12 h-12 text-brand" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Tu carrito está vacío
            </h3>

            <p className="text-neutral-400 mb-6 text-center max-w-md">
              Descubre productos increíbles en nuestra tienda y comienza a comprar
            </p>

            <Link
              href="/products"
              className="px-6 py-3 rounded-xl bg-brand text-black font-semibold hover:shadow-[0_0_20px_rgba(0,224,116,0.4)] transition-all"
            >
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/30 hover:shadow-[0_0_30px_rgba(0,224,116,0.15)] transition-all duration-300"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ClientIcon icon={ShoppingCart} className="w-8 h-8 text-neutral-600" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                      <p className="text-2xl font-bold text-brand">
                        ${item.price.toLocaleString('es-CL')}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-neutral-900/50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          aria-label="Disminuir cantidad"
                        >
                          <ClientIcon icon={Minus} className="w-4 h-4 text-white" />
                        </button>

                        <span className="px-3 font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-white/5 transition-all"
                          aria-label="Aumentar cantidad"
                        >
                          <ClientIcon icon={Plus} className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                      >
                        <ClientIcon icon={Trash2} className="w-4 h-4" />
                        <span className="text-sm font-medium">Eliminar</span>
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Subtotal</span>
                    <span className="text-lg font-bold text-white">
                      ${(item.price * item.quantity).toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full px-4 py-3 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              >
                Vaciar Carrito
              </button>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 p-6 rounded-2xl bg-white/5 border border-brand/30 shadow-[0_0_30px_rgba(0,224,116,0.1)] backdrop-blur-xl space-y-6">
                <h2 className="text-2xl font-bold text-white">
                  Resumen del <span className="text-brand">Pedido</span>
                </h2>

                {/* Discount Code Input */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                    <ClientIcon icon={Tag} className="w-4 h-4" />
                    Código de descuento
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="WELCOME10"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && applyDiscount()}
                      className="flex-1 px-4 py-2 rounded-lg bg-neutral-900/60 border border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                    />

                    <button
                      onClick={applyDiscount}
                      disabled={!discountCode}
                      className="px-4 py-2 rounded-lg bg-brand/10 border border-brand/20 text-brand hover:bg-brand/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Aplicar
                    </button>
                  </div>

                  {appliedDiscount && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-brand/10 border border-brand/20">
                      <div className="flex items-center gap-2">
                        <ClientIcon icon={Tag} className="w-4 h-4 text-brand" />
                        <span className="text-sm font-medium text-brand">
                          {appliedDiscount.code}
                        </span>
                      </div>
                      <button
                        onClick={removeDiscount}
                        className="text-xs text-brand hover:text-brand/80"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>

                {/* Summary Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('es-CL')}</span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-brand">
                      <span>Descuento ({appliedDiscount.code})</span>
                      <span>-${appliedDiscount.amount.toLocaleString('es-CL')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400">
                    <span>Envío</span>
                    <span className="text-brand">Gratis</span>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-brand">${finalTotal.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="block w-full px-6 py-3 rounded-xl bg-brand text-black font-semibold text-center hover:shadow-[0_0_20px_rgba(0,224,116,0.4)] transition-all"
                  >
                    Proceder al Pago
                  </Link>

                  <Link
                    href="/products"
                    className="block w-full px-6 py-3 rounded-xl border border-white/10 text-white text-center hover:border-brand/30 hover:bg-white/5 transition-all"
                  >
                    Seguir Comprando
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-neutral-500">
                  <p>✓ Envío gratis en compras sobre $50.000</p>
                  <p>✓ Devoluciones gratis hasta 30 días</p>
                  <p>✓ Pago seguro con encriptación SSL</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
