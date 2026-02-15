"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, Typography, Chip, Button } from "@material-tailwind/react";
import { Truck, FileText, Calendar, MapPin } from "lucide-react";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export default function DispatchesPage() {
    const { data: dispatches, isLoading } = useQuery({
        queryKey: ['dispatches'],
        queryFn: async () => {
            const res = await apiClient.get('/dispatches');
            return res.data;
        }
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Truck className="w-8 h-8 text-blue-500" />
                        Guías de Despacho
                    </h1>
                    <p className="text-gray-400">Historial de despachos y documentos de traslado.</p>
                </div>
            </div>

            <Card className="bg-slate-900 border border-white/10 overflow-hidden" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-white font-semibold">Folio / ID</th>
                                <th className="p-4 text-white font-semibold">Orden</th>
                                <th className="p-4 text-white font-semibold">Fecha</th>
                                <th className="p-4 text-white font-semibold">Destino</th>
                                <th className="p-4 text-white font-semibold">Estado</th>
                                <th className="p-4 text-white font-semibold">Transporte</th>
                                <th className="p-4 text-white font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={7} className="p-8 text-center text-gray-400">Cargando...</td></tr>
                            ) : dispatches?.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-gray-400">No hay guías de despacho registradas</td></tr>
                            ) : (
                                dispatches?.map((dispatch: any) => (
                                    <tr key={dispatch.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{dispatch.dispatchNumber || 'Borrador'}</div>
                                            <div className="text-xs text-gray-500 font-mono">{dispatch.id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="p-4">
                                            <Link href={`/sales/${dispatch.orderId}`} className="text-blue-400 hover:underline">
                                                #{dispatch.order?.orderNumber}
                                            </Link>
                                            <div className="text-sm text-gray-500">{dispatch.order?.customer?.name}</div>
                                        </td>
                                        <td className="p-4 text-white">
                                            {format(new Date(dispatch.createdAt), "dd MMM yyyy", { locale: es })}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-300">
                                                <MapPin size={14} className="text-gray-500" />
                                                <span className="truncate max-w-[200px]" title={dispatch.destinationAddress}>
                                                    {dispatch.destinationAddress}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={dispatch.status}
                                                color={dispatch.status === 'DELIVERED' ? "green" : "blue"}
                                                className="rounded-full text-center w-fit"
                                            />
                                        </td>
                                        <td className="p-4 text-white">
                                            {dispatch.courier?.name || 'Interno'}
                                            {dispatch.trackingNumber && (
                                                <div className="text-xs text-gray-500">Track: {dispatch.trackingNumber}</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/logistics/dispatches/${dispatch.id}`}>
                                                <Button size="sm" variant="text" color="blue" className="flex items-center gap-2 ml-auto" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <FileText size={16} /> Ver Guía
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
