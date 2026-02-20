'use client';

import React from 'react';
import { PortalView } from '@/components/portal/PortalView';
import SpaceInvadersBackground from '@/components/SpaceInvadersBackground';

export default function PortalPage() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background with SpaceInvaders (Premium Branding) */}
            <div className="fixed inset-0 z-0">
                <SpaceInvadersBackground />
            </div>

            {/* Portal Content */}
            <div className="relative z-10">
                <PortalView />
            </div>
        </div>
    );
}
