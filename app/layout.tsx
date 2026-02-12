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
  authors: [{ name: "GYCODING" }],
  openGraph: {
    title: "Heralds of Chaos",
    description:
      "Explore the rich world of Norse mythology: characters, creatures, items, worlds, and places from the ancient Nordic legends.",
    type: "website",
    locale: "en_US",
    siteName: "Heralds of Chaos",
    images: [
      {
        url: "/images/hoc.png",
        width: 1200,
        height: 630,
        alt: "Heralds of Chaos Logo",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/hoc.png",
    apple: "/images/hoc.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/hoc.png" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
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
