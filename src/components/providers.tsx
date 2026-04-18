// src/components/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: {
            style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
          },
          error: {
            style: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
          },
        }}
      />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
