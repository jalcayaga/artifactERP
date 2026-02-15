import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import AuthGuard from "@/components/auth/AuthGuard";
import { ThemeProvider } from "@/components/theme/ThemeContext";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artifact Admin",
  description: "Admin panel for Artifact ERP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body className="antialiased">
        <Providers>
          <ThemeProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
