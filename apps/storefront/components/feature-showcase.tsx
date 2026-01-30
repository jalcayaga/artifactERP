"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@artifact/ui";
import {
  Cog,
  ShieldCheck,
  BarChart3,
  PackageCheck,
} from "lucide-react";

const features = [
  {
    title: "Automatiza tu operación",
    description:
      "Gestión centralizada de inventario, compras, precios y fulfillment. Sin planillas, sin integraciones frágiles.",
    Icon: Cog,
  },
  {
    title: "Cumplimiento fiscal al día",
    description:
      "Emite boletas y facturas electrónicas certificadas para el SII con respaldo Facto y control de estados en línea.",
    Icon: ShieldCheck,
  },
  {
    title: "Decisiones con datos en tiempo real",
    description:
      "Paneles claros de ventas, cobranza y márgenes. Analiza tendencias por sucursal, canal y método de pago.",
    Icon: BarChart3,
  },
  {
    title: "Logística conectada",
    description:
      "Sincroniza bodegas físicas y eCommerce, genera compras automáticas y evita quiebres de stock.",
    Icon: PackageCheck,
  },
];

export function FeatureShowcase() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,255,0.18),_transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-[-200px] h-[400px] bg-[radial-gradient(circle,_rgba(45,212,191,0.15),_transparent_65%)] blur-3xl" />
      <div className="relative container mx-auto space-y-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center text-white/90">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
            SaaS listo para escalar
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-[2.8rem] lg:leading-[1.15]">
            Todo lo que necesitas para vender, facturar y crecer
          </h2>
          <p className="mt-6 text-base text-white/70">
            Unifica tu tienda online con un ERP diseñado para pymes chilenas. Administra stock,
            ventas, compras y DTE desde un solo panel, con procesos automatizados de punta a punta.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title, description }) => (
            <Card
              key={title}
              className="h-full border-none bg-white/5 backdrop-blur-md text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <CardHeader className="flex flex-col gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <CardTitle className="text-lg font-semibold text-white">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-white/70">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
