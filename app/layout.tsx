import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Copy Assistant | AI-Powered UX Copywriting for Figma",
  description: "Transform your design workflow with intelligent copy suggestions. A Figma plugin that understands your brand voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
