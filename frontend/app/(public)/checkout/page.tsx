// frontend/app/(public)/checkout/page.tsx
'use client';
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { formatCurrencyChilean } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCardIcon, LockClosedIcon, UserCircleIcon, HomeIcon, TruckIcon, ShoppingCartIcon } from '@/components/Icons'; // Added ShoppingCartIcon
import Link from 'next/link';

const CheckoutPage: React.FC = () => {
  const { items, cartTotal, itemCount } = useCart();

  // Form state (basic placeholders for now)
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    name: '', address1: '', city: '', postalCode: '', country: 'Chile'
  });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  // Add more states for billing address, payment method, etc.

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement order submission logic
    alert('Procesamiento de pedido en desarrollo. ¡Gracias por tu paciencia!');
  };
  
  const inputBaseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground";

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingCartIcon className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-2xl font-semibold text-foreground mb-3">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-6">No puedes proceder al pago sin productos en tu carrito.</p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
        >
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <CreditCardIcon className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Finalizar Compra</h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Columna Principal: Formularios */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <UserCircleIcon className="w-6 h-6 mr-2.5 text-primary" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">Correo Electrónico</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBaseClass} placeholder="tu@email.com" required />
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <HomeIcon className="w-6 h-6 mr-2.5 text-primary" />
                Dirección de Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="shipping-name" className="block text-sm font-medium text-foreground">Nombre Completo</label>
                <input type="text" id="shipping-name" value={shippingAddress.name} onChange={e => setShippingAddress({...shippingAddress, name: e.target.value})} className={inputBaseClass} required />
              </div>
              <div>
                <label htmlFor="shipping-address1" className="block text-sm font-medium text-foreground">Dirección (Línea 1)</label>
                <input type="text" id="shipping-address1" value={shippingAddress.address1} onChange={e => setShippingAddress({...shippingAddress, address1: e.target.value})} className={inputBaseClass} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shipping-city" className="block text-sm font-medium text-foreground">Ciudad</label>
                  <input type="text" id="shipping-city" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} className={inputBaseClass} required />
                </div>
                <div>
                  <label htmlFor="shipping-postalCode" className="block text-sm font-medium text-foreground">Código Postal</label>
                  <input type="text" id="shipping-postalCode" value={shippingAddress.postalCode} onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})} className={inputBaseClass} required />
                </div>
              </div>
              <div>
                <label htmlFor="shipping-country" className="block text-sm font-medium text-foreground">País</label>
                <input type="text" id="shipping-country" value={shippingAddress.country} disabled className={`${inputBaseClass} bg-muted/70`} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <TruckIcon className="w-6 h-6 mr-2.5 text-primary" />
                Método de Envío
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">Funcionalidad de selección de método de envío en desarrollo. Por ahora, se asume envío estándar.</p>
              <div className="mt-3 p-3 border border-border rounded-md bg-muted/30">
                <p className="font-medium text-foreground">Envío Estándar</p>
                <p className="text-xs text-muted-foreground">Costo a determinar según dirección.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <CreditCardIcon className="w-6 h-6 mr-2.5 text-primary" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">Integración con pasarela de pago (ej. Webpay, MercadoPago) en desarrollo.</p>
              <div className="mt-3 p-3 border border-dashed border-border rounded-md bg-muted/30 flex items-center justify-center text-muted-foreground">
                <LockClosedIcon className="w-5 h-5 mr-2"/>
                <span>Pasarela de pago segura aparecerá aquí.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Lateral: Resumen del Pedido */}
        <div className="lg:col-span-1">
          <Card className="p-6 border sticky top-24 shadow-lg">
            <CardHeader className="p-0 mb-5">
              <CardTitle className="text-xl font-semibold text-foreground">Resumen de tu Pedido</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between items-start py-2 border-b border-border/50 last:border-b-0">
                  <div className="flex items-center">
                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3 border" />}
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight">{item.name} <span className="text-xs text-muted-foreground">(x{item.quantity})</span></p>
                      {item.installationService && <p className="text-xs text-secondary">+ Instalación</p>}
                    </div>
                  </div>
                  <p className="text-sm text-foreground font-medium whitespace-nowrap">{formatCurrencyChilean(item.price * item.quantity + (item.installationService ? item.installationService.price * item.quantity : 0))}</p>
                </div>
              ))}
              <hr className="border-border my-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal ({itemCount} items):</span>
                <span className="text-foreground font-medium">{formatCurrencyChilean(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Envío:</span>
                <span className="text-foreground font-medium">A calcular</span>
              </div>
              <hr className="border-border my-3" />
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total Estimado:</span>
                <span className="text-primary">{formatCurrencyChilean(cartTotal)}</span>
              </div>
              <button
                type="submit"
                className="mt-6 w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-card"
              >
                <LockClosedIcon className="w-5 h-5 mr-2.5" />
                Realizar Pedido (En Desarrollo)
              </button>
              <p className="text-xs text-muted-foreground text-center mt-2">Serás redirigido a una pasarela de pago segura.</p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;