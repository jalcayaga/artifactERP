"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@artifact/ui";

import { useTenant } from "@/hooks/use-tenant";
import { defaultTheme } from "@/lib/theme";
import CartDrawer from "./store/CartDrawer";

const NAV_LINKS = [
  { label: "Productos", href: "/products" },
  // { label: "Soluciones", href: "/solutions" },
  // { label: "Precios", href: "/pricing" },
  // { label: "Contacto", href: "/contact" },
];

export function Header() {
  const { tenant } = useTenant();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const storeName = tenant?.tenant?.name ?? "Artifact Storefront";
  const logoUrl = tenant?.branding?.logoUrl ?? defaultTheme.logoUrl;

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/65">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 via-brand/30 to-brand/60 shadow-md shadow-brand/20">
              <Image
                src={logoUrl}
                alt={storeName}
                width={34}
                height={34}
                className="rounded-xl object-contain"
              />
            </span>
            <div>
              <span className="block font-semibold text-slate-900">
                {storeName}
              </span>
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                Ecommerce · ERP · DTE
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative h-11 w-11 rounded-full border border-slate-200 bg-white shadow-sm text-slate-600 hover:border-brand/40 hover:text-brand"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                0
              </span>
            </Button>
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" className="text-sm font-semibold text-slate-700 hover:text-brand">
                Ingresar
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/40 md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="grid gap-2 border-t border-slate-200 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Ingresar
              </Link>
            </div>
          </div>
        )}
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
