
// frontend/components/ecommerce/PublicHeader.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
// Removed: import Image from 'next/image'; 
import { ShieldCheckIcon, ShoppingCartIcon, MenuIcon, XIcon } from '@/components/Icons'; // Ensured ShieldCheckIcon is imported
import ThemeToggle from '@/components/ThemeToggle';
import { useCart } from '@/contexts/CartContext';
import { ECOMMERCE_PUBLIC_NAVIGATION_ITEMS as NAV_ITEMS } from '@/lib/constants';

const PublicHeader: React.FC = () => {
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/85 dark:bg-background/75 border-b border-border/70 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16"> {/* MODIFIED: Reduced height */}
          {/* Icon and Brand Name */}
          <Link href="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
            <ShieldCheckIcon // Replaced Image with ShieldCheckIcon
              className="h-10 w-10 sm:h-12 sm:w-12 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            />
            <span className="ml-2 text-xl font-bold">
              <span className="text-secondary group-hover:text-secondary/90 transition-colors">Sub</span>
              <span className="text-primary group-hover:text-primary/90 transition-colors">Red</span>
            </span>
          </Link>

          {/* Combined Navigation and Right-side Icons for Desktop */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-150"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Icons: Theme, Cart, ERP Access */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <ThemeToggle />
              <Link
                href="/cart"
                className="relative p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                aria-label="Ver carrito de compras"
              >
                <ShoppingCartIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground shadow-sm">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/dashboard"
                className="hidden sm:inline-flex items-center justify-center rounded-md border border-primary/60 bg-primary/10 px-3 py-2 sm:px-4 text-xs font-semibold text-primary shadow-sm hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              >
                Acceso ERP
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-border/70 py-3">
            <nav className="flex flex-col space-y-2 px-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                  Acceso ERP
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;
