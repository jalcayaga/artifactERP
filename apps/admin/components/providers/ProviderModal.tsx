
'use client';

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ProviderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    provider?: any; // If null, create mode
}

export default function ProviderModal({ isOpen, onClose, onSuccess, provider }: ProviderModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        rut: "",
        email: "",
        phone: "",
        address: "",
        city: "",
    });

    useEffect(() => {
        if (provider) {
            setFormData({
                name: provider.name || "",
                rut: provider.rut || "",
                email: provider.email || "",
                phone: provider.phone || "",
                address: provider.address || "",
                city: provider.city || "",
            });
        } else {
            setFormData({
                name: "",
                rut: "",
                email: "",
                phone: "",
                address: "",
                city: "",
            });
        }
    }, [provider, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                isSupplier: true,
                // If it's a new provider, we also set isClient to false by default unless they manually change it (not in this UI)
                isClient: provider ? provider.isClient : false
            };

            if (provider) {
                await apiClient.patch(`/companies/${provider.id}`, payload);
                toast.success("Proveedor actualizado");
            } else {
                await apiClient.post('/companies', payload);
                toast.success("Proveedor creado");
            }
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="card-premium w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-[rgba(var(--border-color),0.2)]">
                    <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">
                        {provider ? "Editar Proveedor" : "Nuevo Proveedor"}
                    </h2>
                    <button onClick={onClose} className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--brand-color))]">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Nombre / Razón Social <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            className="input-primary mt-1 block w-full"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">RUT <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            placeholder="12.345.678-9"
                            className="input-primary mt-1 block w-full"
                            value={formData.rut}
                            onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                required
                                className="input-primary mt-1 block w-full"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Teléfono</label>
                            <input
                                type="text"
                                className="input-primary mt-1 block w-full"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Dirección</label>
                        <input
                            type="text"
                            className="input-primary mt-1 block w-full"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Ciudad</label>
                        <input
                            type="text"
                            className="input-primary mt-1 block w-full"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-[rgba(var(--border-color),0.3)] rounded-md text-[rgb(var(--text-secondary))] hover:bg-[rgba(var(--bg-secondary),0.3)] font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
