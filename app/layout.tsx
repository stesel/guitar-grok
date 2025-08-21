import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/src/components/AppShell";

export const metadata: Metadata = {
  title: "Guitar Grok",
  description: "Daily guitar practice",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
