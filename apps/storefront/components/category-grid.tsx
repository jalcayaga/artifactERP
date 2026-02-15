"use client";
"use client";

import { ArrowUpRight } from "lucide-react";
import { ClientIcon } from "./client-icon";
import { Card, CardContent, CardTitle, Button } from "@artifact/ui";
import Link from "next/link";

const categories = [
  {
    name: "Tiendas físicas con ecommerce",
    description:
      "Sincroniza stock entre tus locales y la tienda online, con reposición automática y control de lotes.",
    href: "/solutions/retail",
    accent: "from-brand/10 via-brand/5 to-white",
  },
  {
    name: "Mayoristas y ventas B2B",
    description:
      "Listas de precios por cliente, pedidos recurrentes, crédito documentado y facturación en un clic.",
    href: "/solutions/b2b",
    accent: "from-emerald-100/40 via-white to-white",
  },
  {
    name: "Servicios y suscripciones",
    description:
      "Reserva online, registra ventas, controla insumos y factura electrónicamente sin salir del panel.",
    href: "/solutions/servicios",
    accent: "from-indigo-100/50 via-white to-white",
  },
];

export function CategoryGrid() {
  return (
    <section className="container mx-auto space-y-10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div className="space-y-3">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">
            Soluciones SaaS
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-[2.7rem] lg:leading-[1.1]">
            Un flujo a la medida de cada pyme
          </h2>
          <p className="text-base text-slate-600 lg:max-w-2xl">
            Artifact se adapta a tu modelo: retail, B2B o servicios. Personaliza catálogos,
            precios y procesos administrativos sin integraciones costosas.
          </p>
        </div>
        <Link href="/solutions" className="mx-auto md:mx-0">
          <Button className="rounded-full border border-brand/30 bg-white px-6 py-3 text-sm font-semibold text-brand shadow hover:border-brand/60">
            Explorar todas las soluciones
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.name}
            className={`relative h-full overflow-hidden border-none bg-gradient-to-br ${category.accent} shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[0_0_30px_rgba(0,224,116,0.1)]`}
          >
            <CardContent className="flex h-full flex-col gap-5 p-7">
              <div className="space-y-3">
                <CardTitle className="text-2xl text-slate-900">
                  {category.name}
                </CardTitle>
                <p className="text-sm leading-relaxed text-slate-600">
                  {category.description}
                </p>
              </div>
              <Link href={category.href} className="mt-auto inline-flex">
                <Button
                  variant="ghost"
                  className="inline-flex items-center gap-2 px-0 text-sm font-semibold text-brand hover:text-brand/80"
                >
                  Ver más
                  <ClientIcon icon={ArrowUpRight} className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
