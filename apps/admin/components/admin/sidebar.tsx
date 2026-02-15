'use client';

import React, { useState } from 'react';
import { SidebarRail, SidebarCategory } from './SidebarRail';
import { SidebarPanel } from './SidebarPanel';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
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
        className={`fixed inset-y-0 left-0 z-[70] h-screen w-[320px] transition-all duration-300 ease-in-out lg:translate-x-0 flex shadow-2xl bg-[#1a2537] ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Column 1: Iconic Rail (84px wide for better balance) */}
        <SidebarRail activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* Column 2: Contextual Panel */}
        <div className="flex-1 h-full shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]">
          <SidebarPanel
            activeCategory={activeCategory}
            onCloseMobile={() => setMobileOpen(false)}
          />
        </div>
      </aside>
    </>
  );
}
