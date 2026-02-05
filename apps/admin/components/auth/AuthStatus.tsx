'use client';

import React, { useState } from 'react';
import { useAuth } from '@artifact/core/client';
import Link from 'next/link';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  UserCircle
} from 'lucide-react';

const AuthStatus: React.FC = () => {
  const { isAuthenticated, currentUser, logout, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-[rgba(var(--bg-secondary),0.5)] animate-pulse" />
    );
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <Link href="/login">
        <span className="btn-primary text-sm px-4 py-2">
          Iniciar Sesión
        </span>
      </Link>
    );
  }

  const initials = `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase() || 'U';
  const displayName = currentUser.firstName || 'Usuario';
  const email = currentUser.email || '';
  const roleName = currentUser.roles?.[0] || currentUser.role || 'Usuario';

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-[rgba(var(--bg-secondary),0.5)] transition-all duration-200 group"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[rgb(var(--brand-color))] to-[rgba(var(--brand-color),0.6)] flex items-center justify-center shadow-lg shadow-[rgba(var(--brand-color),0.2)]">
            <span className="text-sm font-bold text-black">
              {initials}
            </span>
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[rgb(var(--bg-primary))]" />
        </div>

        {/* Name (Desktop only) */}
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-[rgb(var(--text-primary))] leading-tight">
            {displayName}
          </p>
          <p className="text-xs text-[rgb(var(--text-secondary))]">
            {roleName}
          </p>
        </div>

        <ChevronDown className={`hidden lg:block w-4 h-4 text-[rgb(var(--text-secondary))] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="card-premium p-2 shadow-2xl">
              {/* User Info Header */}
              <div className="px-3 py-3 border-b border-[rgba(var(--border-color),0.1)] mb-2">
                <p className="font-semibold text-[rgb(var(--text-primary))]">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-sm text-[rgb(var(--text-secondary))] truncate">
                  {email}
                </p>
              </div>

              {/* Menu Items */}
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgba(var(--bg-secondary),0.5)] transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                <span className="text-sm">Mi Perfil</span>
              </Link>

              <Link
                href="/branding"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgba(var(--bg-secondary),0.5)] transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Configuración</span>
              </Link>

              {/* Divider */}
              <div className="my-2 border-t border-[rgba(var(--border-color),0.1)]" />

              {/* Logout */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthStatus;
