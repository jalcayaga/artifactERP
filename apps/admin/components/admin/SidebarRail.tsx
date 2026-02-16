'use client';

import React, { useState, useEffect } from 'react';
import { TenantService } from '@/lib/services/tenant.service';
import { defaultTheme } from '@/lib/theme';
import Link from 'next/link';
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
    const [logoUrl, setLogoUrl] = useState(defaultTheme.secondaryLogoUrl);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const config = await TenantService.getConfig();
                if (config.branding?.secondaryLogoUrl) {
                    setLogoUrl(config.branding.secondaryLogoUrl);
                }
            } catch (error) {
                console.error("Error fetching rail logo:", error);
            }
        };
        fetchBrand();
    }, []);

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
                        src={logoUrl}
                        alt="Logo"
                        width={40}
                        height={40}
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

            {/* Footer / Settings - Pro Style & Aligned */}
            <div className="pb-8 w-full flex flex-col items-center mt-auto">
                <Tooltip
                    content="Configuración"
                    placement="right"
                    className="bg-[#111c2d] text-white py-2 px-3 border border-white/10 shadow-2xl text-[12px] font-medium rounded-lg"
                >
                    <div className="relative flex items-center justify-center w-full">
                        <Link href="/settings">
                            <IconButton
                                variant="text"
                                className="w-[48px] h-[48px] max-w-none max-h-none rounded-full transition-all duration-300 flex items-center justify-center text-[#7b8893] bg-white/5 border border-white/5 hover:bg-[rgba(0,161,255,0.12)] hover:text-[#00a1ff] hover:border-[#00a1ff20] hover:scale-105 shadow-lg group"
                            >
                                <Settings
                                    className="h-6 w-6 transition-transform duration-300 group-hover:rotate-45"
                                    strokeWidth={1.5}
                                />
                            </IconButton>
                        </Link>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
};
