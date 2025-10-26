"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import KeybindProvider from "./keybind-provider";

const queryClient = new QueryClient();

export function RootContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <KeybindProvider>{children}</KeybindProvider>
    </QueryClientProvider>
  );
}
