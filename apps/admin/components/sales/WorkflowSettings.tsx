'use client';

import React from 'react';
import { OrderStatus } from '@artifact/core';
import {
    Typography,
    Input,
    Card,
    CardBody,
    Switch
} from "@material-tailwind/react";
import {
    Settings2,
    Type,
    Info
} from 'lucide-react';

interface WorkflowSettingsProps {
    settings: any;
    onUpdate: (field: string, value: any) => void;
}

const statusLabels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING_PAYMENT]: 'Pendiente de Pago',
    [OrderStatus.PROCESSING]: 'En Proceso',
    [OrderStatus.SHIPPED]: 'Enviada',
    [OrderStatus.DELIVERED]: 'Entregada',
    [OrderStatus.CANCELLED]: 'Cancelada',
    [OrderStatus.COMPLETED]: 'Completada',
    [OrderStatus.REFUNDED]: 'Reembolsada',
};

const WorkflowSettings: React.FC<WorkflowSettingsProps> = ({ settings, onUpdate }) => {
    const workflowSettings = settings.workflow || {
        customLabels: {},
        enabled: true
    };

    const handleLabelChange = (status: string, value: string) => {
        onUpdate('workflow', {
            ...workflowSettings,
            customLabels: {
                ...workflowSettings.customLabels,
                [status]: value
            }
        });
    };

    const toggleWorkflow = (enabled: boolean) => {
        onUpdate('workflow', {
            ...workflowSettings,
            enabled
        });
    };

    return (
        <CardBody className="space-y-8 animate-in fade-in duration-300">
            <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                            <Settings2 className="h-8 w-8" />
                        </div>
                        <div>
                            <Typography variant="h5" color="white" className="font-bold">Personalización del Flujo de Ventas</Typography>
                            <Typography variant="small" className="text-blue-gray-200 max-w-md">
                                Define cómo quieres que se llamen los estados de tus ventas en el tablero Kanban y en los listados.
                            </Typography>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                        <Typography variant="small" className="font-medium text-white">Activar Flujo:</Typography>
                        <Switch
                            color="blue"
                            checked={workflowSettings.enabled}
                            onChange={(e) => toggleWorkflow(e.target.checked)}
                            placeholder=""
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <Type className="h-4 w-4 text-blue-400" />
                        <Typography variant="h6" color="white" className="font-bold uppercase tracking-widest text-[10px]">
                            Etiquetas Personalizadas
                        </Typography>
                    </div>

                    <div className="space-y-4">
                        {[
                            OrderStatus.PENDING_PAYMENT,
                            OrderStatus.PROCESSING,
                            OrderStatus.SHIPPED,
                            OrderStatus.DELIVERED,
                            OrderStatus.COMPLETED,
                            OrderStatus.CANCELLED
                        ].map((status) => (
                            <div key={status} className="flex flex-col gap-2">
                                <Typography variant="small" color="blue-gray" className="font-bold text-[10px] uppercase tracking-tighter opacity-70">
                                    {statusLabels[status]} (Original)
                                </Typography>
                                <Input
                                    label={`Nombre para "${statusLabels[status]}"`}
                                    color="white"
                                    value={workflowSettings.customLabels?.[status] || ""}
                                    onChange={(e) => handleLabelChange(status, e.target.value)}
                                    placeholder={statusLabels[status]}
                                    className="!border-white/10 focus:!border-blue-500 transition-all bg-white/5"
                                    placeholder=""
                                    crossOrigin={undefined}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <Info className="h-4 w-4 text-blue-400" />
                        <Typography variant="h6" color="white" className="font-bold uppercase tracking-widest text-[10px]">
                            Información de Uso
                        </Typography>
                    </div>

                    <Card className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl">
                        <Typography variant="small" className="text-blue-gray-200 leading-relaxed">
                            Las etiquetas que definas aquí se usarán de forma global en el portal administrativo:
                        </Typography>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                <Typography className="text-[11px] text-blue-gray-300">
                                    <b>Tablero Kanban</b>: Encabezados de columna.
                                </Typography>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                <Typography className="text-[11px] text-blue-gray-300">
                                    <b>Lista de Ventas</b>: Etiquetas de estado (Badges).
                                </Typography>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                <Typography className="text-[11px] text-blue-gray-300">
                                    <b>Reportes</b>: Los nombres personalizados se mantendrán para consistencia.
                                </Typography>
                            </li>
                        </ul>
                        <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                            <Typography className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest">Nota Importante:</Typography>
                            <Typography className="text-[10px] text-blue-gray-200 mt-1">
                                La lógica interna del sistema (descuento de stock, facturación) sigue vinculada al estado original. Renombrar un estado no cambia su función operativa.
                            </Typography>
                        </div>
                    </Card>
                </div>
            </div>
        </CardBody>
    );
};

export default WorkflowSettings;
