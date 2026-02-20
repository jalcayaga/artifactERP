import React from 'react';
import { formatCurrencyChilean, Order, OrderItem } from '@artifact/core';
import { formatDate } from '@artifact/core';

interface PosTicketProps {
    order: Order & { orderItems: (OrderItem & { product: { name: string } })[] };
    companyName?: string;
    companyAddress?: string;
    companyRut?: string;
}

export const PosTicket = React.forwardRef<HTMLDivElement, PosTicketProps>(({ order, companyName, companyAddress, companyRut }, ref) => {
    // Basic validation to prevent crashes if order is incomplete
    if (!order) return null;

    return (
        <div ref={ref} className="w-[80mm] p-2 bg-white text-black font-mono text-[10px] leading-tight">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="font-bold text-lg uppercase">{companyName || 'Empresa'}</h1>
                {companyRut && <p>RUT: {companyRut}</p>}
                {companyAddress && <p>{companyAddress}</p>}
                <p className="mt-2">Tickect de Venta #{order.id.slice(-6).toUpperCase()}</p>
                <p>{formatDate(new Date(order.createdAt))}</p>
            </div>

            {/* Items */}
            <div className="border-t border-b border-black py-2 mb-2">
                <div className="flex font-bold mb-1">
                    <span className="w-8">Cant</span>
                    <span className="flex-1">Desc</span>
                    <span className="w-16 text-right">Total</span>
                </div>
                {order.orderItems.map((item, index) => (
                    <div key={index} className="flex mb-1">
                        <span className="w-8">{item.quantity}</span>
                        <span className="flex-1 truncate">{item.product?.name || 'Producto'}</span>
                        <span className="w-16 text-right">{formatCurrencyChilean(item.totalPriceWithVat)}</span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end mb-4">
                <div className="flex w-full justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrencyChilean(order.subTotalAmount)}</span>
                </div>
                <div className="flex w-full justify-between">
                    <span>IVA (19%):</span>
                    <span>{formatCurrencyChilean(order.vatAmount)}</span>
                </div>
                <div className="flex w-full justify-between font-bold text-sm mt-1 border-t border-black pt-1">
                    <span>TOTAL:</span>
                    <span>{formatCurrencyChilean(order.grandTotalAmount)}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[9px]">
                <p>¡Gracias por su compra!</p>
                <p className="mt-1">Copia Cliente</p>
                <p className="mt-2 text-[8px] text-gray-500">Generado por Artifact ERP</p>
            </div>
        </div>
    );
});

PosTicket.displayName = 'PosTicket';
