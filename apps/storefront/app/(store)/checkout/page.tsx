"use client";

import { Button } from "@artifact/ui";
import { Input } from "@artifact/ui";
import React, { useState } from "react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pedido realizado con éxito (simulado)!\n" + JSON.stringify(formData, null, 2));
    // In a real app, you would send this data to your backend
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Información de Envío</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
          <Input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Código Postal</label>
            <Input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <Button type="submit" className="w-full py-3 text-lg">Confirmar Pedido</Button>
      </form>
    </div>
  );
}
