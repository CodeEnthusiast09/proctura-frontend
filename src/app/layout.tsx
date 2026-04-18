// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proctura — Online Coding Exams for Universities",
  description:
    "Proctura gives Nigerian universities a real online coding exam platform. Students write, run, and submit actual code instead of writing on paper.",
  keywords: ["coding exam", "university", "Nigeria", "online exam", "programming"],
  openGraph: {
    title: "Proctura — Online Coding Exams for Universities",
    description:
      "The end of writing code on paper. Proctura gives Nigerian universities a real online coding exam platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
