"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button, Input } from "@artifact/ui";
import Link from "next/link";

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
    // Auto-slugify: lowercase, replace spaces with hyphens, remove special chars
    const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, slug: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login Logic (Stub for now, or real if Auth is ready)
        // For SaaS demo, we focus on Register
        await apiClient.post('/auth/login', { email: formData.email, password: formData.password });
        alert("Login exitoso (Simulado/Real)");
        router.push('/');
      } else {
        // Register Logic -> SaaS Onboarding
        const payload = {
          companyName: formData.name,
          email: formData.email,
          password: formData.password,
          slug: formData.slug
        };

        const res: any = await apiClient.post('/tenants/register', payload);
        console.log("Registration Success:", res);

        if (res.order) {
          setSuccessData(res);
        } else {
          alert("Cuenta creada exitosamente. Por favor inicia sesión.");
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-xl border border-green-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">¡Cuenta Creada!</h2>
            <p className="text-gray-600 mb-6">
              Bienvenido a <strong>{successData.tenant.name}</strong>.
            </p>

            <div className="bg-blue-50 p-6 rounded-md text-left mb-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Suscripción Pro Pendiente</h3>
              <p className="text-sm text-blue-800 mb-4">
                Para activar su cuenta, por favor complete el pago de su suscripción.
              </p>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Orden:</span>
                <span className="font-mono font-bold">{successData.order?.id?.slice(0, 8).toUpperCase() || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t border-blue-200 pt-2 mt-2">
                <span className="text-blue-900">Total a Pagar:</span>
                <span className="text-blue-900">
                  ${parseInt(successData.order?.grandTotalAmount || 0).toLocaleString('es-CL')}
                </span>
              </div>
            </div>

            <a
              href={successData.paymentLink || '#'}
              target="_blank"
              className="w-full block bg-brand hover:bg-brand-dark text-white font-bold py-3 px-4 rounded transition duration-200"
              rel="noreferrer"
            >
              Pagar Suscripción
            </a>

            <button
              onClick={() => { setSuccessData(null); setIsLogin(true); }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Iniciar Sesión" : "Registrar Empresa"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    handleChange(e);
                    // Auto-gen slug from name if slug is empty or previously auto-genned
                    if (!formData.slug || formData.slug === formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) {
                      const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      setFormData(prev => ({ ...prev, name: e.target.value, slug: val }));
                      return;
                    }
                  }}
                  required={!isLogin}
                  className="mt-1 block w-full"
                  placeholder="Mi Pyme SpA"
                />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">URL del ERP (Slug)</label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    artifact.cl/
                  </span>
                  <Input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    required={!isLogin}
                    className="block w-full rounded-none rounded-r-md"
                    placeholder="mi-pyme"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Identificador único para tu empresa.</p>
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Administrador</label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full"
              placeholder="admin@empresa.cl"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full py-2" disabled={isLoading}>
            {isLoading ? "Procesando..." : (isLogin ? "Iniciar Sesión" : "Crear Cuenta")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => { setIsLogin((prev) => !prev); setError(""); }}
            className="font-medium text-brand hover:text-brand-dark"
          >
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
