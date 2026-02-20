"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { ClientIcon } from "./client-icon";
import { Button } from "@artifact/ui";

import { useSupabaseAuth } from "@artifact/core/client";
import { useTenant } from "@/hooks/use-tenant";
import { useCart } from "@/hooks/use-cart";
// import { useAuth } from "@/hooks/use-auth";
import { defaultTheme } from "@/lib/theme";
import { ThemeToggle } from "./theme/ThemeToggle";
import { Logo } from "./Logo";
import CartDrawer from "./store/CartDrawer";



const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/products" },
  { label: "Info", href: "/info" },
];

export function Header() {
  const { tenant } = useTenant();
  const { items } = useCart();
  const { user } = useSupabaseAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const storeName = tenant?.tenant?.name ?? "Artifact Storefront";
  const logoUrl = tenant?.branding?.logoUrl ?? defaultTheme.logoUrl;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
        ? "bg-[rgb(var(--bg-primary))]/80 border-b border-[rgb(var(--border-color))]"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="h-9 w-auto transition-transform group-hover:scale-105" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[rgb(var(--text-secondary))] transition hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative h-11 w-11 rounded-full border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))] hover:border-brand/40 hover:text-brand hover:bg-brand/10"
              aria-label="Abrir carrito"
            >
              <ClientIcon icon={ShoppingCart} className="h-5 w-5" />

              <span className={`absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand text-xs font-semibold text-black transition-transform ${mounted && cartCount > 0 ? 'scale-100' : 'scale-0'}`}>
                {mounted ? cartCount : 0}
              </span>
            </Button>

            {user ? (
              <Link href="/account" className="hidden sm:inline-flex">
                <Button variant="ghost" className="text-sm font-semibold text-brand hover:text-brand-light hover:bg-brand/10 border border-brand/20 bg-brand/5">
                  Mi Cuenta
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex">
                <Button variant="ghost" className="text-sm font-semibold text-[rgb(var(--text-secondary))] hover:text-brand hover:bg-brand/10">
                  Ingresar
                </Button>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))] transition hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/40 md:hidden"
              aria-label="Abrir menú"
            >
              <ClientIcon icon={Menu} className="h-5 w-5" />
            </button>
          </div>
        </nav >
        {
          isMenuOpen && (
            <div className="md:hidden">
              <div className="grid gap-2 border-t border-[rgb(var(--border-color))] py-4 bg-[rgb(var(--bg-primary))]/95 absolute left-0 right-0 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[rgb(var(--text-secondary))] transition hover:bg-brand/10 hover:text-brand"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[rgb(var(--text-secondary))] hover:bg-brand/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ingresar
                </Link>
              </div>
            </div>
          )
        }
      </div >
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header >
  );
}
