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
        <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-lg shadow-md mt-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold border-b pb-2">Contenido de la Landing</h2>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Sección Principal (Hero)</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        value={sections.hero?.title || ""}
                        onChange={(e) => handleChange("hero", "title", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Subtítulo</label>
                    <textarea
                        value={sections.hero?.subtitle || ""}
                        onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Texto Botón (CTA)</label>
                    <input
                        type="text"
                        value={sections.hero?.ctaText || ""}
                        onChange={(e) => handleChange("hero", "ctaText", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                    {isSaving ? "Guardando..." : "Guardar Contenido"}
                </button>
            </div>
        </form>
    );
};

export default LandingEditor;
