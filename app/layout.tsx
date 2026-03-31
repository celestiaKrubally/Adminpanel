import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caption Admin",
  description: "Admin area for the caption rating app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
