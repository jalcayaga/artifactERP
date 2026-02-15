'use client';

import { useRouter } from 'next/navigation';
import { usePos } from '@/context/PosContext';
import ShiftManager from '@/components/pos/ShiftManager';
import { Typography, Button, Card, CardBody } from '@material-tailwind/react';
import {
    ShoppingCartIcon,
    BanknotesIcon,
    ClockIcon,
    CheckBadgeIcon,
    ArrowPathIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { formatCurrencyChilean } from '@artifact/core';

export default function PosAdminDashboard() {
    const { shift, isLoading, refreshShift, closeShift } = usePos();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 border-t-2 border-l-2 border-blue-500 rounded-full animate-spin mb-4"></div>
                    <Typography className="text-slate-400 font-medium animate-pulse">Cargando Dashboard POS...</Typography>
                </div>
            </div>
        );
    }

    if (shift) {
        return (
            <div className="flex-1 flex flex-col p-4 md:p-8">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <Typography variant="h2" color="white" className="font-black tracking-tight mb-2">
                                Dashboard POS
                            </Typography>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                <Typography className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                                    Turno Abierto: {shift.cashRegister?.name}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="text"
                                color="white"
                                className="flex items-center gap-2 border border-white/10 hover:bg-white/5 lowercase font-normal"
                                onClick={() => refreshShift()}
                                placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                            >
                                <ArrowPathIcon className="h-4 w-4" />
                                Actualizar
                            </Button>
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-500 flex items-center gap-2 px-8 rounded-2xl font-black shadow-xl shadow-blue-500/20"
                                onClick={() => router.push('/pos/terminal')}
                                placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                            >
                                IR A CAJA (TOTEM)
                                <ArrowRightIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatsCard
                            title="Ventas del Turno"
                            value={formatCurrencyChilean(shift.totalSales || 0)}
                            icon={<BanknotesIcon className="h-8 w-8 text-green-400" />}
                        />
                        <StatsCard
                            title="Total Órdenes"
                            value={(shift.orderCount || 0).toString()}
                            icon={<ShoppingCartIcon className="h-8 w-8 text-blue-400" />}
                        />
                        <StatsCard
                            title="Monto Inicial"
                            value={formatCurrencyChilean(shift.initialCash)}
                            icon={<CheckBadgeIcon className="h-8 w-8 text-amber-400" />}
                        />
                        <StatsCard
                            title="Tiempo Transcurrido"
                            value={calculateDuration(shift.startTime)}
                            icon={<ClockIcon className="h-8 w-8 text-purple-400" />}
                        />
                    </div>

                    {/* Quick Actions & Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                        <Card className="lg:col-span-2 bg-[#0b1120] border border-white/5 rounded-[1.5rem] overflow-hidden shadow-2xl" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <CardBody className="p-8" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <Typography variant="h5" color="white" className="font-black mb-6">
                                    Información de Sesión
                                </Typography>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <DetailItem label="Cajero" value={shift.user ? `${shift.user.firstName || ''} ${shift.user.lastName || ''}`.trim() || shift.user.email : shift.userId} />
                                        <DetailItem label="Terminal" value={shift.cashRegister?.name || 'N/A'} />
                                        <DetailItem label="Código" value={shift.cashRegister?.code || 'P01'} />
                                    </div>
                                    <div className="space-y-4">
                                        <DetailItem label="Apertura" value={new Date(shift.startTime).toLocaleString()} />
                                        <DetailItem label="Estado" value="ACTIVO" isBadge />
                                        <DetailItem label="Sucursal" value="Principal" />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-[#0b1120] border border-white/5 rounded-[1.5rem] overflow-hidden shadow-2xl" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <CardBody className="p-8 flex flex-col h-full" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <Typography variant="h5" color="white" className="font-black mb-6">
                                    Finalizar Turno
                                </Typography>
                                <Typography className="text-slate-400 text-sm mb-8">
                                    Cierra la sesión para realizar el arqueo y liberar esta terminal.
                                </Typography>
                                <div className="mt-auto">
                                    <Button
                                        variant="outlined"
                                        color="red"
                                        fullWidth
                                        className="flex items-center justify-center gap-2 border-red-500/20 hover:bg-red-500/5 py-3 rounded-xl font-bold"
                                        onClick={() => {
                                            if (window.confirm('¿Está seguro de cerrar el turno actual?')) {
                                                closeShift(Number(shift.totalSales || 0) + Number(shift.initialCash));
                                            }
                                        }}
                                        placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                    >
                                        Cerrar Turno de Caja
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-4 md:p-8">
            <div className="max-w-6xl mx-auto w-full">
                <header className="mb-12 flex flex-col items-center">
                    <Typography variant="h2" color="white" className="font-black tracking-tighter mb-2">
                        Punto de Venta
                    </Typography>
                    <Typography className="text-slate-500 uppercase font-bold tracking-[0.3em] text-[10px]">
                        Seleccione una registradora para ingresar a la terminal
                    </Typography>
                </header>

                <ShiftManager />
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <Card className="bg-[#0b1120] border border-white/5 rounded-[1.5rem] overflow-hidden shadow-xl" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <CardBody className="p-6" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="flex items-start justify-between">
                    <div>
                        <Typography className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{title}</Typography>
                        <Typography variant="h4" color="white" className="font-black" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{value}</Typography>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl">
                        {icon}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

function DetailItem({ label, value, isBadge = false }: { label: string; value: string; isBadge?: boolean }) {
    return (
        <div>
            <Typography className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{label}</Typography>
            {isBadge ? (
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-black bg-green-500/10 text-green-500 border border-green-500/20">
                    {value}
                </span>
            ) : (
                <Typography color="white" className="font-bold text-sm" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{value}</Typography>
            )}
        </div>
    );
}

function calculateDuration(startTime: string) {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const diff = now - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}
