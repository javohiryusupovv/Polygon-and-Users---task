import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/users/providers";


export const metadata = {
  title: "User & Map Management Platform – CRUD & Interactive Polygon Tools",
  description:
    "Modern web platform with user management, CRUD operations, and an interactive map editor for drawing, editing, and managing polygons with precision.",
  generator: "Next.js",
  keywords: [
    "user management",
    "CRUD",
    "polygon drawing",
    "interactive map",
    "Leaflet",
    "OpenStreetMap",
    "Next.js",
    "geolocation tools",
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
