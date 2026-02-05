"use client";

import Link from "next/link";
import { Button } from "@artifact/ui";
import { useTenant } from "@/hooks/use-tenant";

export function HeroSection() {
  const { tenant } = useTenant();
  const storeName = tenant?.tenant?.name || "Nuestra Tienda";

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100" />
      <div className="absolute inset-x-0 top-[-120px] h-[420px] bg-[radial-gradient(circle_at_top,rgba(var(--color-brand),0.15),transparent_65%)] blur-3xl opacity-50" />
      <div className="relative container mx-auto flex flex-col items-center gap-8 px-4 py-20 sm:px-6 md:py-28 lg:px-8 text-center">

        <span className="inline-flex items-center rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
          Nueva Colección
        </span>

        <h1 className="max-w-4xl font-display text-4xl leading-tight text-slate-900 md:text-6xl lg:text-[4rem] lg:leading-[1.1]">
          Bienvenido a <span className="text-brand">{storeName}</span>
        </h1>

        <p className="max-w-2xl text-base text-slate-600 md:text-xl leading-relaxed">
          Descubre nuestra selección exclusiva de productos pensados para ti.
          Calidad, estilo y el mejor servicio en cada pedido.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link href="#products-grid">
            <Button className="rounded-full bg-brand px-10 py-7 text-lg font-semibold text-white shadow-xl shadow-brand/20 hover:bg-brand/90 hover:-translate-y-1 transition-all">
              Ver Catálogo
            </Button>
          </Link>
          <Button variant="ghost" className="rounded-full px-8 py-7 text-lg text-slate-600 hover:text-brand">
            Ofertas Especiales
          </Button>
        </div>

      </div>
    </section>
  );
}
