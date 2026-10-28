import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Keysmith.",
  description:
    "Less clicking. More doing. Explore keyboard shortcuts for Windows, macOS, Linux, browsers, code editors, and Vim. Search, save, and practice your favorites.",
  applicationName: "Keysmith",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Keysmith.",
    description:
      "Less clicking. More doing. Explore keyboard shortcuts for Windows, macOS, Linux, browsers, code editors, and Vim. Search, save, and practice your favorites.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffe52f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
