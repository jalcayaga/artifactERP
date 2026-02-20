'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Mail, Lock, Building2, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@artifact/ui';
import SpaceInvadersBackground from '@/components/SpaceInvadersBackground';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        companyName: '',
        password: '',
        slug: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSlugAutoFill = (name: string) => {
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, companyName: name, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/trial`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear la cuenta de prueba');
            }

            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[rgb(var(--bg-primary))] flex items-center justify-center p-6 text-center transition-colors duration-500">
                <SpaceInvadersBackground />
                <Card className="max-w-md bg-[rgba(var(--bg-secondary),0.6)] border-[rgba(var(--brand-color),0.2)] backdrop-blur-3xl p-10 rounded-[2.5rem] relative z-20 shadow-2xl">
                    <div className="w-20 h-20 bg-[rgb(var(--brand-color))]/10 rounded-full mx-auto mb-6 flex items-center justify-center text-[rgb(var(--brand-color))] animate-bounce">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-[rgb(var(--text-primary))] mb-4 font-space-grotesk">¡Cuenta Creada!</CardTitle>
                    <p className="text-[rgb(var(--text-secondary))] mb-8 leading-relaxed opacity-70">
                        Tu instancia de **Artifact ERP** se está preparando. Serás redirigido al login en unos segundos.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[rgb(var(--brand-color))] font-bold">
                        <div className="w-2 h-2 rounded-full bg-[rgb(var(--brand-color))] animate-ping" />
                        Sincronizando...
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[rgb(var(--bg-primary))] relative flex flex-col items-center justify-center overflow-hidden font-inter p-6 transition-colors duration-500">
            <SpaceInvadersBackground />

            <div className="w-full max-w-2xl relative z-20 animate-in fade-in zoom-in-95 duration-700">
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-[rgb(var(--brand-color))]/10 border border-[rgb(var(--brand-color))]/20 rounded-2xl mb-4 flex items-center justify-center text-[rgb(var(--brand-color))] shadow-lg shadow-[rgba(var(--brand-color),0.1)]">
                        <LayoutGrid className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold font-space-grotesk tracking-tight text-[rgb(var(--text-primary))] uppercase italic">
                        Comienza tu <span className="text-[rgb(var(--brand-color))]">Prueba Gratis</span>
                    </h1>
                    <p className="text-[rgb(var(--text-secondary))] text-sm mt-2 font-medium opacity-60">7 días de acceso total sin tarjetas de crédito.</p>
                </div>

                <Card className="bg-[rgba(var(--bg-secondary),0.6)] backdrop-blur-3xl border border-[rgba(var(--border-color),0.2)] rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
                    <div className="absolute -inset-24 bg-[rgb(var(--brand-color))]/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full pointer-events-none" />

                    <CardContent className="p-0 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-[rgb(var(--text-secondary))] ml-1 opacity-60">Nombre Empresa</label>
                                    <div className="relative group/input">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-secondary))] group-focus-within/input:text-[rgb(var(--brand-color))] transition-colors opacity-50" />
                                        <Input
                                            placeholder="Mi Empresa SpA"
                                            className="h-14 pl-12 bg-[rgba(var(--bg-primary),0.5)] border-[rgba(var(--border-color),0.2)] text-[rgb(var(--text-primary))] focus:border-[rgb(var(--brand-color))]/50 rounded-2xl"
                                            onChange={(e) => handleSlugAutoFill(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-[rgb(var(--text-secondary))] ml-1 opacity-60">URL artifact.cl/</label>
                                    <div className="relative group/input">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-secondary))] group-focus-within/input:text-[rgb(var(--brand-color))] transition-colors opacity-50" />
                                        <Input
                                            placeholder="mi-empresa"
                                            value={formData.slug}
                                            className="h-14 pl-12 bg-[rgba(var(--bg-primary),0.5)] border-[rgba(var(--border-color),0.2)] text-[rgb(var(--text-primary))] focus:border-[rgb(var(--brand-color))]/50 rounded-2xl lowercase"
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-[rgb(var(--text-secondary))] ml-1 opacity-60">Email Profesional</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-secondary))] group-focus-within/input:text-[rgb(var(--brand-color))] transition-colors opacity-50" />
                                    <Input
                                        type="email"
                                        placeholder="hola@empresa.com"
                                        value={formData.email}
                                        className="h-14 pl-12 bg-[rgba(var(--bg-primary),0.5)] border-[rgba(var(--border-color),0.2)] text-[rgb(var(--text-primary))] focus:border-[rgb(var(--brand-color))]/50 rounded-2xl"
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-[rgb(var(--text-secondary))] ml-1 opacity-60">Contraseña</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-secondary))] group-focus-within/input:text-[rgb(var(--brand-color))] transition-colors opacity-50" />
                                    <Input
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        className="h-14 pl-12 bg-[rgba(var(--bg-primary),0.5)] border-[rgba(var(--border-color),0.2)] text-[rgb(var(--text-primary))] focus:border-[rgb(var(--brand-color))]/50 rounded-2xl"
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in shake duration-500">
                                    <p className="text-sm font-medium text-red-400">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-16 bg-[rgb(var(--brand-color))] hover:opacity-90 text-white font-black text-lg rounded-2xl shadow-lg shadow-[rgba(var(--brand-color),0.2)] transition-all flex items-center justify-center gap-2 group/btn border-none"
                                disabled={loading}
                            >
                                {loading ? 'CREANDO INSTANCIA...' : (
                                    <>
                                        ACTIVAR MI ACCESO
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="pt-4 text-center">
                            <button
                                onClick={() => router.push('/login')}
                                className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] text-sm font-medium transition-colors opacity-70 hover:opacity-100"
                            >
                                ¿Ya eres parte de Artifact? Inicia Sesión
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="absolute bottom-8 text-[rgb(var(--text-secondary))] text-[10px] uppercase tracking-[0.4em] font-black z-20 opacity-40">
                Empowering Future Operations • Artifact Engine 2.5
            </div>
        </div>
    );
}
