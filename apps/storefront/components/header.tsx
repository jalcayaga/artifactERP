"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@artifact/ui";

import { useTenant } from "@/hooks/use-tenant";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { defaultTheme } from "@/lib/theme";
import CartDrawer from "./store/CartDrawer";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/products" },
  { label: "Nosotros", href: "/about" },
];

export function Header() {
  const { tenant } = useTenant();
  const { items } = useCart();
  const { user } = useAuth();
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

  const storeName = tenant?.name ?? "Artifact Storefront";
  const logoUrl = tenant?.branding?.logoUrl ?? defaultTheme.logoUrl;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
        ? "bg-black/70 backdrop-blur-xl backdrop-saturate-[180%] border-b border-white/10"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo-navbar.svg"
              alt="Artifact Logo"
              width={140}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-neutral-300 transition hover:text-brand"
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
              className="relative h-11 w-11 rounded-full border border-white/10 bg-white/5 shadow-sm text-neutral-300 hover:border-brand/40 hover:text-brand hover:bg-brand/10"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className={`absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand text-xs font-semibold text-black transition-transform ${mounted && cartCount > 0 ? 'scale-100' : 'scale-0'}`}>
                {mounted ? cartCount : 0}
              </span>
            </Button>

            {user ? (
              <Link href="/account" className="hidden sm:inline-flex">
                <Button variant="ghost" className="text-sm font-semibold text-brand hover:text-emerald-400 hover:bg-white/10 border border-brand/20 bg-brand/5">
                  Mi Cuenta
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex">
                <Button variant="ghost" className="text-sm font-semibold text-neutral-300 hover:text-brand hover:bg-white/10">
                  Ingresar
                </Button>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/40 md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav >
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="grid gap-2 border-t border-white/10 py-4 bg-black/90 backdrop-blur-xl absolute left-0 right-0 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10"
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
