'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { User, Lock, Camera, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        profilePictureUrl: '',
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        // Use the same localStorage key as AuthContext (wolfflow_user)
        const storedUser = localStorage.getItem('wolfflow_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                fetchUser(parsed.id);
            } catch (e) {
                console.error("Invalid user in storage");
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (id: string) => {
        try {
            const data = await apiClient.get<any>(`/users/${id}`);
            setUser(data);
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                profilePictureUrl: data.profilePictureUrl || '',
            });
        } catch (error) {
            console.error(error);
            toast.error("No se pudo cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await apiClient.patch(`/users/${user.id}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                profilePictureUrl: formData.profilePictureUrl
            });
            toast.success("Perfil actualizado correctamente");
            // Update local storage if needed
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('wolfflow_user', JSON.stringify(updatedUser));
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setSaving(true);
        try {
            await apiClient.patch(`/users/${user.id}`, {
                password: passwordData.newPassword
            });
            toast.success("Contraseña actualizada. Por favor inicia sesión nuevamente.");
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar contraseña");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--brand-color))]" />
            </div>
        );
    }

    if (!user) {
        return <div className="p-8 text-center">Usuario no encontrado. Intenta hacer login nuevamente.</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="card-premium p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[rgba(var(--brand-color),0.3)] mx-auto bg-black/50 flex items-center justify-center">
                                {formData.profilePictureUrl ? (
                                    <img src={formData.profilePictureUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-gray-500" />
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 bg-[rgb(var(--brand-color))] p-2 rounded-full text-black hover:scale-110 transition-transform" title="Cambiar Avatar (URL)">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold">{formData.firstName} {formData.lastName}</h2>
                        <p className="text-sm text-[rgb(var(--text-secondary))]">{user.email}</p>
                        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-[rgba(var(--brand-color),0.1)] text-[rgb(var(--brand-color))] text-xs font-semibold border border-[rgba(var(--brand-color),0.2)]">
                            {user.roles?.map((r: any) => r.name).join(', ') || 'Usuario'}
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Forms */}
                <div className="md:col-span-2 space-y-6">

                    {/* General Info Form */}
                    <div className="card-premium p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-[rgba(var(--border-color),0.1)] pb-4">
                            <User className="w-5 h-5 text-[rgb(var(--brand-color))]" />
                            <h2 className="text-xl font-semibold">Información Personal</h2>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        className="input-primary w-full"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Apellido</label>
                                    <input
                                        type="text"
                                        className="input-primary w-full"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Email <span className="text-xs opacity-50">(No editable)</span></label>
                                <input
                                    type="email"
                                    className="input-primary w-full opacity-50 cursor-not-allowed"
                                    value={formData.email}
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">URL Avatar</label>
                                <input
                                    type="text"
                                    className="input-primary w-full"
                                    placeholder="https://..."
                                    value={formData.profilePictureUrl}
                                    onChange={(e) => setFormData({ ...formData, profilePictureUrl: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Password Form */}
                    <div className="card-premium p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-[rgba(var(--border-color),0.1)] pb-4">
                            <Lock className="w-5 h-5 text-[rgb(var(--brand-color))]" />
                            <h2 className="text-xl font-semibold">Cambiar Contraseña</h2>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    className="input-primary w-full"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    className="input-primary w-full"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-400">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Actualizar Clave
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
