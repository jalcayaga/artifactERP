'use client';

import React, { useState } from 'react';
import { Invoice, formatCurrencyChilean, PaymentMethod } from '@artifact/core';
import { PaymentService } from '@artifact/core/client';
import {
    Button,
    Input,
    Dialog,
    Typography,
    IconButton,
    Select,
    Option,
    Card
} from "@material-tailwind/react";
import { toast } from 'sonner';
import {
    X,
    Banknote,
    CreditCard,
    Wallet,
    CheckCircle2,
    Clock,
    AlertCircle,
    Hash,
    Save
} from 'lucide-react';

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

    const pendingAmount = invoice.grandTotal - (invoice.amountPaid || 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0 || amount > pendingAmount) {
            toast.error('El monto debe ser válido y no exceder el pendiente.');
            return;
        }

        setIsSubmitting(true);
        try {
            await PaymentService.createPayment({
                invoiceId: invoice.id,
                amount,
                paymentMethod,
                reference,
                paymentDate: new Date().toISOString()
            } as any);
            toast.success('Pago registrado exitosamente');
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error?.message || 'Error al registrar el pago');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
            open={open}
            handler={() => onOpenChange(false)}
            size="sm"
            className="bg-transparent shadow-none"
            placeholder="" 
        >
            <Card className="bg-[#1a2537]/80 backdrop-blur-3xl border border-white/[0.05] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden" placeholder="" >
                {/* Glossy Header */}
                <div className="p-8 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-r from-emerald-600/5 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Banknote className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <Typography variant="h4" color="white" className="font-black uppercase italic tracking-tighter leading-none" placeholder="" >
                                Registrar <span className="text-emerald-500">Pago</span>
                            </Typography>
                            <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2" placeholder="" >
                                <Hash className="w-4 h-4 text-emerald-500/50" /> Factura #{invoice.invoiceNumber}
                            </Typography>
                        </div>
                    </div>
                    <IconButton variant="text" color="white" onClick={() => onOpenChange(false)} className="rounded-full bg-white/5 hover:bg-white/10" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                        <X className="w-6 h-6" />
                    </IconButton>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="space-y-6">
                        {/* Amount Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Monto a Recaudar</label>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                    Pendiente: {formatCurrencyChilean(pendingAmount)}
                                </span>
                            </div>
                            <div className="relative group">
                                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="number"
                                    value={amount}
                                    max={pendingAmount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg font-black text-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none italic"
                                    required
                                />
                            </div>
                        </div>

                        {/* Method Select */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vía de Recepción</label>
                            <Select
                                label="Seleccionar Método"
                                value={paymentMethod}
                                onChange={(val) => setPaymentMethod(val as PaymentMethod)}
                                className="!border-white/10 !bg-white/5 text-white focus:!border-emerald-500 rounded-2xl h-14 font-bold uppercase tracking-widest"
                                labelProps={{ className: "hidden" }}
                            >
                                <Option value={PaymentMethod.BANK_TRANSFER} className="font-bold uppercase text-[10px] tracking-widest py-3 hover:bg-emerald-500/10">Transferencia Bancaria</Option>
                                <Option value={PaymentMethod.CASH} className="font-bold uppercase text-[10px] tracking-widest py-3 hover:bg-emerald-500/10">Efectivo / Caja</Option>
                                <Option value={PaymentMethod.WEBPAY} className="font-bold uppercase text-[10px] tracking-widest py-3 hover:bg-emerald-500/10">Webpay / Transbank</Option>
                            </Select>
                        </div>

                        {/* Reference Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Referencia / Glosa</label>
                            <div className="relative group">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="NRO. OPERACIÓN O COMPROBANTE..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none uppercase tracking-widest"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                        <Button
                            type="submit"
                            variant="gradient"
                            color="emerald"
                            fullWidth
                            size="lg"
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-sm py-5 shadow-xl shadow-emerald-500/20 group h-16"
                            placeholder=""  onResize={undefined} onResizeCapture={undefined}
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    Confirmar Cobro
                                </>
                            )}
                        </Button>
                        <Button
                            variant="text"
                            color="white"
                            fullWidth
                            onClick={() => onOpenChange(false)}
                            className="rounded-2xl font-black uppercase tracking-widest text-xs py-4 opacity-50 hover:opacity-100 transition-opacity"
                            placeholder=""  onResize={undefined} onResizeCapture={undefined}
                        >
                            Regresar
                        </Button>
                    </div>
                </form>
            </Card>
        </Dialog>
    );
};

export default PaymentModal;
