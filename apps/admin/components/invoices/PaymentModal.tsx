'use client';

import React, { useState } from 'react';
import {
    Invoice,
    PaymentService,
    formatCurrencyChilean,
    PaymentMethod
} from '@artifact/core';
import {
    Button,
    Input,
    Label,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@artifact/ui';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PaymentModalProps {
    invoice: Invoice;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    invoice,
    open,
    onOpenChange,
    onSuccess
}) => {
    const [amount, setAmount] = useState<number>(invoice.grandTotal - (invoice.amountPaid || 0));
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);
    const [reference, setReference] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await PaymentService.createPayment({
                invoiceId: invoice.id,
                amount,
                paymentMethod,
                reference,
                paymentDate: new Date().toISOString()
            } as any); // Cast for build-time safety
            toast.success('Pago registrado exitosamente');
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Error recording payment:', error);
            toast.error(error?.message || 'Error al registrar el pago');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Pago - {invoice.invoiceNumber}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Monto a pagar</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            required
                            min={1}
                            max={invoice.grandTotal}
                        />
                        <p className="text-xs text-muted-foreground">
                            Pendiente: {formatCurrencyChilean(invoice.grandTotal - (invoice.amountPaid || 0))}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Método de Pago</Label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value={PaymentMethod.BANK_TRANSFER}>Transferencia</option>
                            <option value={PaymentMethod.CASH}>Efectivo</option>
                            <option value={PaymentMethod.WEBPAY}>Webpay</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Referencia / Comprobante</Label>
                        <Input
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Nro. de transferencia o similar"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Registrar Pago
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
