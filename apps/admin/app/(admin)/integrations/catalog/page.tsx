'use client';

import React from 'react';
import ChannelCatalogManager from '@/components/integrations/ChannelCatalogManager';
import { Typography } from "@material-tailwind/react";
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChannelCatalogPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <Link
                    href="/integrations"
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-blue-gray-400 hover:text-white"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <Typography variant="small" className="text-blue-gray-400 uppercase font-bold tracking-wider">
                    Volver a Integraciones
                </Typography>
            </div>

            <ChannelCatalogManager />
        </div>
    );
}
