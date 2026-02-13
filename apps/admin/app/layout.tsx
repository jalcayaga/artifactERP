import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import AuthGuard from "@/components/auth/AuthGuard";
import AdminShell from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/theme/ThemeContext";

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
    <html lang="es">
      <body>
        <Providers>
          <ThemeProvider>
            <AdminShell>
              <AuthGuard>
                {children}
              </AuthGuard>
            </AdminShell>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
