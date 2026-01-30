"use client";

import { Button, Card, CardContent } from "@artifact/ui";
import Link from "next/link";

const banners = [
  {
    title: "Lanza tu tienda en 48 horas",
    description:
      "Configura catálogo, medios de pago y branding desde un único panel. Sin desarrolladores ni integraciones externas.",
    cta: { label: "Comenzar gratis", href: "/signup" },
    tone: "from-brand/10 via-brand/30 to-brand/60 text-brand-foreground",
  },
  {
    title: "ERP con facturación electrónica",
    description:
      "Registra ventas, controla inventario y emite DTE certificados para el SII con respaldo de Facto.",
    cta: { label: "Ver cómo funciona", href: "/features/erp" },
    tone: "from-[#1D4ED8] via-[#1E3A8A] to-[#111827] text-white",
  },
];

export function PromotionalBanners() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-6 md:grid-cols-2">
        {banners.map((banner) => (
          <Card
            key={banner.title}
            className={`overflow-hidden border-none bg-gradient-to-br ${banner.tone}`}
          >
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-3">{banner.title}</h3>
              <p className="text-sm md:text-base opacity-90 mb-6">
                {banner.description}
              </p>
              <Link href={banner.cta.href}>
                <Button
                  variant="ghost"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  {banner.cta.label}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
