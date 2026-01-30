"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@artifact/ui";
import Link from "next/link";

export default function CartPage() {
  const { items, total, removeItem, clearCart } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-xl text-gray-600 mb-4">Tu carrito está vacío.</p>
          <Link href="/products">
            <Button>Explorar Productos</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-gray-600">Cantidad: {item.quantity}</p>
                  <p className="text-gray-600">Precio Unitario: ${item.price}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-xl">${item.price * item.quantity}</p>
                  <Button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${total}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full">Proceder al Pago</Button>
            </Link>
            <Button
              onClick={clearCart}
              className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Vaciar Carrito
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
