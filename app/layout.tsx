import { Header } from "@/components/layout/header/header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Heralds of Chaos",
  description:
    "Explore the rich world of Norse mythology: characters, creatures, items, worlds, and places from the ancient Nordic legends.",
  keywords: [
    "Norse mythology",
    "Nordic mythology",
    "Vikings",
    "Odin",
    "Thor",
    "mythology encyclopedia",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
