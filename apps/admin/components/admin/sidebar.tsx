'use client';

import React, { useState } from 'react';
import { SidebarRail, SidebarCategory } from './SidebarRail';
import { SidebarPanel } from './SidebarPanel';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({
  mobileOpen,
  setMobileOpen,
  sidebarCollapsed,
  setSidebarCollapsed
}: SidebarProps) {
  const [activeCategory, setActiveCategory] = useState<SidebarCategory>('overview');

  return (
    <>
      {/* Mobile Overlay - Subtle Blur */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container - Exact MaterialM 320px Width */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] h-screen transition-all duration-300 ease-in-out lg:translate-x-0 flex shadow-2xl bg-[#1a2537] overflow-hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          } ${sidebarCollapsed ? "w-[80px]" : "w-[320px]"}`}
      >
        {/* Column 1: Iconic Rail (80px wide) */}
        <SidebarRail
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Column 2: Contextual Panel - Animated Collapse */}
        <div className={`flex-1 h-full shadow-[inset_1px_0_0_rgba(255,255,255,0.05)] transition-all duration-300 ease-in-out overflow-hidden ${sidebarCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible w-[240px]"
          }`}>
          <SidebarPanel
            activeCategory={activeCategory}
            onCloseMobile={() => setMobileOpen(false)}
          />
        </div>
      </aside>
    </>
  );
}
