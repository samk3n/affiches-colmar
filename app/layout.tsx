import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import GlobalJsonLd from "@/components/seo/GlobalJsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Affiches Colmar | Art Vintage et Décoration Alsacienne",
  description: "Découvrez nos affiches vintage exclusives de Colmar et du Haut-Rhin. Une décoration murale authentique capturant le charme de la Petite Venise et des maisons à colombages. Imaginé en Alsace, imprimé en France.",
  openGraph: {
    title: "Affiches Colmar | Art Vintage et Décoration Alsacienne",
    description: "La beauté de l'Alsace chez vous. Affiches vintage exclusives de Colmar.",
    type: "website",
    locale: "fr_FR",
    siteName: "Colmar Posters",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-cream text-timber font-sans`}
      >
        <GlobalJsonLd />
        {children}
      </body>
    </html>
  );
}
