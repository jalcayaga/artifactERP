"use client";

import React from "react";
import { Button } from "@artifact/ui";
import { useCart } from "../../hooks/use-cart";
import { Product } from "../../lib/types";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
}) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    });
    alert(`Producto ${product.name} añadido al carrito.`);
  };

  return <Button onClick={handleAddToCart}>Agregar al Carrito</Button>;
};

export default AddToCartButton;
