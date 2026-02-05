'use client';

import React, { useState, useEffect } from "react";
import { TenantService } from "@/lib/services/tenant.service";
import { toast } from "sonner";

interface SectionData {
    title?: string;
    subtitle?: string;
    ctaText?: string;
}

const LandingEditor = () => {
    const [sections, setSections] = useState<Record<string, SectionData>>({
        hero: {
            title: "Digitalizamos tu MicroPyME paso a paso",
            subtitle: "Desde la creación de tu marca hasta convertirte en líder digital.",
            ctaText: "Solicitar Diagnóstico Gratuito",
        },
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await TenantService.getConfig();
                if (config.branding?.homeSections) {
                    setSections(config.branding.homeSections as Record<string, SectionData>);
                }
            } catch (error) {
                console.error("Error fetching home sections:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (section: string, field: keyof SectionData, value: string) => {
        setSections((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await TenantService.updateBranding({
                homeSections: sections,
            });
            toast.success("Contenido de la landing guardado");
        } catch (error) {
            console.error("Error saving home sections:", error);
            toast.error("Error al guardar el contenido");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return null;

    return (
        <form onSubmit={handleSave} className="space-y-6 card-premium p-6 mt-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold border-b border-[rgba(var(--border-color),0.2)] pb-2">Contenido de la Landing</h2>

            <div className="space-y-4">
                <h3 className="font-semibold text-[rgb(var(--text-secondary))]">Sección Principal (Hero)</h3>
                <div>
                    <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Título</label>
                    <input
                        type="text"
                        value={sections.hero?.title || ""}
                        onChange={(e) => handleChange("hero", "title", e.target.value)}
                        className="input-primary mt-1 block w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Subtítulo</label>
                    <textarea
                        value={sections.hero?.subtitle || ""}
                        onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                        rows={3}
                        className="input-primary mt-1 block w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Texto Botón (CTA)</label>
                    <input
                        type="text"
                        value={sections.hero?.ctaText || ""}
                        onChange={(e) => handleChange("hero", "ctaText", e.target.value)}
                        className="input-primary mt-1 block w-full"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary"
                >
                    {isSaving ? "Guardando..." : "Guardar Contenido"}
                </button>
            </div>
        </form>
    );
};

export default LandingEditor;
