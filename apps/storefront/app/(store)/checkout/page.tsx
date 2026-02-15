"use client";

import { Button, Input } from "@artifact/ui";
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, ShoppingCart } from "lucide-react";
import { ClientIcon } from "@/components/client-icon";
import { apiClient } from "@/lib/api";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("WEBPAY");

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
      const payload = {
        items: items.map(i => ({ id: i.id, quantity: i.quantity })),
        total: total,
        customer: isAuthenticated ? { userId: user?.id, tenantId: user?.tenantId } : guestData
      };

      console.log("Processing Order:", payload);

      // 1. Create Sale (Guest or User)
      const res: any = await apiClient.post('/storefront/checkout', payload);
      const createdOrderId = res.id;
      const invoiceNumber = res.invoiceNumber || createdOrderId;

      console.log("Order Created:", createdOrderId);

      // 2. Process Payment
      if (selectedPayment === 'WEBPAY') {
        const returnUrl = `${window.location.origin}/checkout/success`;
        const paymentRes: any = await apiClient.post('/storefront/payments/webpay/init', {
          invoiceId: createdOrderId,
          amount: Math.round(total * 1.19),
          returnUrl
        });

        // Redirect to Webpay
        const form = document.createElement("form");
        form.action = paymentRes.url;
        form.method = "POST";
        const tokenInput = document.createElement("input");
        tokenInput.name = "token_ws";
        tokenInput.value = paymentRes.token;
        form.appendChild(tokenInput);
        document.body.appendChild(form);
        form.submit();

      } else if (selectedPayment === 'MERCADOPAGO') {
        const backUrls = {
          success: `${window.location.origin}/checkout/success`,
          failure: `${window.location.origin}/checkout/failure`,
          pending: `${window.location.origin}/checkout/success`
        };

        const preferenceRes: any = await apiClient.post('/storefront/payments/mercadopago/preference', {
          invoiceId: createdOrderId,
          amount: Math.round(total * 1.19),
          backUrls
        });

        // Redirect to Mercado Pago
        window.location.href = preferenceRes.init_point;
      }

      // Fallback if no redirect happened (should not reach here ideally)
      setOrderId(invoiceNumber);
      // clearCart(); // Don't clear cart yet? Or clear it before redirect? 
      // Ideally clear it, but if user comes back... 
      // For now, let's clear it assuming redirect works.
      clearCart();

    } catch (error) {
      console.error("Checkout failed", error);
      alert("Error al procesar la compra. Por favor intenta nuevamente.");
      setIsLoading(false); // Only stop loading on error, otherwise we are redirecting
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full bg-white/5 p-8 rounded-3xl border border-brand/30 shadow-[0_0_40px_rgba(0,224,116,0.2)]">
          <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto ring-2 ring-brand/50">
            <ClientIcon icon={CheckCircle} className="w-10 h-10 text-brand" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            ¡Compra <span className="text-brand">Exitosa</span>!
          </h1>

          <p className="text-neutral-400">
            Gracias por tu compra. Hemos enviado la confirmación a tu correo.
          </p>

          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
            <p className="text-sm text-neutral-500 mb-1">Orden #</p>
            <p className="text-xl font-mono text-brand">{orderId}</p>
          </div>

          <Link href="/" className="block">
            <Button className="w-full bg-brand text-black hover:shadow-[0_0_20px_rgba(0,224,116,0.4)] transition-all">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center mx-auto">
            <ClientIcon icon={ShoppingCart} className="w-12 h-12 text-brand" />
          </div>

          <h1 className="text-2xl font-bold text-white">Tu carrito está vacío</h1>

          <p className="text-neutral-400">
            Agrega productos para continuar con tu compra
          </p>

          <Link href="/products">
            <Button className="bg-brand text-black hover:shadow-[0_0_20px_rgba(0,224,116,0.4)] transition-all">
              Ver Productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Main Checkout Form
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Finalizar <span className="text-brand">Compra</span>
        </h1>
        <p className="text-neutral-400 mb-8">
          Completa tus datos para procesar el pedido
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Form / Auth */}
          <div className="lg:col-span-2 space-y-6">

            {/* Auth Status Card */}
            <div className={`p-6 rounded-2xl border transition-all ${isAuthenticated
              ? 'bg-brand/10 border-brand/30 shadow-[0_0_20px_rgba(0,224,116,0.1)]'
              : 'bg-white/5 border-white/10'
              }`}>
              {isAuthenticated ? (
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand text-black flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Sesión Iniciada</h3>
                    <p className="text-neutral-300">
                      Comprando como <span className="text-brand font-medium">{user?.email}</span>
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                      Tu compra se asociará a tu cuenta empresarial
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-2xl">
                    👤
                  </div>
                  <h3 className="text-xl font-bold text-white">¿Ya eres cliente?</h3>
                  <p className="text-neutral-400 text-sm">
                    Inicia sesión para asociar esta compra a tu empresa y facturar automáticamente
                  </p>
                  <Link href="/login" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-brand/30 text-brand hover:bg-brand hover:text-black transition-all"
                    >
                      Iniciar Sesión / Registrar Empresa
                    </Button>
                  </Link>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10"></span>
                    </div>
                    <span className="relative bg-black px-2 text-neutral-500 text-xs">
                      O continúa como invitado
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Guest Form (Only if not authenticated) */}
            {!isAuthenticated && (
              <div className="space-y-6">

                {/* Document Type */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Tipo de Documento</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-brand/30 hover:bg-white/5 cursor-pointer transition-all flex-1">
                      <input
                        type="radio"
                        name="documentType"
                        value="BOLETA"
                        checked={guestData.documentType === "BOLETA"}
                        onChange={handleGuestChange}
                        className="accent-brand"
                      />
                      <div>
                        <span className="text-white font-medium block">Boleta</span>
                        <span className="text-xs text-neutral-400">Pasaporte/RUT Personal</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-brand/30 hover:bg-white/5 cursor-pointer transition-all flex-1">
                      <input
                        type="radio"
                        name="documentType"
                        value="FACTURA"
                        checked={guestData.documentType === "FACTURA"}
                        onChange={handleGuestChange}
                        className="accent-brand"
                      />
                      <div>
                        <span className="text-white font-medium block">Factura</span>
                        <span className="text-xs text-neutral-400">Empresa</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Contact & Shipping Info */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Datos de Contacto y Envío</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      name="rut"
                      placeholder={guestData.documentType === 'FACTURA' ? "RUT Empresa" : "RUT / Pasaporte"}
                      value={guestData.rut}
                      onChange={handleGuestChange}
                      className="bg-neutral-900/60 border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
                    />
                    <Input
                      name="name"
                      placeholder={guestData.documentType === 'FACTURA' ? "Razón Social" : "Nombre Completo"}
                      value={guestData.name}
                      onChange={handleGuestChange}
                      className="bg-neutral-900/60 border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
                    />
                  </div>

                  <Input
                    name="email"
                    type="email"
                    placeholder="Correo Electrónico para envío de documento"
                    value={guestData.email}
                    onChange={handleGuestChange}
                    className="bg-neutral-900/60 border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
                  />

                  <div className="border-t border-white/10 pt-4 space-y-4">
                    <p className="text-sm font-medium text-neutral-400">Dirección de Despacho</p>
                    <Input
                      name="address"
                      placeholder="Calle y Número, Depto"
                      value={guestData.address}
                      onChange={handleGuestChange}
                      className="bg-neutral-900/60 border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
                    />
                    <Input
                      name="city"
                      placeholder="Comuna / Ciudad"
                      value={guestData.city}
                      onChange={handleGuestChange}
                      className="bg-neutral-900/60 border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <PaymentMethodSelector
                selected={selectedPayment}
                onSelect={setSelectedPayment}
              />
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 p-6 rounded-2xl bg-white/5 border border-brand/30 shadow-[0_0_30px_rgba(0,224,116,0.1)] backdrop-blur-xl space-y-6">
              <h2 className="text-2xl font-bold text-white">
                Resumen del <span className="text-brand">Pedido</span>
              </h2>

              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-3">
                    <div className="flex gap-2 flex-1 min-w-0">
                      <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center text-xs text-white shrink-0">
                        {item.quantity}
                      </div>
                      <span className="text-neutral-300 text-sm truncate">{item.name}</span>
                    </div>
                    <span className="text-white font-medium text-sm shrink-0">
                      ${(item.price * item.quantity).toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-neutral-400 text-sm">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('es-CL')}</span>
                </div>

                <div className="flex justify-between text-neutral-400 text-sm">
                  <span>Impuestos (19%)</span>
                  <span>${Math.round(total * 0.19).toLocaleString('es-CL')}</span>
                </div>

                <div className="flex justify-between text-neutral-400 text-sm">
                  <span>Envío</span>
                  <span className="text-brand">Gratis</span>
                </div>

                <div className="flex justify-between text-xl font-bold pt-2 mt-2 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-brand">${Math.round(total * 1.19).toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isLoading || (!isAuthenticated && (!guestData.name || !guestData.email))}
                className="w-full h-12 text-lg font-bold bg-brand text-black hover:shadow-[0_0_30px_rgba(0,224,116,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <ClientIcon icon={Loader2} className="animate-spin" />
                ) : (
                  "Confirmar y Pagar"
                )}
              </Button>

              <p className="text-xs text-center text-neutral-500">
                ✓ Transacción segura y encriptada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
