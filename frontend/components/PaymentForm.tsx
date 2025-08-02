import React, { useState } from 'react';
import { CreatePaymentDto, Invoice, PaymentMethod } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PaymentService } from '@/lib/services/paymentService';
import { toast } from 'sonner';

interface PaymentFormProps {
  invoice: Invoice;
  onSave: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ invoice, onSave, onCancel }) => {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const paymentData: CreatePaymentDto = {
      invoiceId: invoice.id,
      amount,
      paymentMethod,
    };

    try {
      await PaymentService.createPayment(paymentData);
      toast.success('Pago registrado exitosamente');
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Pago para Factura {invoice.invoiceNumber}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="paymentMethod">Método de Pago</Label>
            <Select onValueChange={(value) => setPaymentMethod(value as PaymentMethod)} defaultValue={paymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un método de pago" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PaymentMethod).map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Pago'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PaymentForm;