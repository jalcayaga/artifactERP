'use client';

import React, { useState, useEffect } from 'react';
import { usePos } from '@/context/PosContext';
import { PosService } from '@/lib/pos/service';
import { CashRegister } from '@/lib/pos/types';
import {
    Typography,
    Button,
    Spinner,
} from '@material-tailwind/react';
import { ComputerDesktopIcon, KeyIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function ShiftManager() {
    const { setRegister, openShift, register, isLoading: posLoading, resumeShift } = usePos();
    const [registers, setRegisters] = useState<CashRegister[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [initialCash, setInitialCash] = useState<number>(0);
    const [formattedCash, setFormattedCash] = useState<string>('');

    const fetchRegisters = async () => {
        setIsLoading(true);
        try {
            const data = await PosService.getRegisters();
            setRegisters(data);

            // Fix: Sync context register with fresh data
            if (register) {
                const freshRegister = data.find(r => r.id === register.id);
                if (freshRegister) {
                    // Update with fresh data (e.g. shifts)
                    setRegister(freshRegister);
                } else {
                    // Register from local storage no longer exists or access lost
                    console.warn(`Register ${register.id} not found in valid registers list. Clearing selection.`);
                    setRegister(null as any); // Force clear
                    toast.error('La caja seleccionada ya no está disponible. Por favor seleccione otra.');
                }
            }
        } catch (error) {
            console.error('Error fetching registers:', error);
            toast.error('No se pudieron cargar las cajas registradoras');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateDefaultRegister = async () => {
        setIsLoading(true);
        try {
            await PosService.createRegister('Caja Principal', 'CAJA-01');
            toast.success('Caja Principal creada exitosamente');
            await fetchRegisters();
        } catch (error) {
            console.error('Error creating register:', error);
            toast.error('Error al crear la caja automática');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRegisters();
    }, []);

    const handleOpenShift = async () => {
        if (!register) {
            toast.error('Debe seleccionar una caja');
            return;
        }
        console.log('Attempting to open shift with register:', register);
        try {
            await openShift(initialCash);
            toast.success('Turno abierto exitosamente');
        } catch (error) {
            console.error('Error opening shift:', error);
            toast.error('Error al abrir el turno');
        }
    };

    const handleResumeShift = async () => {
        if (!register || !register.shifts || register.shifts.length === 0) return;
        const shift = register.shifts[0];
        try {
            await resumeShift(shift);
        } catch (error) {
            console.error("Error resuming shift", error);
            toast.error("No se pudo reanudar el turno");
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL').format(value);
    };

    const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove non-numeric characters
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const numberValue = parseInt(rawValue, 10);

        if (isNaN(numberValue)) {
            setInitialCash(0);
            setFormattedCash('');
        } else {
            setInitialCash(numberValue);
            setFormattedCash(formatCurrency(numberValue));
        }
    };

    const setQuickCash = (amount: number) => {
        setInitialCash(amount);
        setFormattedCash(formatCurrency(amount));
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-full min-h-[400px]">
                <Spinner className="h-12 w-12 text-blue-500" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />
                <Typography className="mt-4 text-slate-400 font-medium animate-pulse">Cargando cajas registradoras...</Typography>
            </div>
        );
    }

    // LIST OF REGISTERS VIEW
    if (!register) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 animate-in fade-in duration-500">
                {registers.map((reg) => {
                    const hasActiveShift = reg.shifts && reg.shifts.length > 0 && reg.shifts[0].status === 'OPEN';
                    return (
                        <div
                            key={reg.id}
                            onClick={() => setRegister(reg)}
                            className={`
                                relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-300 group
                                backdrop-blur-xl border
                                ${hasActiveShift
                                    ? 'bg-green-900/10 border-green-500/30 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]'
                                    : 'bg-slate-900/40 border-white/5 hover:border-blue-500/50 hover:bg-slate-900/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                                }
                            `}
                        >
                            <div className="flex flex-col items-center text-center z-10 relative">
                                <div className={`
                                    p-4 rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110
                                    ${hasActiveShift ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}
                                `}>
                                    <ComputerDesktopIcon className="h-10 w-10" />
                                </div>
                                <Typography variant="h5" color="white" className="font-bold mb-1 tracking-tight">
                                    {reg.name}
                                </Typography>
                                <Typography className="text-slate-500 text-sm font-medium">
                                    {reg.code || 'CAJA-GEN'}
                                </Typography>

                                {hasActiveShift && (
                                    <div className="mt-4 px-4 py-1.5 bg-green-500/10 rounded-full border border-green-500/20 shadow-sm">
                                        <Typography className="text-[10px] uppercase font-bold text-green-400 tracking-wider flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            Turno Activo
                                        </Typography>
                                    </div>
                                )}

                                <div className={`
                                    mt-8 text-sm font-semibold uppercase tracking-wider transition-colors
                                    ${hasActiveShift ? 'text-green-500 group-hover:text-green-400' : 'text-blue-500 group-hover:text-blue-400'}
                                `}>
                                    {hasActiveShift ? 'Reanudar Caja' : 'Seleccionar Caja'}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {registers.length === 0 && (
                    <div className="col-span-full py-24 px-6 text-center bg-slate-900/40 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center backdrop-blur-sm">
                        <div className="p-6 bg-slate-800/50 rounded-3xl mb-6">
                            <ComputerDesktopIcon className="h-16 w-16 text-slate-600" />
                        </div>
                        <Typography color="white" className="font-bold text-2xl mb-3">
                            No hay cajas configuradas
                        </Typography>
                        <Typography className="text-slate-400 text-base mb-10 max-w-md mx-auto leading-relaxed">
                            Para comenzar a vender, el sistema necesita al menos una caja registradora activa.
                        </Typography>
                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-lg shadow-blue-500/20 normal-case text-base px-8"
                                onClick={handleCreateDefaultRegister}
                                disabled={isLoading}
                            >
                                {isLoading ? <Spinner className="h-5 w-5" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} /> : 'Crear Caja Automática'}
                            </Button>
                            <Button
                                variant="text"
                                className="text-slate-400 hover:text-white normal-case text-base"
                                onClick={() => window.location.href = '/'}
                            >
                                Volver al Dashboard
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const activeShift = register.shifts?.find(s => s.status === 'OPEN');
    console.log('ShiftManager Render:', { register, shifts: register.shifts, activeShift });

    // RESUME SHIFT VIEW
    if (activeShift) {
        return (
            <div className="flex justify-center items-center p-6 h-full animate-in zoom-in-95 duration-300">
                <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.1)] rounded-3xl p-10 text-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-green-400 to-green-600" />

                    <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/30">
                        <KeyIcon className="h-10 w-10 text-green-500" />
                    </div>

                    <Typography variant="h3" color="white" className="font-bold mb-2 tracking-tight">
                        Turno Activo
                    </Typography>
                    <Typography className="text-slate-400 mb-10 text-lg">
                        La caja <strong className="text-white">{register.name}</strong> ya tiene un turno abierto.
                    </Typography>

                    <div className="space-y-4">
                        <Button
                            fullWidth
                            size="lg"
                            className="bg-green-600 hover:bg-green-500 shadow-xl shadow-green-500/20 py-4 text-base font-bold rounded-xl normal-case"
                            onClick={handleResumeShift}
                        >
                            Reanudar Operación
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            className="text-slate-500 hover:text-white normal-case"
                            onClick={() => setRegister(null as any)}
                        >
                            Cambiar de Caja
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // OPEN SHIFT VIEW
    return (
        <div className="flex justify-center items-center p-6 h-full animate-in zoom-in-95 duration-300">
            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10 relative">
                {/* Header */}
                <div className="flex items-center gap-5 mb-10">
                    <div className="p-4 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] rotate-3">
                        <KeyIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <Typography variant="h4" color="white" className="font-bold tracking-tight">
                            Abrir Turno
                        </Typography>
                        <Typography className="text-slate-400 font-medium">
                            {register.name}
                        </Typography>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Input Amount */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <Typography className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                Monto Inicial (CLP)
                            </Typography>
                            <CurrencyDollarIcon className="h-4 w-4 text-slate-500" />
                        </div>

                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xl group-focus-within:text-blue-500 transition-colors">$</span>
                            <input
                                type="text"
                                className="w-full !bg-slate-950 !text-white border border-white/10 rounded-2xl py-5 pl-10 pr-5 text-3xl font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-800 text-right tabular-nums shadow-none autofill:bg-slate-950"
                                style={{
                                    backgroundColor: '#020617',
                                    color: 'white',
                                    boxShadow: 'none'
                                }}
                                placeholder="0"
                                value={formattedCash}
                                onChange={handleCashChange}
                                autoFocus
                                autoComplete="off"
                            />
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {[50000, 100000, 150000, 200000].map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setQuickCash(amount)}
                                    className="py-2.5 px-1 bg-slate-800/50 hover:bg-blue-600 hover:text-white border border-white/5 hover:border-blue-500/50 rounded-xl text-xs font-bold text-slate-400 transition-all duration-200 active:scale-95"
                                >
                                    ${amount / 1000}k
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 pt-2">
                        <Button
                            fullWidth
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20 py-4 text-base font-bold rounded-xl normal-case"
                            onClick={handleOpenShift}
                            disabled={posLoading}
                        >
                            {posLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner className="h-5 w-5" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />
                                    <span>Abriendo...</span>
                                </div>
                            ) : (
                                'Iniciar Turno'
                            )}
                        </Button>

                        <Button
                            fullWidth
                            variant="text"
                            className="text-slate-500 hover:text-white normal-case"
                            onClick={() => setRegister(null as any)}
                        >
                            Cambiar Caja
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
