"use client"; // Required for SessionProvider

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google"; // Google font

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {/* Wrap everything in SessionProvider */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
