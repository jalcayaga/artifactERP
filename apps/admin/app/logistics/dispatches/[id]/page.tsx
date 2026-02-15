"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Chip } from "@material-tailwind/react";
import { ArrowLeft, Truck, MapPin, Calendar, Package, Printer } from "lucide-react";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DispatchDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: dispatch, isLoading } = useQuery({
        queryKey: ['dispatch', id],
        queryFn: async () => {
            const res = await apiClient.get(`/dispatches/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    if (isLoading) return <div className="p-8 text-center text-white">Cargando información del despacho...</div>;
    if (!dispatch) return <div className="p-8 text-center text-white">No se encontró el despacho.</div>;

    return (
        <div className="min-h-screen bg-[#0b1120] print:bg-white">
            {/* HEADER ACTION BAR (Hidden on Print) */}
            <div className="sticky top-0 z-10 bg-[#0b1120]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center print:hidden">
                <div className="flex items-center gap-4">
                    <Button
                        variant="text"
                        color="white"
                        className="flex items-center gap-2 pl-0 hover:bg-white/5 text-blue-200"
                        onClick={() => router.back()}
                        placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                    >
                        <ArrowLeft size={18} /> Volver
                    </Button>
                    <div className="h-6 w-px bg-white/10"></div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-3">
                        Guía de Despacho #{dispatch.dispatchNumber || 'PENDIENTE'}
                        <Chip
                            value={dispatch.status}
                            color={dispatch.status === 'DELIVERED' ? "green" : "blue"}
                            className="rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] border border-blue-400/20"
                        />
                    </h1>
                </div>
                <Button
                    color="blue"
                    className="flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all duration-300"
                    placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                    onClick={() => window.print()}
                >
                    <Printer size={18} /> Imprimir Documento
                </Button>
            </div>

            {/* DOCUMENT CONTAINER */}
            <div className="max-w-[210mm] mx-auto my-8 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl relative print:border-none print:shadow-none print:m-0 print:w-full print:max-w-none print:bg-white print:text-black">

                {/* Decorative Gradient Glow (Screen only) */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl print:hidden text-white pointer-events-none"></div>

                {/* DOCUMENT HEADER */}
                <div className="p-8 border-b border-white/5 print:border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-white print:text-black mb-1">GUÍA DE DESPACHO</h2>
                            <p className="text-blue-400 font-mono print:text-gray-600">FOLIO: {dispatch.dispatchNumber || '---'}</p>
                            <p className="text-sm text-gray-400 mt-4 print:text-gray-600">
                                Fecha Emisión: {format(new Date(dispatch.dispatchDate), "dd 'de' MMMM, yyyy - HH:mm", { locale: es })}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="bg-white/5 p-4 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                                <p className="text-xs uppercase text-gray-500 font-bold mb-1">Referencia Orden</p>
                                <p className="text-xl font-mono text-white print:text-black">#{dispatch.order?.orderNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOGISTICS INFO GRID */}
                <div className="grid grid-cols-2 gap-px bg-white/5 print:bg-gray-200 border-b border-white/5 print:border-gray-200">
                    <div className="bg-slate-900 print:bg-white p-6">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <MapPin size={14} /> Origen
                        </h3>
                        <p className="text-gray-300 print:text-black text-sm leading-relaxed">
                            {dispatch.originAddress || 'Dirección de Bodega Central'}
                        </p>
                    </div>
                    <div className="bg-slate-900 print:bg-white p-6">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <MapPin size={14} /> Destino
                        </h3>
                        <p className="text-gray-300 print:text-black text-sm leading-relaxed">
                            {dispatch.destinationAddress || 'Dirección del Cliente'}
                        </p>
                    </div>
                    <div className="bg-slate-900 print:bg-white p-6">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Truck size={14} /> Transporte
                        </h3>
                        <p className="text-white print:text-black font-medium">{dispatch.courier?.name || 'Transporte Propio'}</p>
                        {dispatch.trackingNumber && (
                            <p className="text-sm text-gray-500 mt-1">Tracking: {dispatch.trackingNumber}</p>
                        )}
                    </div>
                    <div className="bg-slate-900 print:bg-white p-6">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Package size={14} /> Cliente
                        </h3>
                        <p className="text-white print:text-black font-medium">{dispatch.order?.customer?.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{dispatch.order?.customer?.email}</p>
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <div className="p-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 print:bg-gray-100 border-b border-white/5 print:border-gray-200 text-xs uppercase text-gray-400 print:text-gray-600 font-bold">
                                <th className="p-4 pl-8">Código</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4 text-right pr-8">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 print:divide-gray-200">
                            {dispatch.items?.map((item: any) => (
                                <tr key={item.id} className="text-sm hover:bg-white/5 transition-colors print:hover:bg-transparent">
                                    <td className="p-4 pl-8 text-gray-400 print:text-gray-600 font-mono">{item.orderItem?.product?.sku || '---'}</td>
                                    <td className="p-4 text-white print:text-black font-medium">{item.orderItem?.product?.name}</td>
                                    <td className="p-4 pr-8 text-right text-white print:text-black font-bold text-lg">{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER / NOTES */}
                {dispatch.notes && (
                    <div className="p-8 border-t border-white/5 print:border-gray-200 bg-white/5 print:bg-gray-50">
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Observaciones</h3>
                        <p className="text-gray-300 print:text-black italic text-sm">{dispatch.notes}</p>
                    </div>
                )}

                {/* SIGNATURE SECTION (PRINT ONLY) */}
                <div className="hidden print:flex justify-between items-end mt-20 p-8 pt-0">
                    <div className="text-center w-64 border-t border-gray-400 pt-2">
                        <p className="text-sm font-bold text-black">Firma Despacho</p>
                        <p className="text-xs text-gray-500">Bodega</p>
                    </div>
                    <div className="text-center w-64 border-t border-gray-400 pt-2">
                        <p className="text-sm font-bold text-black">Firma Recepción</p>
                        <p className="text-xs text-gray-500">Cliente / Transportista</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
