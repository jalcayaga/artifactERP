'use client';

import { PropsWithChildren, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@artifact/core/client';;
import Sidebar from '@/components/admin/sidebar';
import AuthStatus from '@/components/auth/AuthStatus';
import {
  Search,
  Bell,
  Menu,
  X,
  Command,
  Sparkles
} from 'lucide-react';

const AdminShell: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const showShell = isAuthenticated && pathname !== '/login';

  if (!showShell) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))] transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header/Navbar */}
        <header className="sticky top-0 z-30 bg-[rgba(var(--bg-primary),0.8)] backdrop-blur-xl border-b border-[rgba(var(--border-color),0.1)]">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            {/* Left: Mobile Menu + Breadcrumb */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-[rgba(var(--bg-secondary),0.5)] transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* Mobile Logo */}
              <Link href="/" className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--brand-color))] to-[rgba(var(--brand-color),0.6)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold text-lg">Artifact</span>
              </Link>

              {/* Search Bar (Desktop) */}
              <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${searchFocused
                ? 'bg-[rgba(var(--bg-secondary),0.8)] ring-1 ring-[rgba(var(--brand-color),0.3)]'
                : 'bg-[rgba(var(--bg-secondary),0.4)]'
                }`}>
                <Search className="w-4 h-4 text-[rgb(var(--text-secondary))]" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-[rgb(var(--text-secondary))]"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[rgba(var(--bg-secondary),0.8)] text-[rgb(var(--text-secondary))]">
                  <Command className="w-3 h-3" />
                  <span className="text-xs">K</span>
                </div>
              </div>
            </div>

            {/* Right: Actions + User */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-[rgba(var(--bg-secondary),0.5)] transition-colors group">
                <Bell className="w-5 h-5 text-[rgb(var(--text-secondary))] group-hover:text-[rgb(var(--text-primary))] transition-colors" />
                {/* Notification dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[rgb(var(--brand-color))] rounded-full animate-pulse" />
              </button>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-[rgba(var(--border-color),0.2)]" />

              {/* User Menu */}
              <AuthStatus />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[rgba(var(--border-color),0.1)] px-4 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[rgb(var(--text-secondary))]">
            <p>© {new Date().getFullYear()} Artifact ERP</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-[rgb(var(--brand-color))] transition-colors">Ayuda</Link>
              <Link href="#" className="hover:text-[rgb(var(--brand-color))] transition-colors">Docs</Link>
              <span className="text-[rgba(var(--text-secondary),0.5)]">v2.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminShell;
