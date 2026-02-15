export interface CashRegister {
    id: string;
    name: string;
    code?: string;
    isActive: boolean;
    shifts?: PosShift[];
}

export interface PosShift {
    id: string;
    cashRegisterId: string;
    userId: string;
    startTime: string;
    endTime?: string;
    initialCash: number;
    finalCash?: number;
    status: 'OPEN' | 'CLOSED';
    notes?: string;
    cashRegister?: CashRegister;
    user?: { firstName?: string; lastName?: string; email: string };
    totalSales?: number;
    orderCount?: number;
}

export interface CartItem {
    id: string; // Product ID
    name: string;
    price: number;
    quantity: number;
    sku?: string;
    image?: string;
    taxRate: number; // e.g., 0.19
}

export interface PosState {
    register: CashRegister | null;
    shift: PosShift | null;
    cart: CartItem[];
}
