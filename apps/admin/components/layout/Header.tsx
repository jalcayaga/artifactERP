'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AuthStatus from '../auth/AuthStatus';
import {
    Navbar,
    Typography,
    IconButton,
    Badge,
} from "@material-tailwind/react";
import {
    Bars3Icon,
    Squares2X2Icon,
    MagnifyingGlassIcon,
    SunIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    BellIcon,
} from "@heroicons/react/24/outline";

interface HeaderProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean);

    return (
        <Navbar
            className="sticky top-0 z-40 w-full max-w-full rounded-none px-4 py-2.5 transition-all bg-transparent shadow-none border-none backdrop-blur-none"
            fullWidth
            blurred={false}
        >
            <div className="flex items-center justify-between text-white">
                {/* Left: Icons (Menu, Grid, Search) to match reference */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#161D2B] rounded-xl border border-white/5">
                    <IconButton
                        variant="text"
                        color="white"
                        className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5 w-8 h-8"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Bars3Icon className="h-5 w-5 stroke-2" />
                    </IconButton>

                    <Link href="/dashboard">
                        <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5 w-8 h-8">
                            <Squares2X2Icon className="h-4 w-4" />
                        </IconButton>
                    </Link>

                    <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5 w-8 h-8">
                        <MagnifyingGlassIcon className="h-4 w-4" />
                    </IconButton>
                </div>

                {/* Right: Actions + User */}
                <div className="flex items-center gap-1 md:gap-2">

                    <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5">
                        <SunIcon className="h-5 w-5" />
                    </IconButton>

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

                    <Badge content="3" withBorder className="border-[#0f172a] bg-blue-500 min-w-[18px] min-h-[18px] !p-0 grid place-items-center text-[10px] font-bold">
                        <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5">
                            <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
                        </IconButton>
                    </Badge>

                    <Badge content="5" withBorder className="border-[#0f172a] bg-red-500 min-w-[18px] min-h-[18px] !p-0 grid place-items-center text-[10px] font-bold">
                        <IconButton variant="text" color="white" className="grid place-items-center text-blue-gray-200 hover:text-white hover:bg-white/5">
                            <BellIcon className="h-5 w-5" />
                        </IconButton>
                    </Badge>

                    {/* User Auth Status */}
                    <div className="ml-2 pl-2 border-l border-white/10">
                        <AuthStatus />
                    </div>
                </div>
            </div>
        </Navbar>
    );
};
