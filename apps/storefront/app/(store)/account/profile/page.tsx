'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import { ChevronLeft, User, MapPin, Shield, Save, Edit, Trash2, Plus } from 'lucide-react';
import { ClientIcon } from '@/components/client-icon';
import { Button, Input } from '@artifact/ui';
import Link from 'next/link';

interface Address {
    id: string;
    street: string;
    city: string;
    region: string;
    isDefault: boolean;
}

export default function ProfilePage() {
    const { user, isLoading } = useSupabaseAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        rut: '',
    });

    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            street: 'Av. Providencia 1234, Depto 501',
            city: 'Providencia',
            region: 'Región Metropolitana',
            isDefault: true,
        }
    ]);

    useEffect(() => {
        setMounted(true);
        if (!isLoading && !user) {
            router.push('/login');
        }

        if (user) {
            setProfile({
                firstName: user.user_metadata?.firstName || '',
                lastName: user.user_metadata?.lastName || '',
                email: user.email || '',
                phone: user.user_metadata?.phone || '',
                rut: user.user_metadata?.rut || '',
            });
        }
    }, [user, isLoading, router]);

    if (!mounted || isLoading || !user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = () => {
        // TODO: Implement profile update
        console.log('Saving profile:', profile);
        alert('Perfil actualizado correctamente');
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="max-w-4xl mx-auto">

                    {/* Back Button */}
                    <Link
                        href="/account"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors group"
                    >
                        <ClientIcon icon={ChevronLeft} className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Volver a Mi Cuenta
                    </Link>

                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            Mi <span className="text-brand">Perfil</span>
                        </h1>
                        <p className="text-neutral-400">Gestiona tu información personal y preferencias.</p>
                    </header>

                    <div className="space-y-6">

                        {/* Personal Information */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                                    <ClientIcon icon={User} className="w-5 h-5 text-brand" />
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    Información <span className="text-brand">Personal</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                                        Nombre
                                    </label>
                                    <Input
                                        name="firstName"
                                        value={profile.firstName}
                                        onChange={handleProfileChange}
                                        placeholder="Tu nombre"
                                        className="bg-neutral-900/60 border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                                        Apellido
                                    </label>
                                    <Input
                                        name="lastName"
                                        value={profile.lastName}
                                        onChange={handleProfileChange}
                                        placeholder="Tu apellido"
                                        className="bg-neutral-900/60 border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                                        Email
                                    </label>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="bg-neutral-900/30 border-white/5 text-neutral-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-neutral-500 mt-1">
                                        El email no puede ser modificado
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                                        Teléfono
                                    </label>
                                    <Input
                                        name="phone"
                                        type="tel"
                                        value={profile.phone}
                                        onChange={handleProfileChange}
                                        placeholder="+56 9 1234 5678"
                                        className="bg-neutral-900/60 border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                                        RUT
                                    </label>
                                    <Input
                                        name="rut"
                                        value={profile.rut}
                                        onChange={handleProfileChange}
                                        placeholder="12.345.678-9"
                                        className="bg-neutral-900/60 border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleSaveProfile}
                                className="bg-brand text-black hover:shadow-[0_0_20px_rgba(0,224,116,0.3)] transition-all"
                            >
                                <ClientIcon icon={Save} className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </Button>
                        </div>

                        {/* Addresses */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <ClientIcon icon={MapPin} className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">
                                        Direcciones de <span className="text-brand">Envío</span>
                                    </h2>
                                </div>
                                <Button
                                    variant="outline"
                                    className="border-brand/30 text-brand hover:bg-brand/10"
                                >
                                    <ClientIcon icon={Plus} className="w-4 h-4 mr-2" />
                                    Agregar
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {addresses.map(address => (
                                    <div
                                        key={address.id}
                                        className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-brand/20 transition-all group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                {address.isDefault && (
                                                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-brand/10 text-brand border border-brand/20 mb-2">
                                                        Predeterminada
                                                    </span>
                                                )}
                                                <p className="text-white font-medium">{address.street}</p>
                                                <p className="text-sm text-neutral-400">{address.city}, {address.region}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                                                    <ClientIcon icon={Edit} className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                                    <ClientIcon icon={Trash2} className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <ClientIcon icon={Shield} className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    Seguridad y <span className="text-brand">Privacidad</span>
                                </h2>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all">
                                    <div>
                                        <p className="text-white font-medium">Contraseña</p>
                                        <p className="text-sm text-neutral-400">Última actualización hace 3 meses</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5"
                                    >
                                        Cambiar
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all">
                                    <div>
                                        <p className="text-white font-medium">Autenticación de dos factores</p>
                                        <p className="text-sm text-neutral-400">Agrega una capa extra de seguridad</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-white/10 hover:border-brand/30 hover:bg-brand/5"
                                    >
                                        Activar
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all">
                                    <div>
                                        <p className="text-white font-medium">Sesiones activas</p>
                                        <p className="text-sm text-neutral-400">Gestiona los dispositivos con acceso a tu cuenta</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5"
                                    >
                                        Ver
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
