import React from "react";
import { CreditCard, QrCode } from "lucide-react";
import { ClientIcon } from "@/components/client-icon";

interface PaymentMethodSelectorProps {
    selected: string;
    onSelect: (method: string) => void;
}

export function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Método de Pago</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Webpay Plus */}
                <div
                    onClick={() => onSelect("WEBPAY")}
                    className={`cursor-pointer rounded-xl p-4 border transition-all flex items-center gap-4 ${selected === "WEBPAY"
                            ? "bg-brand/10 border-brand ring-1 ring-brand"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selected === "WEBPAY" ? "bg-brand text-black" : "bg-neutral-800 text-neutral-400"
                        }`}>
                        <ClientIcon icon={CreditCard} className="w-5 h-5" />
                    </div>
                    <div>
                        <p className={`font-medium ${selected === "WEBPAY" ? "text-white" : "text-neutral-300"}`}>
                            Webpay Plus
                        </p>
                        <p className="text-xs text-neutral-500">Débito, Crédito, Prepago</p>
                    </div>
                </div>

                {/* Mercado Pago */}
                <div
                    onClick={() => onSelect("MERCADOPAGO")}
                    className={`cursor-pointer rounded-xl p-4 border transition-all flex items-center gap-4 ${selected === "MERCADOPAGO"
                            ? "bg-blue-500/10 border-blue-500 ring-1 ring-blue-500"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selected === "MERCADOPAGO" ? "bg-blue-500 text-white" : "bg-neutral-800 text-neutral-400"
                        }`}>
                        <ClientIcon icon={QrCode} className="w-5 h-5" />
                    </div>
                    <div>
                        <p className={`font-medium ${selected === "MERCADOPAGO" ? "text-white" : "text-neutral-300"}`}>
                            Mercado Pago
                        </p>
                        <p className="text-xs text-neutral-500">Saldo MP, Tarjetas, QR</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
