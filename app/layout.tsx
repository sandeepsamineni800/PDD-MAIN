import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalSplash from "./components/GlobalSplash";
import ThemeToggle from "./components/ThemeToggle";
import { LanguageProvider } from "@/lib/i18nContext";
import { FontSizeProvider } from "@/lib/FontSizeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Core Scheduler | Multi-Domain Task Manager",
  description: "Intelligently assign and manage tasks across different domains like roommates, software teams, and college projects.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Scheduler",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
                var theme = localStorage.getItem('theme');
                if (theme) {
                  document.documentElement.setAttribute('data-theme', theme);
                }
                var fontSize = localStorage.getItem('app-font-size');
                if (fontSize) {
                  if (fontSize === 'small') document.documentElement.style.setProperty('--base-font-size', '14px');
                  else if (fontSize === 'large') document.documentElement.style.setProperty('--base-font-size', '18px');
                  else document.documentElement.style.setProperty('--base-font-size', '16px');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <FontSizeProvider>
          <LanguageProvider>
            <GlobalSplash />
            <ThemeToggle />
            <main>
              {children}
            </main>
          </LanguageProvider>
        </FontSizeProvider>
      </body>
    </html>
  );
}
