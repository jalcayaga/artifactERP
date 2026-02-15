import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          let newItems;
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            );
          } else {
            newItems = [...state.items, item];
          }
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, total: newTotal };
        });
      },
      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== itemId);
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, total: newTotal };
        });
      },
      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
          );
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, total: newTotal };
        });
      },
      clearCart: () => {
        set({ items: [], total: 0 });
      },
    }),
    {
      name: "cart-storage", // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
