"use client";

import Link from "next/link";
import { Button } from "@artifact/ui";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100" />
      <div className="absolute inset-x-0 top-[-120px] h-[420px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_65%)] blur-3xl" />
      <div className="relative container mx-auto flex flex-col gap-12 px-4 py-20 sm:px-6 md:py-24 lg:px-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Ecommerce · ERP · DTE
          </span>
          <h1 className="font-display text-4xl leading-tight text-slate-900 md:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
            Tu tienda online con ERP y facturación electrónica en un solo lugar
          </h1>
          <p className="text-base text-slate-600 md:text-lg">
            Artifact conecta tu ecommerce con inventario, ventas, compras y emisión
            de documentos tributarios certificados para Chile. Lanza en días, no en meses.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/signup" className="inline-flex">
              <Button className="rounded-full bg-brand px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand/90">
                Comenzar demo gratuita
              </Button>
            </Link>
            <Link href="/demo" className="inline-flex">
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-8 py-6 text-base font-semibold text-slate-700 hover:border-brand hover:text-brand"
              >
                Ver recorrido guiado
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 text-left text-sm text-slate-500 sm:grid-cols-4">
            {[
              "Onboarding en 48 hrs",
              "Inventario multi-bodega",
              "DTE certificado SII",
              "Soporte humano en Chile",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm shadow-slate-200/60"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-md self-center lg:max-w-lg">
          <div className="glass-surface relative rounded-[32px] p-6">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/70 to-white/30" />
            <div className="relative space-y-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Ventas del mes
                </p>
                <p className="text-3xl font-semibold text-slate-900">$128M</p>
                <p className="text-xs font-medium text-emerald-500">
                  +18% vs. mes anterior
                </p>
              </div>
              <div className="grid gap-4 rounded-2xl bg-slate-900 text-white/90 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60">
                      DTE emitidos
                    </p>
                    <p className="text-2xl font-semibold">1.845</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                    100% aprobados SII
                  </span>
                </div>
                <p className="text-sm text-white/70">
                  Facto sincroniza el envío al SII sin salir de Artifact.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200">
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Locales conectados
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">6</p>
                  <p className="text-xs text-slate-500">
                    Stock sincronizado al minuto
                  </p>
                </div>
                <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200">
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Pedidos B2B
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">312</p>
                  <p className="text-xs text-slate-500">
                    Pedidos recurrentes automatizados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
