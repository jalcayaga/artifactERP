'use client';

import React, { useState, useEffect } from "react";
import { TenantService, TenantConfig } from "@/lib/services/tenant.service";
import {
    Database,
    CreditCard,
    Settings,
    Loader2,
    Zap,
    ShoppingCart,
    CheckCircle2,
    Globe,
    ShareIcon,
    AlertCircle,
    ShoppingBag,
    Mail,
    Monitor,
    Layers,
    ChevronRight,
    Search
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
    Switch,
    Select,
    Option,
    Badge
} from "@material-tailwind/react";
import { toast } from "sonner";
// Removed unused imports: FactoSettings, MarketplaceSettings, WebpaySettings, EmailSettings, POSSettings, SocialSettings
// These components don't exist and all settings are handled inline in this file
import WorkflowSettings from '@/components/sales/WorkflowSettings';
// Removed unused import: FactoProvider, useFacto from '@/context/FactoContext' - not used in this file
import { useAuth } from '@artifact/core/client';
import Link from 'next/link';

const IntegrationsPage = () => {
    const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
    const [settings, setSettings] = useState<any>({
        facto: { enabled: false },
        payments: {
            webpay: { enabled: false },
            mercadopago: { enabled: false }
        },
        factoring: { enabled: false },
        marketplaces: {
            meli: { enabled: true, clientId: '', clientSecret: '' },
            uber: { enabled: false },
            pedidosya: { enabled: false }
        },
        workflow: {
            enabled: true,
            customLabels: {}
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'facto' | 'payments' | 'factoring' | 'marketplaces' | 'social' | 'workflow'>('marketplaces');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await TenantService.getConfig();
                setTenantConfig(config);
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
            await TenantService.updateSettings(settings); // Assuming generic update
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

    const updateMarketplace = (provider: string, field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            marketplaces: {
                ...prev.marketplaces,
                [provider]: {
                    ...prev.marketplaces[provider],
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

    const updateWorkflow = (field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="mt-4 mb-8 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Typography variant="h3" color="white" className="font-bold">
                        Integraciones
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal text-blue-gray-200">
                        Configura y gestiona las conexiones con canales de venta y servicios externos.
                    </Typography>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-500"
                >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Guardar Cambios
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
                    <Typography className="px-4 py-2 text-[10px] font-bold text-blue-gray-400 uppercase tracking-widest">
                        Marketplaces
                    </Typography>
                    <button
                        onClick={() => setActiveTab('marketplaces')}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors border border-transparent ${activeTab === 'marketplaces'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'text-blue-gray-200 hover:bg-white/5 hover:text-white border-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="h-4 w-4" />
                            Canales de Venta
                        </div>
                        <Badge content="Active" color="green" className="bg-green-500 scale-75" />
                    </button>

                    <Typography className="px-4 py-2 mt-4 text-[10px] font-bold text-blue-gray-400 uppercase tracking-widest">
                        Social & Mensajería
                    </Typography>
                    <button
                        onClick={() => setActiveTab('social')}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors border border-transparent ${activeTab === 'social'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'text-blue-gray-200 hover:bg-white/5 hover:text-white border-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <ShareIcon className="h-4 w-4" />
                            RRSS & Meta
                        </div>
                        <Typography className="text-[10px] text-blue-400 font-bold">Próximamente</Typography>
                    </button>

                    <Typography className="px-4 py-2 mt-4 text-[10px] font-bold text-blue-gray-400 uppercase tracking-widest">
                        Infraestructura
                    </Typography>
                    <button
                        onClick={() => setActiveTab('facto')}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors border border-transparent ${activeTab === 'facto'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'text-blue-gray-200 hover:bg-white/5 hover:text-white border-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Database className="h-4 w-4" />
                            Facto.cl (DTE)
                        </div>
                        {settings.facto?.enabled && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors border border-transparent ${activeTab === 'payments'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'text-blue-gray-200 hover:bg-white/5 hover:text-white border-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-4 w-4" />
                            Pagos & Webpay
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('factoring')}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors border border-transparent ${activeTab === 'factoring'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'text-blue-gray-200 hover:bg-white/5 hover:text-white border-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <ShareIcon className="h-4 w-4" />
                            Factoring
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('workflow')}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors border border-transparent ${activeTab === 'workflow'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'text-blue-gray-200 hover:bg-white/5 hover:text-white border-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Settings className="h-4 w-4" />
                            Workflow
                        </div>
                    </button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3">
                    <Card className="bg-[#1e293b] shadow-none border border-blue-gray-100/5">
                        {activeTab === 'marketplaces' && (
                            <CardBody className="space-y-8 animate-in fade-in duration-300">
                                {/* Omnichannel Catalog Manager Section */}
                                <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-8">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                                                <Layers className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <Typography variant="h5" color="white" className="font-bold">Gestor de Catálogos por Canal</Typography>
                                                <Typography variant="small" className="text-blue-gray-200 max-w-md">
                                                    Configura precios diferenciales y segmenta tu inventario para WhatsApp, Mercado Libre y PedidosYa desde un solo lugar.
                                                </Typography>
                                            </div>
                                        </div>
                                        <Link href="/integrations/catalog">
                                            <Button color="blue" className="flex items-center gap-2 px-8 py-3 rounded-xl shadow-xl shadow-blue-500/10">
                                                Entrar al Gestor
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Mercado Libre Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-500 font-bold">
                                                M
                                            </div>
                                            <div>
                                                <Typography variant="h6" color="white">Mercado Libre Chile</Typography>
                                                <Typography variant="small" className="text-blue-gray-200">Sincronización automática de órdenes y stock</Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Typography variant="small" className="font-medium text-white">Activo</Typography>
                                            <Switch
                                                id="meli-enabled"
                                                color="blue"
                                                checked={settings.marketplaces?.meli?.enabled}
                                                onChange={(e) => updateMarketplace('meli', 'enabled', e.target.checked)}
                                                className="h-full w-full checked:bg-[#2ec946]"
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Input
                                            label="App ID / Client ID"
                                            color="white"
                                            value={settings.marketplaces?.meli?.clientId || ""}
                                            onChange={(e) => updateMarketplace('meli', 'clientId', e.target.value)}
                                            placeholder="Ingresa tu Client ID"
                                            className="!border-t-blue-gray-200 focus:!border-t-white"
                                        />
                                        <Input
                                            type="password"
                                            label="Client Secret"
                                            color="white"
                                            value={settings.marketplaces?.meli?.clientSecret || ""}
                                            onChange={(e) => updateMarketplace('meli', 'clientSecret', e.target.value)}
                                            placeholder="••••••••"
                                            className="!border-t-blue-gray-200 focus:!border-t-white"
                                        />
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-3 text-xs text-blue-gray-300">
                                        <Globe className="h-4 w-4" />
                                        <span>Tu URL de Webhook: <code className="text-blue-400">https://api.artifact.cl/integrations/meli/webhook</code></span>
                                    </div>
                                </div>

                                {/* Uber Eats Placeholder */}
                                <div className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 opacity-60">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-500/20 rounded-xl text-green-500">
                                                <ShoppingCart className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Typography variant="h6" color="white">Uber Eats</Typography>
                                                <Typography variant="small" className="text-blue-gray-400">Próximamente: Integración directa con catálogo y órdenes</Typography>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="text" color="blue" className="font-bold">Notificarme</Button>
                                    </div>
                                </div>

                                {/* PedidosYa Placeholder */}
                                <div className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 opacity-60">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                                                <ShoppingCart className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Typography variant="h6" color="white">PedidosYa</Typography>
                                                <Typography variant="small" className="text-blue-gray-400">Próximamente: Recepción de órdenes y actualización de disponibilidad</Typography>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="text" color="blue" className="font-bold">Notificarme</Button>
                                    </div>
                                </div>
                            </CardBody>
                        )}

                        {activeTab === 'social' && (
                            <CardBody className="space-y-8 animate-in fade-in duration-300">
                                <div className="p-6 bg-[#1877F2]/10 rounded-2xl border border-[#1877F2]/20 mb-8">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-[#1877F2] rounded-2xl shadow-lg shadow-[#1877F2]/20 text-white">
                                                <ShoppingBag className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <Typography variant="h5" color="white" className="font-bold">Facebook Marketplace</Typography>
                                                <Typography variant="small" className="text-blue-gray-200 max-w-md">
                                                    Sincroniza tus productos con el catálogo de Meta para vender en Marketplace e Instagram.
                                                </Typography>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-2">
                                                <Typography variant="small" className="font-medium text-white">Estado:</Typography>
                                                <Badge content="Live" color="green" className="bg-green-500 static translate-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-black/20 rounded-xl border border-white/5 space-y-4">
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="mb-2 font-bold text-blue-gray-100">URL del Catálogo (Data Feed XML)</Typography>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <div className="relative flex-1">
                                                    <Input
                                                        readOnly
                                                        value={tenantConfig ? `${process.env.NEXT_PUBLIC_API_URL}/integrations/catalog/facebook/${tenantConfig.id}` : 'Cargando...'}
                                                        className="!border-white/10 text-blue-400 font-mono text-xs !bg-black/20"
                                                        containerProps={{ className: "min-w-0" }}
                                                        labelProps={{ className: 'hidden' }}
                                                        crossOrigin={undefined}
                                                    />
                                                </div>
                                                <Button
                                                    size="sm"
                                                    color="blue"
                                                    className="flex items-center gap-2 px-6"
                                                    onClick={() => {
                                                        const url = tenantConfig ? `${process.env.NEXT_PUBLIC_API_URL}/integrations/catalog/facebook/${tenantConfig.id}` : '';
                                                        navigator.clipboard.writeText(url);
                                                        toast.success("URL copiada al portapapeles");
                                                    }}
                                                >
                                                    Copiar URL
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-blue-gray-300 flex items-start gap-2 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                                            <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-bold text-blue-400 mb-1">Instrucciones de configuración:</p>
                                                <ol className="list-decimal list-inside space-y-1 ml-1">
                                                    <li>Ve a tu <b>Meta Commerce Manager</b>.</li>
                                                    <li>Selecciona <b>Catálogo &gt; Orígenes de datos</b>.</li>
                                                    <li>Elige <b>Lista de datos (Data Feed)</b>.</li>
                                                    <li>Pega la URL de arriba y selecciona <b>Sincronización Programada</b>.</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <Typography variant="h6" color="white" className="mb-1 flex items-center gap-2">
                                            <ShoppingCart className="h-4 w-4" />
                                            WhatsApp Business
                                        </Typography>
                                        <Typography variant="small" color="gray">Próximamente: Links de pago y catálogo por chat</Typography>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-blue-gray-400">
                                        <Typography variant="h6" color="white" className="mb-1 flex items-center gap-2">
                                            <ShareIcon className="h-4 w-4" />
                                            Instagram Shopping
                                        </Typography>
                                        <Typography variant="small" color="gray">Utiliza el mismo feed de Facebook para Instagram</Typography>
                                    </div>
                                </div>
                            </CardBody>
                        )}

                        {activeTab === 'facto' && (
                            <CardBody className="space-y-6 animate-in fade-in duration-300">
                                <div className="pb-6 border-b border-blue-gray-100/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500">
                                                <Database className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Typography variant="h6" color="white">Configuración de Facto.cl</Typography>
                                                <Typography variant="small" className="text-blue-gray-200">Emisión de Facturas y Boletas Electrónicas (Chile)</Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Typography variant="small" className="font-medium text-white">
                                                {settings.facto?.enabled ? 'Activado' : 'Desactivado'}
                                            </Typography>
                                            <Switch
                                                id="facto-enabled"
                                                color="blue"
                                                checked={settings.facto.enabled}
                                                onChange={() => updateFacto('enabled', !settings.facto.enabled)}
                                                className="bg-blue-gray-100"
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Input
                                            label="Username / Email"
                                            color="white"
                                            value={settings.facto?.username || ""}
                                            onChange={(e) => updateFacto('username', e.target.value)}
                                            placeholder="usuario@facto.cl"
                                            className="!border-t-blue-gray-200 focus:!border-t-white"
                                            crossOrigin={undefined}
                                        />
                                        <Input
                                            type="password"
                                            label="Password"
                                            color="white"
                                            value={settings.facto?.password || ""}
                                            onChange={(e) => updateFacto('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="!border-t-blue-gray-200 focus:!border-t-white"
                                            crossOrigin={undefined}
                                        />
                                        <Input
                                            label="Facto RUT"
                                            color="white"
                                            value={settings.facto.rut || ''}
                                            onChange={(e) => updateFacto('rut', e.target.value)}
                                            placeholder="12.345.678-9"
                                            className="!border-white/10"
                                            crossOrigin={undefined}
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        )}

                        {activeTab === 'payments' && (
                            <CardBody className="space-y-6 animate-in fade-in duration-300">
                                <div className="pb-6 border-b border-blue-gray-100/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                                                <CreditCard className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Typography variant="h6" color="white">Webpay Plus (Transbank)</Typography>
                                                <Typography variant="small" className="text-blue-gray-200">Cobros con Tarjetas de Débito y Crédito</Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Typography variant="small" className="font-medium text-white">
                                                {settings.payments?.webpay?.enabled ? 'Activado' : 'Desactivado'}
                                            </Typography>
                                            <Switch
                                                id="webpay-enabled"
                                                color="blue"
                                                checked={settings.payments?.webpay?.enabled || false}
                                                onChange={(e) => updateWebpay('enabled', e.target.checked)}
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Input
                                            label="Código de Comercio"
                                            color="white"
                                            value={settings.payments?.webpay?.commerceCode || ""}
                                            onChange={(e) => updateWebpay('commerceCode', e.target.value)}
                                            placeholder="5970..."
                                            className="!border-t-blue-gray-200 focus:!border-t-white"
                                            crossOrigin={undefined}
                                        />
                                        <Input
                                            type="password"
                                            label="API Key (Secreto)"
                                            color="white"
                                            value={settings.payments?.webpay?.apiKey || ""}
                                            onChange={(e) => updateWebpay('apiKey', e.target.value)}
                                            placeholder="••••••••••••••••"
                                            className="!border-t-blue-gray-200 focus:!border-t-white"
                                            crossOrigin={undefined}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-blue-gray-300">
                                        <Globe className="h-3 w-3" />
                                        <span>Debes configurar la URL de respuesta en tu panel de Transbank.</span>
                                    </div>
                                </div>
                            </CardBody>
                        )}

                        {activeTab === 'factoring' && (
                            <CardBody className="space-y-6 animate-in fade-in duration-300">
                                <div className="pb-6 border-b border-blue-gray-100/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-500">
                                                <ShareIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Typography variant="h6" color="white">Integración de Factoring</Typography>
                                                <Typography variant="small" className="text-blue-gray-200">Cesión electrónica de facturas para obtención de liquidez</Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Typography variant="small" className="font-medium text-white">
                                                {settings.factoring?.enabled ? 'Activado' : 'Desactivado'}
                                            </Typography>
                                            <Switch
                                                id="factoring-enabled"
                                                color="blue"
                                                checked={settings.factoring?.enabled || false}
                                                onChange={(e) => updateFactoring('enabled', e.target.checked)}
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Select
                                            label="Proveedor de Factoring"
                                            color="blue-gray"
                                            value={settings.factoring?.provider || "other"}
                                            onChange={(val) => updateFactoring('provider', val)}
                                            className="!border-t-blue-gray-200 focus:!border-t-white text-white"
                                            labelProps={{
                                                className: "text-blue-gray-300",
                                            }}
                                            menuProps={{
                                                className: "bg-[#1e293b] border border-blue-gray-100/5 text-white"
                                            }}
                                        >
                                            <Option value="cumplo">Cumplo</Option>
                                            <Option value="larrainvial">LarrainVial</Option>
                                            <Option value="other">Otro (Manual)</Option>
                                        </Select>
                                        <Input
                                            type="password"
                                            label="API Key"
                                            color="white"
                                            value={settings.factoring.apiKey || ''}
                                            onChange={(e) => updateFactoring('apiKey', e.target.value)}
                                            placeholder="••••••••••••••••"
                                            className="!border-white/10"
                                            crossOrigin={undefined}
                                        />
                                    </div>
                                    <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                        <div className="flex gap-3 text-purple-400">
                                            <Settings className="h-5 w-5 flex-shrink-0" />
                                            <div className="text-sm">
                                                <p className="font-bold mb-1">Configuración de Cesión</p>
                                                <p className="text-blue-gray-100">Al activar el modulo de factoring, podrás ceder tus facturas directamente desde el listado de facturación. Asegúrate de tener el convenio activo con tu proveedor.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        )}

                        {activeTab === 'workflow' && (
                            <WorkflowSettings
                                settings={settings}
                                onUpdate={updateWorkflow}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsPage;
