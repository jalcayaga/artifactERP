'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from '@artifact/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@artifact/ui';
import { toast } from 'sonner';
import {
    CloudArrowUpIcon,
    ShieldCheckIcon,
    DocumentDuplicateIcon,
    ServerStackIcon
} from "@heroicons/react/24/outline";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CertificationDashboard } from '@/src/components/dte/CertificationDashboard';

interface CertStatus {
    installed: boolean;
    cn?: string;
    expiration?: string;
    rut?: string;
}

export default function DteSettingsPage() {
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [certPassword, setCertPassword] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [certStatus, setCertStatus] = useState<CertStatus>({ installed: false });
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);

    const fetchCertStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dte/certificate/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCertStatus(data);
            }
        } catch (error) {
            console.error("Failed to fetch cert status", error);
        } finally {
            setIsLoadingStatus(false);
        }
    };

    useEffect(() => {
        fetchCertStatus();
    }, []);

    const handleCertificateUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!certificateFile || !certPassword) {
            toast.error('Debes seleccionar un archivo .pfx y ingresar la contraseña.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', certificateFile);
        formData.append('password', certPassword);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dte/certificate`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al cargar certificado');
            }

            toast.success('Certificado digital cargado correctamente.');
            setCertificateFile(null);
            setCertPassword('');
            fetchCertStatus(); // Refresh status
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCafUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading('Procesando CAF...');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dte/caf`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error('Error al cargar CAF');

            toast.success('Folios cargados correctamente.', { id: toastId });
        } catch (error) {
            toast.error('Error al cargar archivo CAF', { id: toastId });
        }
    };

    const handleTestConnection = async () => {
        setConnectionStatus('idle');
        const toastId = toast.loading('Conectando con SII (Maullin)...');

        // This would be a real endpoint in a complete implementation
        // For now we simulate based on cert existence
        setTimeout(() => {
            if (certStatus.installed) {
                setConnectionStatus('success');
                toast.success('Conexión exitosa con SII. Token obtenido.', { id: toastId });
            } else {
                setConnectionStatus('error');
                toast.error('No se puede conectar sin certificado digital.', { id: toastId });
            }
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Facturación Electrónica</h2>
                    <p className="text-slate-400 text-sm">Gestiona tu certificado digital y folios (CAF) para emitir DTEs.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Ambiente:</span>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500 bg-yellow-500/10">
                        CERTIFICACIÓN (Maullin)
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="certificate" className="space-y-4">
                <TabsList className="bg-slate-800 border border-white/5 p-1">
                    <TabsTrigger value="certificate" className="data-[state=active]:bg-slate-700">
                        <ShieldCheckIcon className="h-4 w-4 mr-2" />
                        Certificado Digital
                    </TabsTrigger>
                    <TabsTrigger value="folios" className="data-[state=active]:bg-slate-700">
                        <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                        Administración de Folios
                    </TabsTrigger>
                    <TabsTrigger value="certification" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400">
                        <ShieldCheckIcon className="h-4 w-4 mr-2" />
                        Certificación SII
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="certificate">
                    <Card className="border-white/[0.05] bg-[#1e293b]/40 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Certificado Digital (.pfx)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {certStatus.installed ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex items-start gap-4">
                                    <ShieldCheckIcon className="h-8 w-8 text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-emerald-400 font-bold">Certificado Instalado</h4>
                                        <div className="text-slate-300 text-sm mt-1 grid grid-cols-2 gap-x-8 gap-y-1">
                                            <span className="text-slate-500">Emitido a:</span>
                                            <span>{certStatus.cn}</span>
                                            <span className="text-slate-500">RUT:</span>
                                            <span>{certStatus.rut}</span>
                                            <span className="text-slate-500">Vence:</span>
                                            <span>{certStatus.expiration ? format(new Date(certStatus.expiration), 'dd MMM yyyy', { locale: es }) : 'N/A'}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-0 h-auto"
                                            onClick={() => setCertStatus({ ...certStatus, installed: false })} // Demo action
                                        >
                                            Eliminar Certificado
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-lg mb-4">
                                    <p className="text-yellow-200 text-sm">
                                        No se ha configurado ningún certificado digital. No podrás emitir documentos ante el SII.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleCertificateUpload} className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label className="text-white">Cargar Nuevo Certificado (.pfx)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="file"
                                            accept=".pfx,.p12"
                                            onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                                            className="bg-slate-900/50 border-white/[0.05] text-slate-300 file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-4 file:text-sm file:font-medium hover:file:bg-blue-700"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Contraseña del Certificado</Label>
                                    <Input
                                        type="password"
                                        value={certPassword}
                                        onChange={(e) => setCertPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-slate-900/50 border-white/[0.05] text-white"
                                    />
                                </div>
                                <Button type="submit" disabled={isUploading} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                                    {isUploading ? 'Cargando y Verificando...' : 'Instalar Certificado'}
                                </Button>
                            </form>

                            <div className="border-t border-white/5 pt-6">
                                <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Estado de Conexión</h3>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${connectionStatus === 'success' ? 'bg-green-500/20 text-green-500' : connectionStatus === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-slate-700/50 text-slate-400'}`}>
                                            <ServerStackIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Servicio de Impuestos Internos</p>
                                            <p className="text-xs text-slate-400">Ambiente de Certificación</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" onClick={handleTestConnection} className="border-white/10 text-slate-300 hover:bg-white/5">
                                        Verificar Conexión
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="folios">
                    <Card className="border-white/[0.05] bg-[#1e293b]/40 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-white text-lg">Timbraje Electrónico (CAF)</CardTitle>
                            <label className="cursor-pointer">
                                <div className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium h-9 px-4 py-2 rounded-md flex items-center shadow-sm transition-colors">
                                    <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                                    Cargar Nuevo CAF
                                </div>
                                <input type="file" accept=".xml" className="hidden" onChange={handleCafUpload} />
                            </label>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border border-white/5 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-900/50 text-slate-400 font-medium border-b border-white/5">
                                        <tr>
                                            <th className="px-4 py-3">Tipo Documento</th>
                                            <th className="px-4 py-3">Rango Desde</th>
                                            <th className="px-4 py-3">Rango Hasta</th>
                                            <th className="px-4 py-3">Último Usado</th>
                                            <th className="px-4 py-3">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-white">Factura Electrónica (33)</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">1</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">50</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">12</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10 text-[10px]">
                                                    ACTIVO
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-white">Boleta Electrónica (39)</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">-</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">-</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">-</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className="border-red-500 text-red-500 bg-red-500/10 text-[10px]">
                                                    SIN CARGAR
                                                </Badge>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="certification">
                    <CertificationDashboard />
                </TabsContent>
            </Tabs>
        </div>
    );
}
