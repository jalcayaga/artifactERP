"use client";

import { Button, Input } from "@artifact/ui";
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    rut: "",
    documentType: "BOLETA", // BOLETA | FACTURA
    address: "",
    city: "",
  });

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestData({ ...guestData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Prepare payload matching Backend expectation
      const payload = {
        items: items.map(i => ({ id: i.id, quantity: i.quantity })),
        total: total,
        customer: isAuthenticated ? { userId: user?.id, tenantId: user?.tenantId } : guestData
      };

      console.log("Processing Order:", payload);

      // Real API Call
      // Helper to determine endpoint: Authenticated users might use a different flow in future, 
      // but 'createGuestSale' logic handles finding the user internally if not provided, 
      // or we can pass the user ID if we have it.
      // For now, the public endpoint works for both as long as we pass the right data structure.

      const res: any = await apiClient.post('/storefront/checkout', payload);

      // Setup success state from real response
      setOrderId(res.invoiceNumber || res.id || `ORD-${Date.now().toString().slice(-6)}`);
      setIsSuccess(true);
      clearCart();

    } catch (error) {
      console.error("Checkout failed", error);
      alert("Error al procesar la compra. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto p-4 min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md w-full bg-neutral-900/50 p-8 rounded-3xl border border-white/10 checkbox-pattern">
          <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto ring-1 ring-brand/50">
            <CheckCircle className="w-10 h-10 text-brand" />
          </div>
          <h1 className="text-3xl font-bold text-white">¡Compra Exitosa!</h1>
          <p className="text-neutral-400">
            Gracias por tu compra. Hemos enviado la confirmación a tu correo.
          </p>
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <p className="text-sm text-neutral-500 mb-1">Orden #</p>
            <p className="text-xl font-mono text-white">{orderId}</p>
          </div>

          <Link href="/" className="block">
            <Button className="w-full bg-white text-black hover:bg-neutral-200">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h1>
        <Link href="/products">
          <Button className="bg-brand text-black">Ver Productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Form / Auth */}
        <div className="space-y-8">

          {/* Auth Status Card */}
          <div className={`p-6 rounded-2xl border ${isAuthenticated ? 'bg-brand/10 border-brand/20' : 'bg-neutral-900/50 border-white/10'}`}>
            {isAuthenticated ? (
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-brand text-black flex items-center justify-center font-bold text-lg">
                  {user?.firstName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Sesión Iniciada</h3>
                  <p className="text-neutral-400">Comprando como <span className="text-brand">{user?.email}</span></p>
                  <p className="text-xs text-neutral-500 mt-1">Tu compra se asociará a tu cuenta empresarial.</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto pb-1 text-2xl">👤</div>
                <h3 className="text-xl font-bold text-white">¿Ya eres cliente?</h3>
                <p className="text-neutral-400 text-sm">Inicia sesión para asociar esta compra a tu empresa y facturar automáticamente.</p>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full border-brand text-brand hover:bg-brand hover:text-black">
                    Iniciar Sesión / Registrar Empresa
                  </Button>
                </Link>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
                  <span className="relative bg-[#0a0a0a] px-2 text-neutral-500 text-xs">O continúa como invitado</span>
                </div>
              </div>
            )}
          </div>

          {/* Guest Form (Only if not authenticated) */}
          {!isAuthenticated && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4">

              <div className="p-4 bg-neutral-900/50 rounded-xl border border-white/10">
                <h3 className="text-white font-medium mb-3">Tipo de Documento</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="documentType"
                      value="BOLETA"
                      checked={guestData.documentType === "BOLETA"}
                      onChange={handleGuestChange}
                      className="text-brand focus:ring-brand accent-brand"
                    />
                    <span className="text-neutral-300">Boleta (Pasaporte/RUT Personal)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="documentType"
                      value="FACTURA"
                      checked={guestData.documentType === "FACTURA"}
                      onChange={handleGuestChange}
                      className="text-brand focus:ring-brand accent-brand"
                    />
                    <span className="text-neutral-300">Factura (Empresa)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Datos de Contacto y Envío</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="rut" placeholder={guestData.documentType === 'FACTURA' ? "RUT Empresa" : "RUT / Pasaporte"} value={guestData.rut} onChange={handleGuestChange} className="bg-black/50 border-white/10" />
                    <Input name="name" placeholder={guestData.documentType === 'FACTURA' ? "Razón Social" : "Nombre Completo"} value={guestData.name} onChange={handleGuestChange} className="bg-black/50 border-white/10" />
                  </div>
                  <Input name="email" placeholder="Correo Electrónico para envío de documento" value={guestData.email} onChange={handleGuestChange} className="bg-black/50 border-white/10" />

                  <div className="border-t border-white/10 pt-2 mt-2">
                    <p className="text-sm text-neutral-400 mb-2">Dirección de Despacho</p>
                    <Input name="address" placeholder="Calle y Número, Depto" value={guestData.address} onChange={handleGuestChange} className="bg-black/50 border-white/10 mb-4" />
                    <Input name="city" placeholder="Comuna / Ciudad" value={guestData.city} onChange={handleGuestChange} className="bg-black/50 border-white/10" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className="p-4 bg-neutral-900/30 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-2">Método de Pago</h3>
              <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-white/10">
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center text-[10px] font-bold text-black">VISA</div>
                <span className="text-neutral-300 text-sm">Tarjeta terminada en 4242 (Guardada)</span>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:pl-8">
          <div className="bg-neutral-900/60 p-6 rounded-2xl border border-white/10 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-neutral-800 rounded-full flex items-center justify-center text-xs text-white shrink-0 mt-0.5">{item.quantity}</div>
                    <span className="text-neutral-300 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-medium text-sm">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-neutral-400 text-sm">
                <span>Subtotal</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-sm">
                <span>Impuestos (19%)</span>
                <span>${Math.round(total * 0.19).toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 mt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-brand">${Math.round(total * 1.19).toLocaleString('es-CL')}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isLoading || (!isAuthenticated && (!guestData.name || !guestData.email))}
              className="w-full h-12 text-lg font-bold bg-brand text-black hover:bg-emerald-400"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Confirmar y Pagar"}
            </Button>

            <p className="text-xs text-center text-neutral-500 mt-4">
              Transacción segura y encriptada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
