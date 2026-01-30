"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button, Input } from "@artifact/ui";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Company Name
    slug: "", // Tenant Slug
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, slug: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await apiClient.post('/auth/login', { email: formData.email, password: formData.password });
        // Simulating login for demo purposes if backend isn't full auth yet
        // In real app, we'd store token here.
        router.push('/');
      } else {
        const payload = {
          companyName: formData.name,
          email: formData.email,
          password: formData.password,
          slug: formData.slug
        };

        const res: any = await apiClient.post('/tenants/register', payload);

        if (res.order) {
          setSuccessData(res);
        } else {
          // Fallback if no order returned
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error inesperado al procesar su solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100 " />
        <div className="absolute inset-x-0 top-[-100px] h-[500px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_70%)] blur-3xl" />

        <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl ring-1 ring-slate-200/60">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100/50 mb-6 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">¡Cuenta Creada!</h2>
            <p className="text-slate-600 mb-8 text-lg">
              Bienvenido a <strong className="text-slate-900">{successData.tenant.name}</strong>.
            </p>

            <div className="bg-slate-50/80 p-6 rounded-2xl text-left mb-8 border border-slate-200/60 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Suscripción Pro</h3>
                  <p className="text-sm text-slate-500">Activación inmediata tras el pago.</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200/60">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Orden de Compra</span>
                  <span className="font-mono font-medium text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">{successData.order?.id?.slice(0, 8).toUpperCase() || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-slate-900">Total a Pagar</span>
                  <span className="text-brand">
                    ${parseInt(successData.order?.grandTotalAmount || 0).toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={successData.paymentLink || '#'}
              target="_blank"
              rel="noreferrer"
              className="group w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5"
            >
              <span>Ir a Pagar y Activar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={() => { setSuccessData(null); setIsLogin(true); }}
              className="mt-6 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100" />
      <div className="absolute inset-x-0 top-[-100px] h-[500px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_70%)] blur-3xl" />

      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl ring-1 ring-slate-200/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            {isLogin ? "Bienvenido de nuevo" : "Comienza gratis"}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {isLogin ? "Accede a tu panel de control ERP" : "Crea tu cuenta y digitaliza tu negocio hoy"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-700 text-sm rounded-xl border border-red-200 shadow-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Nombre de la Empresa</label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    handleChange(e);
                    if (!formData.slug || formData.slug === formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) {
                      const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      setFormData(prev => ({ ...prev, name: e.target.value, slug: val }));
                    }
                  }}
                  required={!isLogin}
                  placeholder="Ej: Comercial Limitada"
                  className="bg-white/50 border-slate-200 focus:bg-white transition-colors h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="slug" className="block text-sm font-semibold text-slate-700">URL del ERP</label>
                <div className="flex shadow-sm rounded-md">
                  <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-slate-200 bg-slate-50/50 text-slate-500 text-sm font-medium">
                    artifact.cl/
                  </span>
                  <Input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    required={!isLogin}
                    className="rounded-l-none bg-white/50 border-slate-200 focus:bg-white transition-colors h-11"
                    placeholder="mi-empresa"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Esta será la dirección web de tu plataforma.</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Corporativo</label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="nombre@empresa.com"
              className="bg-white/50 border-slate-200 focus:bg-white transition-colors h-11"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Contraseña</label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="bg-white/50 border-slate-200 focus:bg-white transition-colors h-11"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-brand hover:bg-brand-dark shadow-lg shadow-brand/20 hover:shadow-brand/30 transition-all hover:-translate-y-0.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</>
            ) : (
              isLogin ? "Iniciar Sesión" : "Crear Cuenta Gratis"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-200/60">
          <p className="text-sm text-slate-600">
            {isLogin ? "¿Aún no tienes cuenta?" : "¿Ya tienes una cuenta?"}{" "}
            <button
              type="button"
              onClick={() => { setIsLogin((prev) => !prev); setError(""); }}
              className="font-bold text-brand hover:text-brand-dark hover:underline transition-colors"
            >
              {isLogin ? "Crea una ahora" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
