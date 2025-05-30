// app/page.tsx
import React from 'react';
import Link from 'next/link'; // Use Next.js Link for navigation
import { ECOMMERCE_APP_NAME } from '@/constants';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Bienvenido a {ECOMMERCE_APP_NAME}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Tu nueva tienda online y plataforma de gestión.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/products" // Example link to a future public products page (e-commerce)
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Explorar Productos
          </Link>
          <Link href="/admin/dashboard" className="text-sm font-semibold leading-6 text-foreground">
            Ir al Panel ERP <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}