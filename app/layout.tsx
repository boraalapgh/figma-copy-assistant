import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copy Assistant API",
  description: "API backend for Figma Copy Assistant plugin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
