'use client';

import React, { useState, useEffect } from "react";
import { TenantService } from "@/lib/services/tenant.service";
import { toast } from "sonner";
import {
    Database,
    CreditCard,
    Settings,
    Loader2,
    ChevronRight,
    Zap,
    CheckCircle2,
    XCircle,
    Globe,
    ShareIcon
} from "lucide-react";

const IntegrationsPage = () => {
    const [settings, setSettings] = useState<any>({
        facto: { enabled: false },
        payments: {
            webpay: { enabled: false },
            mercadopago: { enabled: false }
        },
        factoring: { enabled: false }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'facto' | 'payments' | 'factoring'>('facto');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await TenantService.getConfig();
                if (config.settings) {
                    setSettings((prev: any) => ({
                        ...prev,
                        ...config.settings
                    }));
                }
            } catch (error) {
                console.error("Error fetching integrations settings:", error);
                toast.error("Error al cargar configuraciones");
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await TenantService.updateSettings(settings);
            toast.success("Configuraciones guardadas exitosamente");
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Error al guardar configuraciones");
        } finally {
            setIsSaving(false);
        }
    };

    const updateFacto = (field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            facto: {
                ...prev.facto,
                [field]: value
            }
        }));
    };

    const updateWebpay = (field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            payments: {
                ...prev.payments,
                webpay: {
                    ...prev.payments.webpay,
                    [field]: value
                }
            }
        }));
    };

    const updateFactoring = (field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            factoring: {
                ...prev.factoring,
                [field]: value
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Integraciones</h1>
                    <p className="text-muted-foreground mt-1">
                        Configura las conexiones con servicios externos de facturación y pagos.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cambios
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-1">
                    <button
                        onClick={() => setActiveTab('facto')}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'facto'
                                ? 'bg-secondary text-secondary-foreground'
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Facto.cl (DTE)
                        </div>
                        {settings.facto?.enabled ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                            <XCircle className="h-3 w-3 text-muted-foreground" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'payments'
                                ? 'bg-secondary text-secondary-foreground'
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Pasarelas de Pago
                        </div>
                        {settings.payments?.webpay?.enabled ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                            <XCircle className="h-3 w-3 text-muted-foreground" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('factoring')}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'factoring'
                                ? 'bg-secondary text-secondary-foreground'
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <ShareIcon className="h-4 w-4" />
                            Factoring
                        </div>
                        {settings.factoring?.enabled ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                            <XCircle className="h-3 w-3 text-muted-foreground" />
                        )}
                    </button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3">
                    {activeTab === 'facto' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="p-6 pb-4 border-b">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Database className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">Configuración de Facto.cl</h3>
                                                <p className="text-sm text-muted-foreground">Emisión de Facturas y Boletas Electrónicas (Chile)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="facto-enabled">
                                                {settings.facto?.enabled ? 'Activado' : 'Desactivado'}
                                            </label>
                                            <Switch
                                                id="facto-enabled"
                                                checked={settings.facto?.enabled || false}
                                                onCheckedChange={(checked) => updateFacto('enabled', checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Username / Email</label>
                                            <input
                                                type="text"
                                                value={settings.facto?.username || ""}
                                                onChange={(e) => updateFacto('username', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="usuario@facto.cl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <input
                                                type="password"
                                                value={settings.facto?.password || ""}
                                                onChange={(e) => updateFacto('password', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">RUT Emisor</label>
                                            <input
                                                type="text"
                                                value={settings.facto?.rutEmisor || ""}
                                                onChange={(e) => updateFacto('rutEmisor', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="12.345.678-9"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">WSDL URL (Opcional)</label>
                                            <input
                                                type="text"
                                                value={settings.facto?.wsdl || ""}
                                                onChange={(e) => updateFacto('wsdl', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="https://conexion.facto.cl/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                        <div className="flex gap-3 text-blue-800 dark:text-blue-300">
                                            <Zap className="h-5 w-5 flex-shrink-0" />
                                            <div className="text-sm">
                                                <p className="font-semibold mb-1">Nota importante</p>
                                                <p>La integración con Facto.cl permite automatizar la emisión de Documentos Tributarios Electrónicos (DTE) directamente desde tus ventas.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Webpay Section */}
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="p-6 pb-4 border-b">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <CreditCard className="h-6 w-6 text-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">Webpay Plus (Transbank)</h3>
                                                <p className="text-sm text-muted-foreground">Cobros con Tarjetas de Débito y Crédito</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium leading-none" htmlFor="webpay-enabled">
                                                {settings.payments?.webpay?.enabled ? 'Activado' : 'Desactivado'}
                                            </label>
                                            <Switch
                                                id="webpay-enabled"
                                                checked={settings.payments?.webpay?.enabled || false}
                                                onCheckedChange={(checked) => updateWebpay('enabled', checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Código de Comercio</label>
                                            <input
                                                type="text"
                                                value={settings.payments?.webpay?.commerceCode || ""}
                                                onChange={(e) => updateWebpay('commerceCode', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="5970..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">API Key (Secreto)</label>
                                            <input
                                                type="password"
                                                value={settings.payments?.webpay?.apiKey || ""}
                                                onChange={(e) => updateWebpay('apiKey', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="••••••••••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Globe className="h-3 w-3" />
                                        <span>Debes configurar la URL de respuesta en tu panel de Transbank.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'factoring' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="p-6 pb-4 border-b">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <ShareIcon className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">Integración de Factoring</h3>
                                                <p className="text-sm text-muted-foreground">Cesión electrónica de facturas para obtención de liquidez</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium leading-none" htmlFor="factoring-enabled">
                                                {settings.factoring?.enabled ? 'Activado' : 'Desactivado'}
                                            </label>
                                            <Switch
                                                id="factoring-enabled"
                                                checked={settings.factoring?.enabled || false}
                                                onCheckedChange={(checked) => updateFactoring('enabled', checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Proveedor de Factoring</label>
                                            <select
                                                value={settings.factoring?.provider || "other"}
                                                onChange={(e) => updateFactoring('provider', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="cumplo">Cumplo</option>
                                                <option value="larrainvial">LarrainVial</option>
                                                <option value="other">Otro (Manual)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">API Key / Token de Acceso</label>
                                            <input
                                                type="password"
                                                value={settings.factoring?.apiKey || ""}
                                                onChange={(e) => updateFactoring('apiKey', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="••••••••••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900/30">
                                        <div className="flex gap-3 text-purple-800 dark:text-purple-300">
                                            <Settings className="h-5 w-5 flex-shrink-0" />
                                            <div className="text-sm">
                                                <p className="font-semibold mb-1">Configuración de Cesión</p>
                                                <p>Al activar el modulo de factoring, podrás ceder tus facturas directamente desde el listado de facturación. Asegúrate de tener el convenio activo con tu proveedor.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Switch = ({ id, checked, onCheckedChange }: { id: string, checked: boolean, onCheckedChange: (v: boolean) => void }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            onClick={() => onCheckedChange(!checked)}
            className={`peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-primary" : "bg-gray-200"
                }`}
            id={id}
        >
            <span
                data-state={checked ? "checked" : "unchecked"}
                className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"
                    }`}
            />
        </button>
    );
};

export default IntegrationsPage;
