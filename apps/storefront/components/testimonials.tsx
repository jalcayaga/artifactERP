"use client";

import { Card, CardContent } from "@artifact/ui";

const testimonials = [
  {
    quote:
      "En tres semanas activamos nuestro ecommerce con stock sincronizado y DTE automático. Artifact nos ahorró horas cada cierre contable.",
    author: "Josefina Paredes",
    role: "Gerenta Comercial, Red Market",
  },
  {
    quote:
      "Por fin tenemos tienda online, ERP y facturación en una sola plataforma. El soporte nos guía en cada paso del proceso.",
    author: "Carlos Vidal",
    role: "Fundador, Emporio K",
  },
  {
    quote:
      "Nuestro equipo de ventas ahora factura desde el mismo panel donde administra inventario. Artifact es perfecto para pymes con poco tiempo.",
    author: "Fernanda Moyano",
    role: "Directora Ejecutiva, Nexa Labs",
  },
];

export function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">
          Historias reales
        </span>
        <h2 className="mt-4 font-display text-3xl text-slate-900 md:text-4xl">
          Clientes que confían en Artifact
        </h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card
            key={testimonial.author}
            className="relative h-full border-none bg-gradient-to-br from-white via-white to-slate-50/70 shadow-lg shadow-slate-200/60"
          >
            <span className="absolute right-6 top-6 text-5xl font-serif text-brand/30">
              “
            </span>
            <CardContent className="relative flex h-full flex-col gap-6 p-8">
              <p className="text-base leading-relaxed text-slate-600">
                {testimonial.quote}
              </p>
              <div className="mt-auto space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {testimonial.author}
                </p>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  {testimonial.role}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
