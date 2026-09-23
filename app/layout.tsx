import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARS VITA | Creadores contemporáneos",
  description: "Galería digital de ARS VITA: ocho artistas, ocho miradas, un mismo horizonte: el arte.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
