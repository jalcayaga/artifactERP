'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '../admin/sidebar';
import AuthGuard from '../auth/AuthGuard';
import AuthStatus from '../auth/AuthStatus';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
  Input,
  Badge,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  Bars3Icon,
  HomeIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  SunIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false); // Scrolling down
      } else {
        setShowHeader(true); // Scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Show shell on all pages except login.
  // AuthGuard handles protection and loading states inside the shell.
  const showShell = pathname !== '/login';

  if (!showShell) {
    return <>{children}</>;
  }

  // Split pathname for breadcrumbs (simple approach)
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white font-sans selection:bg-[#00a1ff] selection:text-white">
      {/* Sidebar - Controlled by collapse state */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area - Dynamic spacing based on sidebar state */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:ml-[80px]" : "lg:ml-[320px]"
        }`}>
        {/* Top Header/Navbar */}
        <Navbar
          {...({} as any)}
          className={`sticky top-0 z-40 w-full rounded-none bg-transparent px-4 py-2.5 transition-all duration-300 shadow-none ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          fullWidth
          blurred={false}
        >
          <div className="flex items-center justify-between text-white">
            {/* Left: Mobile Menu + Breadcrumb */}
            {/* Left: Icons (Menu, Grid, Search) to match reference */}
            <div className="flex items-center gap-2 md:gap-4">
              <IconButton
                variant="text"
                color="white"
                className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Bars3Icon className="h-5 w-5 stroke-2" />
              </IconButton>

              <Link href="/">
                <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5">
                  <Squares2X2Icon className="h-5 w-5" />
                </IconButton>
              </Link>

              <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </IconButton>
            </div>

            {/* Right: Search + Actions + User */}
            {/* Right: Actions + User */}
            <div className="flex items-center gap-2">

              {/* Theme Switcher Unified */}
              <div className="flex items-center px-2 py-1 rounded-xl bg-white/5 border border-blue-gray-100/5">
                <ThemeSwitcher />
              </div>

              <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5">
                {/* SVG for UK Flag to match reference */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 60 30"
                  className="h-5 w-5 rounded-sm object-cover"
                >
                  <clipPath id="s">
                    <path d="M0,0 v30 h60 v-30 z" />
                  </clipPath>
                  <clipPath id="t">
                    <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
                  </clipPath>
                  <g clipPath="url(#s)">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
                    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
                  </g>
                </svg>
              </IconButton>

              <Badge content="3" withBorder className="border-[#1e293b] bg-blue-500 min-w-[18px] min-h-[18px] !p-0 grid place-items-center">
                <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
                </IconButton>
              </Badge>

              <Badge content="5" withBorder className="border-[#1e293b] bg-red-500 min-w-[18px] min-h-[18px] !p-0 grid place-items-center">
                <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5">
                  <BellIcon className="h-5 w-5" />
                </IconButton>
              </Badge>

              {/* User Auth Status */}
              <div className="ml-1">
                <AuthStatus />
              </div>
            </div>
          </div>
        </Navbar>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
