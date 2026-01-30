'use client';

import React, { createContext, useContext } from 'react';
import { TenantPublicConfig } from '../lib/tenant';

const BrandingContext = createContext<TenantPublicConfig | null>(null);

export const BrandingProvider: React.FC<{
    config: TenantPublicConfig | null;
    children: React.ReactNode;
}> = ({ config, children }) => {
    return (
        <BrandingContext.Provider value={config}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => {
    const context = useContext(BrandingContext);
    return context;
};
