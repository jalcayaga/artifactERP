
'use client';

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import ProviderModal from "./ProviderModal";

interface Provider {
    id: string;
    name: string;
    rut: string;
    email: string;
    phone: string;
    city: string;
    isSupplier: boolean;
}

export default function ProvidersView() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

    const fetchProviders = async () => {
        setLoading(true);
        try {
            // Fetch only suppliers
            const data: any = await apiClient.get<any>('/companies?isSupplier=true');
            if (Array.isArray(data)) {
                setProviders(data);
            } else if (data.data && Array.isArray(data.data)) {
                setProviders(data.data);
            } else {
                setProviders([]);
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
            toast.error("Error al cargar proveedores");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleCreate = () => {
        setSelectedProvider(null);
        setIsModalOpen(true);
    };

    const handleEdit = (provider: Provider) => {
        setSelectedProvider(provider);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este proveedor?")) return;
        try {
            await apiClient.delete(`/companies/${id}`);
            toast.success("Proveedor eliminado");
            fetchProviders();
        } catch (error) {
            toast.error("Error al eliminar");
        }
    };

    const filteredProviders = providers.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.rut && p.rut.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <>
            <div className="card-premium">
                {/* Toolbar */}
                <div className="p-4 border-b border-[rgba(var(--border-color),0.2)] flex flex-col md:flex-row justify-between gap-4 items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-secondary))] h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Buscar proveedor..."
                            className="input-primary pl-9 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Proveedor
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[rgba(var(--border-color),0.1)]">
                        <thead className="bg-[rgba(var(--bg-secondary),0.5)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">RUT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Contacto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Ciudad</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(var(--border-color),0.1)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[rgb(var(--text-secondary))]">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : filteredProviders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[rgb(var(--text-secondary))]">
                                        No se encontraron proveedores.
                                    </td>
                                </tr>
                            ) : (
                                filteredProviders.map((provider) => (
                                    <tr key={provider.id} className="hover:bg-[rgba(var(--brand-color),0.05)] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-[rgb(var(--text-primary))]">{provider.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[rgb(var(--text-secondary))]">{provider.rut || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[rgb(var(--text-primary))]">{provider.email}</div>
                                            <div className="text-sm text-[rgb(var(--text-secondary))]">{provider.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[rgb(var(--text-secondary))]">{provider.city || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(provider)} className="text-[rgb(var(--brand-color))] hover:text-[rgb(var(--text-primary))] mr-4 transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(provider.id)} className="text-red-500 hover:text-red-400 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProviderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchProviders();
                    setIsModalOpen(false);
                }}
                provider={selectedProvider}
            />
        </>
    );
}
