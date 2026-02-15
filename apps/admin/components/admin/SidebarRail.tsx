'use client';

import React from 'react';
import {
    LayoutGrid,
    Banknote,
    Package,
    Truck,
    ShieldCheck,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { IconButton, Tooltip, Avatar } from "@material-tailwind/react";
import Image from 'next/image';

export type SidebarCategory = 'overview' | 'commerce' | 'inventory' | 'logistics' | 'admin';

interface SidebarRailProps {
    activeCategory: SidebarCategory;
    setActiveCategory: (category: SidebarCategory) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const SidebarRail: React.FC<SidebarRailProps> = ({
    activeCategory,
    setActiveCategory,
    sidebarCollapsed,
    setSidebarCollapsed
}) => {
    const categories = [
        { id: 'overview' as const, icon: LayoutGrid, label: 'Dashboard' },
        { id: 'commerce' as const, icon: Banknote, label: 'Commerce' },
        { id: 'inventory' as const, icon: Package, label: 'Inventory' },
        { id: 'logistics' as const, icon: Truck, label: 'Logistics' },
        { id: 'admin' as const, icon: ShieldCheck, label: 'Admin' },
    ];

    return (
        <div className="w-[80px] bg-[#111c2d] border-r border-[#ffffff08] flex flex-col items-center pt-0 pb-6 gap-6 z-[70] relative">
            {/* Brand Logo - Integrated with SidebarPanel header height (64px) */}
            <div className="h-[64px] flex items-center justify-center w-full border-b border-[#ffffff08]">
                <div className="w-[48px] h-[48px] flex items-center justify-center group cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95">
                    <Image
                        src="/logo-artifact.png"
                        alt="Logo"
                        width={48}
                        height={48}
                        priority
                        className="transition-transform duration-300 object-contain"
                    />
                </div>
            </div>

            {/* Category Icons - 1:1 MaterialM */}
            <div className="flex-1 flex flex-col gap-2 w-full items-center">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <Tooltip
                            key={cat.id}
                            content={cat.label}
                            placement="right"
                            className="bg-[#111c2d] text-white py-2 px-3 border border-white/10 shadow-2xl text-[12px] font-medium rounded-lg"
                        >
                            <div className="relative flex items-center justify-center w-full">
                                <IconButton
                                    variant="text"
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`w-[48px] h-[48px] max-w-none max-h-none rounded-full transition-all duration-300 flex items-center justify-center ${isActive
                                        ? "bg-[rgba(0,161,255,0.12)] text-[#00a1ff]"
                                        : "text-[#7b8893] hover:bg-[rgba(0,161,255,0.12)] hover:text-[#00a1ff]"
                                        }`}
                                >
                                    <cat.icon
                                        className={`h-6 w-6 transition-transform duration-300 ${isActive ? "scale-100" : "scale-100 opacity-80"}`}
                                        strokeWidth={isActive ? 2 : 1.5}
                                    />
                                </IconButton>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>

            {/* Footer / User - 1:1 MaterialM with Toggle */}
            <div className="pb-6 w-full flex flex-col items-center gap-6 mt-auto">
                <IconButton
                    variant="text"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="w-[48px] h-[48px] rounded-full text-[#7b8893] hover:bg-[rgba(0,161,255,0.12)] hover:text-[#00a1ff] transition-all duration-300 hidden lg:flex items-center justify-center shadow-lg border border-[#ffffff08]"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="h-[22px] w-[22px]" strokeWidth={2} />
                    ) : (
                        <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2} />
                    )}
                </IconButton>

                <IconButton variant="text" className="w-[48px] h-[48px] rounded-full text-[#7b8893] hover:bg-[rgba(0,161,255,0.12)] hover:text-[#00a1ff] transition-all duration-300">
                    <Settings className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </IconButton>
                <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-[#00a1ff] transition-all duration-300 p-0.5 overflow-hidden">
                        <Avatar
                            src="https://docs.material-tailwind.com/img/face-2.jpg"
                            alt="avatar"
                            size="sm"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
