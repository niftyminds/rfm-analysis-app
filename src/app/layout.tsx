import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RFM Analýza | NiftyMinds",
  description: "Pokročilá RFM analýza zákaznických dat s interaktivním dashboardem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}