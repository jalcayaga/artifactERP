"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { TenantTheme } from "@/lib/storefront";

interface TenantContextType {
  tenant: TenantTheme | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode; tenant: TenantTheme | null }> = ({
  children,
  tenant,
}) => {
  return (
    <TenantContext.Provider value={{ tenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
