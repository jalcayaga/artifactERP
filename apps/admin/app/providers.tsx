"use client";

import React from "react";
import { CompanyProvider, ThemeProvider, SupabaseAuthProvider, AuthProvider } from '@artifact/core/client';
import { PosProvider } from '@/context/PosContext';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { ThemeProvider as MTThemeProvider } from "@material-tailwind/react";

export function Providers({ children }: { children: any }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MTThemeProvider>
        <SupabaseAuthProvider>
          <PosProvider>
            <ThemeProvider>
              <AuthProvider>
                <CompanyProvider>{children}</CompanyProvider>
              </AuthProvider>
            </ThemeProvider>
          </PosProvider>
        </SupabaseAuthProvider>
      </MTThemeProvider>
    </QueryClientProvider>
  );
}
