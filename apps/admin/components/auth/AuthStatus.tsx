'use client';

import React, { useState } from 'react';
import { useAuth } from '@artifact/core/client';;
import Link from 'next/link';
import { Button } from "@material-tailwind/react";
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

  // TEMPORARY: Force mock user for design verification if not authenticated
  // const isAuthMock = true; 
  const displayUser = currentUser || {
    firstName: 'Admin',
    lastName: 'Artifact',
    email: 'artifact@artifact.cl',
    role: 'admin'
  };

  // if (!isAuthenticated || !currentUser) {
  //   return (
  //     <Link href="/login">
  //       <Button variant="gradient" size="sm" color="blue" className="normal-case hidden lg:inline-block">
  //         Log In
  //       </Button>
  //     </Link>
  //   );
  // }

  const initials = `${displayUser.firstName?.[0] || ''}${displayUser.lastName?.[0] || ''}`.toUpperCase() || 'AD';
  const displayName = displayUser.firstName || 'Admin';
  const email = displayUser.email || 'admin@artifact.com';
  const roleName = (displayUser as any).roles?.[0] || (displayUser as any).role || 'Admin';

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1 p-0.5 rounded-full hover:bg-[rgba(var(--bg-secondary),0.5)] transition-all duration-200 group lg:ml-auto"
      >
        {/* Avatar */}
        <div className="relative">
          {/* Use a static avatar image to match the reference style perfectly if no user image */}
          <img
            src="https://docs.material-tailwind.com/img/face-2.jpg"
            alt="admin"
            className="h-9 w-9 rounded-full object-cover border-2 border-blue-500/20 shadow-lg shadow-blue-500/10"
          />

          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0f172a]" />
        </div>
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
                  {displayUser.firstName} {displayUser.lastName}
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
