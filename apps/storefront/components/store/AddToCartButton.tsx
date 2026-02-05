"use client";

import React, { useState } from "react";
import { Button } from "@artifact/ui";
import { useCart } from "../../hooks/use-cart";
import { Product } from "../../lib/types";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
}) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    });

    // Trigger success state
    setIsAdded(true);
    toast.success(`${product.name} agregado al carrito`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full relative overflow-hidden bg-brand text-black font-bold text-lg py-6 rounded-xl transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(var(--color-brand-rgb),0.3)] hover:-translate-y-1 active:translate-y-0 active:scale-95 group"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:rotate-[-10deg]"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        Agregar al Carrito
      </span>
      {/* Shine effect overlay */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
    </Button>
  );
};

export default AddToCartButton;
