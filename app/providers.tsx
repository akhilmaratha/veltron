"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2200,
            style: {
              border: "1px solid #E8E0D5",
              background: "#F5F0EB",
              color: "#1A1410",
              fontSize: "13px",
            },
            success: {
              iconTheme: {
                primary: "#4A7C59",
                secondary: "#F5F0EB",
              },
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}