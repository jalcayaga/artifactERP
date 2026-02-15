import { apiClient } from '@/lib/api';
import { CashRegister, PosShift } from './types';

export const PosService = {
    async createRegister(name: string, code?: string): Promise<CashRegister> {
        return await apiClient.post<CashRegister>('/pos/registers', { name, code });
    },

    async getRegisters(): Promise<CashRegister[]> {
        return await apiClient.get<CashRegister[]>('/pos/registers');
    },

    async openShift(registerId: string, initialCash: number): Promise<PosShift> {
        return await apiClient.post<PosShift>('/pos/shifts/open', { registerId, initialCash });
    },

    async closeShift(shiftId: string, finalCash: number, notes?: string): Promise<PosShift> {
        return await apiClient.post<PosShift>(`/pos/shifts/${shiftId}/close`, { finalCash, notes });
    },

    async getShift(shiftId: string): Promise<PosShift> {
        return await apiClient.get<PosShift>(`/pos/shifts/${shiftId}`);
    }
};
