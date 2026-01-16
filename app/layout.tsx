import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Online - Play with Friends",
  description: "Simple, clean online chess. Share a link and play with anyone.",
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
