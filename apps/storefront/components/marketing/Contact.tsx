"use client";

import React, { useState } from 'react';

const Contact = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

        if (webhookUrl) {
            try {
                const payload = {
                    ...data,
                    source: 'artifact.cl',
                    timestamp: new Date().toISOString()
                };

                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } catch (err) {
                console.error("Error sending lead to n8n", err);
            }
        } else {
            console.warn("NEXT_PUBLIC_N8N_WEBHOOK_URL not configured");
        }

        setSubmitStatus('success');
        // @ts-ignore
        if (typeof trackFormSubmit !== 'undefined') trackFormSubmit();

        setTimeout(() => {
            if (e.target instanceof HTMLFormElement) {
                e.target.reset();
            }
            setSubmitStatus('idle');
        }, 4000);
    };

    return (
        <section className="relative overflow-hidden py-24" id="contacto">

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-16 lg:grid-cols-2">

                    {/* Left Column: Value Proposition */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 ring-1 ring-brand/10">
                                <span className="text-sm font-medium text-brand">Diagnóstico Gratuito</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
                                ¿Listo para digitalizar tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-emerald-400">MicroPyME</span>?
                            </h2>
                        </div>

                        <p className="text-lg text-neutral-400 leading-relaxed">
                            Analizamos tu negocio actual y te mostramos el plan exacto para
                            convertirte en líder digital de tu rubro. Sin compromisos.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Hoja de ruta personalizada</h4>
                                    <p className="text-sm text-neutral-400">Plan paso a paso adaptado a tu presupuesto y objetivos.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Proyección de crecimiento</h4>
                                    <p className="text-sm text-neutral-400">Calculamos cuántos clientes nuevos puedes ganar en 90 días.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Comenzamos esta semana</h4>
                                    <p className="text-sm text-neutral-400">No esperamos meses. Tu transformación digital empieza YA.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand to-emerald-400 blur-2xl opacity-10 rounded-3xl" />
                        <div className="relative rounded-3xl border border-white/10 bg-neutral-900/80 p-8 backdrop-blur-xl shadow-2xl">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="nombre" className="text-sm font-medium text-neutral-300">Nombre completo *</label>
                                        <input
                                            type="text"
                                            id="nombre"
                                            name="nombre"
                                            required
                                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-neutral-500 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email corporativo *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-neutral-500 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                                            placeholder="nombre@empresa.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="telefono" className="text-sm font-medium text-neutral-300">WhatsApp *</label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        required
                                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-neutral-500 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                                        placeholder="+56 9 1234 5678"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="negocio" className="text-sm font-medium text-neutral-300">Tipo de negocio</label>
                                    <select
                                        id="negocio"
                                        name="negocio"
                                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all appearance-none"
                                    >
                                        <option value="" className="bg-neutral-900">Selecciona tu rubro</option>
                                        <option value="retail" className="bg-neutral-900">Retail / Tienda</option>
                                        <option value="servicios" className="bg-neutral-900">Servicios profesionales</option>
                                        <option value="restaurante" className="bg-neutral-900">Restaurante / Comida</option>
                                        <option value="belleza" className="bg-neutral-900">Peluquería / Estética</option>
                                        <option value="textil" className="bg-neutral-900">Ropa / Textil</option>
                                        <option value="ferreteria" className="bg-neutral-900">Ferretería / Construcción</option>
                                        <option value="otro" className="bg-neutral-900">Otro</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="objetivo" className="text-sm font-medium text-neutral-300">Principal desafío</label>
                                    <textarea
                                        id="objetivo"
                                        name="objetivo"
                                        rows={3}
                                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-neutral-500 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                                        placeholder="Ej: Necesito más clientes, quiero vender online..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitStatus === 'success'}
                                    className="group w-full relative overflow-hidden rounded-xl bg-brand py-4 text-black font-bold text-lg shadow-lg shadow-brand/20 transition-all hover:scale-[1.02] hover:shadow-brand/40 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {submitStatus === 'success' ? (
                                            <>
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                ¡Solicitud Enviada!
                                            </>
                                        ) : (
                                            <>
                                                Solicitar Diagnóstico Gratis
                                                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                    {submitStatus !== 'success' && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    )}
                                </button>

                                <p className="text-center text-xs text-neutral-500 mt-4">
                                    Te contactaremos en menos de 2 horas. Tus datos están seguros.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
