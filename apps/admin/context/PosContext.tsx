'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CashRegister, PosShift, CartItem } from '@/lib/pos/types';
import { PosService } from '@/lib/pos/service';
import { useSupabaseAuth } from '@artifact/core/client';
import { offlineStore, OfflineSale } from '@/lib/offline-store';
import { toast } from 'sonner';
import { SaleService } from '@artifact/core/client'; // Needed for sync

interface PosContextType {
    register: CashRegister | null;
    shift: PosShift | null;
    cart: CartItem[];
    isLoading: boolean;
    isOffline: boolean;
    pendingSalesCount: number;
    setRegister: (register: CashRegister) => void;
    openShift: (initialCash: number) => Promise<void>;
    closeShift: (finalCash: number, notes?: string) => Promise<void>;
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    refreshShift: () => Promise<void>;
    saveOfflineSale: (saleData: any) => Promise<void>;
    resumeShift: (shift: PosShift) => Promise<void>;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export function PosProvider({ children }: { children: React.ReactNode }) {
    const { user } = useSupabaseAuth();
    const [register, setRegister] = useState<CashRegister | null>(null);
    const [shift, setShift] = useState<PosShift | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [pendingSalesCount, setPendingSalesCount] = useState(0);

    // Load state from local storage on mount
    useEffect(() => {
        const savedRegister = localStorage.getItem('pos_register');
        const savedShiftId = localStorage.getItem('pos_shift_id');

        if (savedRegister) {
            setRegister(JSON.parse(savedRegister));
        }

        if (savedShiftId) {
            refreshShift(savedShiftId);
        }

        // Initialize Offline Detection
        if (typeof window !== 'undefined') {
            setIsOffline(!navigator.onLine);
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);

            // Check for pending sales on load
            checkPendingSales();
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('online', handleOnline);
                window.removeEventListener('offline', handleOffline);
            }
        };
    }, []);

    const handleOnline = () => {
        setIsOffline(false);
        toast.info("Conexión restaurada. Intentando sincronizar ventas...", { duration: 3000 });
        syncPendingSales();
    };

    const handleOffline = () => {
        setIsOffline(true);
        toast.warning("Sin conexión. Modo Offline activado.", { duration: 4000 });
    };

    const checkPendingSales = async () => {
        try {
            const sales = await offlineStore.getPendingSales();
            setPendingSalesCount(sales.length);
        } catch (e) {
            console.error("Error checking pending sales:", e);
        }
    };

    const syncPendingSales = async () => {
        try {
            const sales = await offlineStore.getPendingSales();
            if (sales.length === 0) return;

            let syncedCount = 0;
            for (const sale of sales) {
                try {
                    // Strip offline fields
                    const { tempId, createdAt, retryCount, ...salePayload } = sale;

                    await SaleService.createSale(salePayload as any);

                    // If success, remove from offline store
                    await offlineStore.removePendingSale(sale.tempId);
                    syncedCount++;
                } catch (error) {
                    console.error("Failed to sync sale:", sale.tempId, error);
                    // Keep in store to retry later
                }
            }

            if (syncedCount > 0) {
                toast.success(`${syncedCount} ventas sincronizadas con éxito.`);
            }
            checkPendingSales();
        } catch (e) {
            console.error("Sync error:", e);
        }
    };

    // Save register to local storage when changed
    useEffect(() => {
        if (register) {
            localStorage.setItem('pos_register', JSON.stringify(register));
        } else {
            localStorage.removeItem('pos_register');
        }
    }, [register]);

    const refreshShift = async (shiftId?: string) => {
        const idToFetch = shiftId || shift?.id;
        if (!idToFetch) return;

        setIsLoading(true);
        try {
            const fetchedShift = await PosService.getShift(idToFetch);
            if (fetchedShift && fetchedShift.status === 'OPEN') {
                setShift(fetchedShift);
                localStorage.setItem('pos_shift_id', fetchedShift.id);
                localStorage.setItem('pos_shift_data', JSON.stringify(fetchedShift));
            } else {
                setShift(null);
                localStorage.removeItem('pos_shift_id');
                localStorage.removeItem('pos_shift_data');
            }
        } catch (error) {
            console.error('Error refreshing shift:', error);

            // If offline, try to recover from local storage
            if (!navigator.onLine) {
                const cachedShift = localStorage.getItem('pos_shift_data');
                if (cachedShift) {
                    try {
                        const parsedShift = JSON.parse(cachedShift);
                        if (parsedShift.id === idToFetch) {
                            setShift(parsedShift);
                            toast.warning("Modo Offline: Usando sesión local.");
                            setIsLoading(false);
                            return;
                        }
                    } catch (parseErr) {
                        console.error("Error parsing cached shift", parseErr);
                    }
                }
            }

            // If we are here, we couldn't recover
            // Check if we assume offline mode without explicit navigator.onLine (sometimes unreliable)
            // But if request failed, likely we can't do much.
            // Only clear if we are sure it's invalid, or if we are online.
            if (navigator.onLine) {
                setShift(null);
                localStorage.removeItem('pos_shift_id');
                localStorage.removeItem('pos_shift_data');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const openShift = async (initialCash: number) => {
        if (!register) throw new Error('No register selected');
        setIsLoading(true);
        try {
            const newShift = await PosService.openShift(register.id, initialCash);
            setShift(newShift);
            localStorage.setItem('pos_shift_id', newShift.id);
            localStorage.setItem('pos_shift_data', JSON.stringify(newShift));
        } finally {
            setIsLoading(false);
        }
    };

    const closeShift = async (finalCash: number, notes?: string) => {
        if (!shift) throw new Error('No active shift');
        setIsLoading(true);
        try {
            await PosService.closeShift(shift.id, finalCash, notes);
            setShift(null);
            localStorage.removeItem('pos_shift_id');
            localStorage.removeItem('pos_shift_data');
            setCart([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (item: CartItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(i => i.id !== productId));
    };

    const clearCart = () => setCart([]);

    const saveOfflineSale = async (saleData: any) => {
        const offlineSale: OfflineSale = {
            ...saleData,
            tempId: crypto.randomUUID(),
            createdAt: Date.now(),
            retryCount: 0
        };

        await offlineStore.savePendingSale(offlineSale);
        setPendingSalesCount(prev => prev + 1);
        toast.success("Venta guardada localmente (Offline)", { duration: 3000 });
    };

    const resumeShift = async (existingShift: PosShift) => {
        setShift(existingShift);
        localStorage.setItem('pos_shift_id', existingShift.id);
        localStorage.setItem('pos_shift_data', JSON.stringify(existingShift));
        toast.success('Turno reanudado exitosamente');
    };

    return (
        <PosContext.Provider value={{
            register,
            shift,
            cart,
            isLoading,
            isOffline,
            pendingSalesCount,
            setRegister,
            openShift,
            closeShift,
            addToCart,
            removeFromCart,
            clearCart,
            refreshShift: () => refreshShift(),
            saveOfflineSale,
            resumeShift
        }}>
            {children}
        </PosContext.Provider>
    );
}

export const usePos = () => {
    const context = useContext(PosContext);
    if (!context) throw new Error('usePos must be used within PosProvider');
    return context;
};
