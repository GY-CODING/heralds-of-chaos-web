import { Footer } from "@/components/layout/footer/footer";
import { Header } from "@/components/layout/header/header";
import { worldService } from "@/lib/services/world.service";
import type { Metadata, Viewport } from "next";
import "./globals.css";

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
        alt: "Heralds of Chaos",
      },
    ],
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

/**
 * `viewport` va aparte de `metadata` (si no, Next avisa en cada página). Sin `maximumScale`:
 * impedir el zoom deja fuera a quien lo necesita para leer.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06060A",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Los reinos del pie salen de la base de datos, como los de la home.
  const worlds = await worldService.getAllWorlds();

  return (
    <html lang="en">
      <head>
        {/* Las dos fuentes son locales y pequeñas (42 kB y 29 kB), pero el navegador no las pide
            hasta que algo las usa: con `font-display: swap` el nombre se repintaba a mitad de
            carga y movía media portada (CLS 0,09 en móvil lento). Pedirlas desde el principio
            lo quita. */}
        <link rel="preload" href="/fonts/penumbra.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plantin.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer worlds={worlds} />
      </body>
    </html>
  );
}
