"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@artifact/ui";
import { FormEvent, useState } from "react";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-emerald-100/20 to-white" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-4xl border border-white/60 bg-white/90">
          <CardHeader className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.4em] text-brand">
              Crece sin límites
            </span>
            <CardTitle className="mt-4 font-display text-3xl text-slate-900 md:text-4xl">
              Recibe guías SaaS, estrategias de ecommerce y lanzamientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-xl flex-col gap-4 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="Ingresa tu correo corporativo"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-12 rounded-full border-brand/20 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-brand/40"
              />
              <Button
                type="submit"
                className="h-12 shrink-0 rounded-full bg-brand px-6 text-sm font-semibold text-white hover:bg-brand/90"
              >
                {submitted ? "¡Estás dentro!" : "Quiero recibir novedades"}
              </Button>
            </form>
            {submitted && (
              <p className="mt-4 text-center text-sm text-slate-500">
                Ya estás en la lista. Te enviaremos contenido seleccionado directo a tu bandeja.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
