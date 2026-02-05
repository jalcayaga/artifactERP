"use client";

import React from "react";
import { AuthProvider, CompanyProvider, ThemeProvider, SupabaseAuthProvider } from "@artifact/core/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";

export function Providers({ children }: { children: any }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <ThemeProvider>
          <AuthProvider>
            <CompanyProvider>{children}</CompanyProvider>
          </AuthProvider>
        </ThemeProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}
