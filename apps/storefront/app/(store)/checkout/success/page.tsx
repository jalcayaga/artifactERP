"use client";

import { Button } from "@artifact/ui";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { ClientIcon } from "@/components/client-icon";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token_ws"); // Webpay
    const status = searchParams.get("status"); // Mercado Pago
    // In a real app, verify the token via API here if not already done by webhook/polling

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md w-full bg-white/5 p-8 rounded-3xl border border-brand/30 shadow-[0_0_40px_rgba(0,224,116,0.2)]">
                <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto ring-2 ring-brand/50">
                    <ClientIcon icon={CheckCircle} className="w-10 h-10 text-brand" />
                </div>

                <h1 className="text-3xl font-bold text-white">
                    ¡Pago <span className="text-brand">Exitoso</span>!
                </h1>

                <p className="text-neutral-400">
                    Tu pago ha sido procesado correctamente. Hemos enviado el comprobante a tu correo.
                </p>

                {token && (
                    <p className="text-xs text-neutral-600 font-mono">Token: {token.slice(0, 10)}...</p>
                )}
                {status && (
                    <p className="text-xs text-neutral-600 font-mono">Estado MP: {status}</p>
                )}

                <Link href="/" className="block">
                    <Button className="w-full bg-brand text-black hover:shadow-[0_0_20px_rgba(0,224,116,0.4)] transition-all">
                        Volver al Inicio
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
