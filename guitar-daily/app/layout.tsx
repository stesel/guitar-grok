import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guitar Daily",
  description: "Daily guitar practice",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
