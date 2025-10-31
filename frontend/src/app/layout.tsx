import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@xyflow/react/dist/style.css";
import "./globals.css";
import { RootContextProvider } from "../context/root-context-provider";
import { initDim, evalDim } from "../lib/dim/dim";
import DimInit from "./dim-init";
import { DimClientProbe } from "./dim-client-probe";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Directed",
  description: "Build a modular network as a directed graph",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await initDim();
  try {
    const out = evalDim("2 m * 3 m");
    // Server-side demonstration log
    console.log("[DimServer] 2 m * 3 m =", out);
  } catch (e) {
    console.error("[DimServer] dim init/eval failed", e);
  }
  return (
    <RootContextProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen p-1! font-mono`}
        >
          <DimInit />
          <DimClientProbe />
          {children}
        </body>
      </html>
    </RootContextProvider>
  );
}
