// frontend/components/ecommerce/CheckoutView.tsx
'use client';
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/lib/types';
import { formatCurrencyChilean } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderService } from '@/lib/services/orderService';
import { useRouter } from 'next/navigation';

const CheckoutView: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { currentUser, token } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: currentUser?.email || '',
    name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'Chile', // Default to Chile
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState(''); // New state for payment method

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError('Debes iniciar sesión para completar el pedido.');
      setLoading(false);
      return;
    }

    if (items.length === 0) {
      setError('Tu carrito está vacío.');
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      setError('Por favor, selecciona un método de pago.');
      setLoading(false);
      return;
    }

    try {
      const orderItems = items.map((item: CartItem) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const createOrderDto = {
        items: orderItems,
        shippingAddress: {
          name: formData.name,
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod, // Include payment method
        customerNotes: '', // Optional: Add a field for notes if needed
        // shippingAmount, discountAmount, vatRatePercent, currency can be added if applicable
      };

      const newOrder = await OrderService.createOrder(createOrderDto, token);
      clearCart();
      router.push(`/order-confirmation?orderId=${newOrder.id}`);
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-center mb-8 md:mb-12">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto y Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input type="email" id="email" placeholder="tucorreo@ejemplo.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input type="text" id="name" placeholder="Juan Pérez" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="address1">Dirección de Envío (Línea 1)</Label>
                  <Input type="text" id="address1" placeholder="Calle Falsa 123" value={formData.address1} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="address2">Dirección de Envío (Línea 2 - Opcional)</Label>
                  <Input type="text" id="address2" placeholder="Depto, oficina, etc." value={formData.address2} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input type="text" id="city" placeholder="Santiago" value={formData.city} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input type="text" id="postalCode" placeholder="Ej: 7500000" value={formData.postalCode} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="country">País</Label>
                  <Input type="text" id="country" placeholder="Chile" value={formData.country} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input type="tel" id="phone" placeholder="+56912345678" value={formData.phone} onChange={handleChange} required />
                </div>
                {/* Payment Method Selection */}
                <div>
                  <Label htmlFor="paymentMethod">Método de Pago</Label>
                  <Select onValueChange={handlePaymentMethodChange} value={paymentMethod} required>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Selecciona un método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="debit_card">Tarjeta de Débito</SelectItem>
                      <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading || items.length === 0 || !paymentMethod}>
                  {loading ? 'Procesando...' : 'Realizar Pedido'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item: CartItem) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p>{formatCurrencyChilean(item.price * item.quantity)}</p>
                  </div>
                ))}
                <hr className="border-border my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>{formatCurrencyChilean(cartTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
