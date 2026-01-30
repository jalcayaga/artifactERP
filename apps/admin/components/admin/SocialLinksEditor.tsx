'use client';

import React, { useState, useEffect } from "react";
import { TenantService } from "@/lib/services/tenant.service";
import { toast } from "sonner";
import { Instagram, Facebook, Linkedin, Twitter, MessageCircle } from "lucide-react";

interface SocialLinks {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
}

const SocialLinksEditor = () => {
    const [links, setLinks] = useState<SocialLinks>({
        instagram: "",
        facebook: "",
        linkedin: "",
        twitter: "",
        whatsapp: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await TenantService.getConfig();
                if (config.branding?.socialLinks) {
                    setLinks(config.branding.socialLinks as SocialLinks);
                }
            } catch (error) {
                console.error("Error fetching social links:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (field: keyof SocialLinks, value: string) => {
        setLinks((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await TenantService.updateBranding({
                socialLinks: links,
            });
            toast.success("Redes sociales actualizadas");
        } catch (error) {
            console.error("Error saving social links:", error);
            toast.error("Error al guardar redes sociales");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return null;

    return (
        <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-lg shadow-md mt-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold border-b pb-2">Redes Sociales</h2>

            <div className="grid grid-cols-1 gap-4">
                <SocialInput
                    icon={<Instagram className="h-5 w-5 text-pink-600" />}
                    label="Instagram"
                    value={links.instagram || ""}
                    onChange={(v) => handleChange("instagram", v)}
                    placeholder="https://instagram.com/tu-empresa"
                />
                <SocialInput
                    icon={<Facebook className="h-5 w-5 text-blue-600" />}
                    label="Facebook"
                    value={links.facebook || ""}
                    onChange={(v) => handleChange("facebook", v)}
                    placeholder="https://facebook.com/tu-empresa"
                />
                <SocialInput
                    icon={<Linkedin className="h-5 w-5 text-blue-700" />}
                    label="LinkedIn"
                    value={links.linkedin || ""}
                    onChange={(v) => handleChange("linkedin", v)}
                    placeholder="https://linkedin.com/company/tu-empresa"
                />
                <SocialInput
                    icon={<Twitter className="h-5 w-5 text-blue-400" />}
                    label="Twitter/X"
                    value={links.twitter || ""}
                    onChange={(v) => handleChange("twitter", v)}
                    placeholder="https://twitter.com/tu-empresa"
                />
                <SocialInput
                    icon={<MessageCircle className="h-5 w-5 text-green-500" />}
                    label="WhatsApp"
                    value={links.whatsapp || ""}
                    onChange={(v) => handleChange("whatsapp", v)}
                    placeholder="+56912345678"
                />
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                    {isSaving ? "Guardando..." : "Guardar Redes Sociales"}
                </button>
            </div>
        </form>
    );
};

interface SocialInputProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SocialInput = ({ icon, label, value, onChange, placeholder }: SocialInputProps) => (
    <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            {icon}
            {label}
        </label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
            placeholder={placeholder}
        />
    </div>
);

export default SocialLinksEditor;
