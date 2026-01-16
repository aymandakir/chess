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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('chess-theme');
                if (theme) {
                  const data = JSON.parse(theme);
                  if (data.state && data.state.isDark) {
                    document.documentElement.classList.add('dark');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
