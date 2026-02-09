"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { SupabaseAuthProvider } from "@artifact/core/client";

export function Providers({ children }: { children: any }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        {children}
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}
