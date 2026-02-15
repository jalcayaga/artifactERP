"use client";

import { Button } from "@artifact/ui";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { ClientIcon } from "@/components/client-icon";

export default function CheckoutFailurePage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md w-full bg-white/5 p-8 rounded-3xl border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto ring-2 ring-red-500/50">
                    <ClientIcon icon={XCircle} className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold text-white">
                    ¡Pago <span className="text-red-500">Fallido</span>!
                </h1>

                <p className="text-neutral-400">
                    Hubo un problema al procesar tu pago. No se ha realizado ningún cargo.
                </p>

                <div className="space-y-3">
                    <Link href="/checkout" className="block">
                        <Button className="w-full bg-white text-black hover:bg-neutral-200 transition-all">
                            Intentar Nuevamente
                        </Button>
                    </Link>

                    <Link href="/" className="block">
                        <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10 transition-all">
                            Volver al Inicio
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
