"use client";

import React from "react";
import { AuthProvider } from "@artifact/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { CompanyProvider, ThemeProvider } from "@artifact/core";

export function Providers({ children }: { children: any }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CompanyProvider>{children}</CompanyProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
