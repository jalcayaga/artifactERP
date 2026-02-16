'use client';

import React, { useState, useEffect } from "react";
import { TenantService } from "@/lib/services/tenant.service";
import {
    Database,
    CreditCard,
    Settings,
    Loader2,
    Zap,
    CheckCircle2,
    XCircle,
    Globe,
    ShareIcon
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
    Option
} from "@material-tailwind/react";
import { toast } from "sonner";

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
            await TenantService.updateSettings(settings); // Assuming specific updateSettings method exists or using generic update
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
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="mt-4 mb-8 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Typography variant="h3" color="white" className="font-bold" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                        Integraciones
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal text-blue-gray-200" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                        Configura las conexiones con servicios externos de facturación y pagos.
                    </Typography>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-500"
                    placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Guardar Cambios
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
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
                        {settings.facto?.enabled ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                            <XCircle className="h-4 w-4 text-blue-gray-400" />
                        )}
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
                            Pasarelas de Pago
                        </div>
                        {settings.payments?.webpay?.enabled ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                            <XCircle className="h-4 w-4 text-blue-gray-400" />
                        )}
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
                        {settings.factoring?.enabled ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                            <XCircle className="h-4 w-4 text-blue-gray-400" />
                        )}
                    </button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3">
                    <Card className="bg-[#1e293b] shadow-none border border-blue-gray-100/5" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                        {activeTab === 'facto' && (
                            <CardBody className="space-y-6 animate-in fade-in duration-300" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                                <div className="pb-6 border-b border-blue-gray-100/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500">
                                                <Database className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Typography variant="h6" color="white" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Configuración de Facto.cl</Typography>
                                                <Typography variant="small" className="text-blue-gray-200" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Emisión de Facturas y Boletas Electrónicas (Chile)</Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Typography variant="small" className="font-medium text-white" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                                                {settings.facto?.enabled ? 'Activado' : 'Desactivado'}
                                            </Typography>
                                            <Switch
                                                id="facto-enabled"
                                                color="blue"
                                                defaultChecked={settings.facto?.enabled || false}
                                                onChange={(e) => updateFacto('enabled', e.target.checked)}
                                                ripple={false}
                                                className="h-full w-full checked:bg-[#2ec946]"
                                                containerProps={{
                                                    className: "w-11 h-6",
                                                }}
                                                circleProps={{
                                                    className: "before:hidden left-0.5 border-none",
                                                }}
                                                crossOrigin={undefined}
                                                placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Input
                                                label="Username / Email"
                                                color="white"
                                                value={settings.facto?.username || ""}
                                                onChange={(e) => updateFacto('username', e.target.value)}
                                                placeholder="usuario@facto.cl"
                                                className="!border-t-blue-gray-200 focus:!border-t-white"
                                                crossOrigin={undefined}
                                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="password"
                                                label="Password"
                                                color="white"
                                                value={settings.facto?.password || ""}
                                                onChange={(e) => updateFacto('password', e.target.value)}
                                                placeholder="••••••••"
                                                className="!border-t-blue-gray-200 focus:!border-t-white"
                                                crossOrigin={undefined}
                                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                label="RUT Emisor"
                                                color="white"
                                                value={settings.facto?.rutEmisor || ""}
                                                onChange={(e) => updateFacto('rutEmisor', e.target.value)}
                                                placeholder="12.345.678-9"
                                                className="!border-t-blue-gray-200 focus:!border-t-white"
                                                crossOrigin={undefined}
                                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                label="WSDL URL (Opcional)"
                                                color="white"
                                                value={settings.facto?.wsdl || ""}
                                                onChange={(e) => updateFacto('wsdl', e.target.value)}
                                                placeholder="https://conexion.facto.cl/..."
                                                className="!border-t-blue-gray-200 focus:!border-t-white"
                                                crossOrigin={undefined}
                                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                        <div className="flex gap-3 text-blue-400">
                                            <Zap className="h-5 w-5 flex-shrink-0" />
                                            <div className="text-sm">
                                                <p className="font-bold mb-1">Nota importante</p>
                                                <p className="text-blue-gray-100">La integración con Facto.cl permite automatizar la emisión de Documentos Tributarios Electrónicos (DTE) directamente desde tus ventas.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        )}

                        {activeTab === 'payments' && (
                            <CardBody className="space-y-6 animate-in fade-in duration-300" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                                <div className="pb-6 border-b border-blue-gray-100/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                                                <CreditCard className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Typography variant="h6" color="white" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Webpay Plus (Transbank)</Typography>
                                                <Typography variant="small" className="text-blue-gray-200" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Cobros con Tarjetas de Débito y Crédito</Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Typography variant="small" className="font-medium text-white">
                                                {settings.payments?.webpay?.enabled ? 'Activado' : 'Desactivado'}
                                            </Typography>
                                            <Switch
                                                id="webpay-enabled"
                                                color="blue"
                                                defaultChecked={settings.payments?.webpay?.enabled || false}
                                                onChange={(e) => updateWebpay('enabled', e.target.checked)}
                                                ripple={false}
                                                className="h-full w-full checked:bg-[#2ec946]"
                                                containerProps={{
                                                    className: "w-11 h-6",
                                                }}
                                                circleProps={{
                                                    className: "before:hidden left-0.5 border-none",
                                                }}
                                                crossOrigin={undefined}
                                                placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Input
                                                label="Código de Comercio"
                                                color="white"
                                                value={settings.payments?.webpay?.commerceCode || ""}
                                                onChange={(e) => updateWebpay('commerceCode', e.target.value)}
                                                placeholder="5970..."
                                                className="!border-t-blue-gray-200 focus:!border-t-white"
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="password"
                                                label="API Key (Secreto)"
                                                color="white"
                                                value={settings.payments?.webpay?.apiKey || ""}
                                                onChange={(e) => updateWebpay('apiKey', e.target.value)}
                                                placeholder="••••••••••••••••"
                                                className="!border-t-blue-gray-200 focus:!border-t-white"
                                                crossOrigin={undefined}
                                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-blue-gray-300">
                                        <Globe className="h-3 w-3" />
                                        <span>Debes configurar la URL de respuesta en tu panel de Transbank.</span>
                                    </div>
                                </div>
                            </CardBody>
                        )}

                        {activeTab === 'factoring' && (
                            <CardBody className="space-y-6 animate-in fade-in duration-300" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                                <div className="pb-6 border-b border-blue-gray-100/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-500">
                                                <ShareIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Typography variant="h6" color="white" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Integración de Factoring</Typography>
                                                <Typography variant="small" className="text-blue-gray-200" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Cesión electrónica de facturas para obtención de liquidez</Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Typography variant="small" className="font-medium text-white">
                                                {settings.factoring?.enabled ? 'Activado' : 'Desactivado'}
                                            </Typography>
                                            <Switch
                                                id="factoring-enabled"
                                                color="blue"
                                                defaultChecked={settings.factoring?.enabled || false}
                                                onChange={(e) => updateFactoring('enabled', e.target.checked)}
                                                ripple={false}
                                                className="h-full w-full checked:bg-[#2ec946]"
                                                containerProps={{
                                                    className: "w-11 h-6",
                                                }}
                                                circleProps={{
                                                    className: "before:hidden left-0.5 border-none",
                                                }}
                                                crossOrigin={undefined}
                                                placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
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
                                                placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                                            >
                                                <Option value="cumplo">Cumplo</Option>
                                                <Option value="larrainvial">LarrainVial</Option>
                                                <Option value="other">Otro (Manual)</Option>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="password"
                                                label="API Key / Token de Acceso"
                                                color="white"
                                                value={settings.factoring?.apiKey || ""}
                                                onChange={(e) => updateFactoring('apiKey', e.target.value)}
                                                placeholder="••••••••••••••••"
                                                className="!border-t-blue-gray-200 focus:!border-t-white"
                                                crossOrigin={undefined}
                                            />
                                        </div>
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
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsPage;
