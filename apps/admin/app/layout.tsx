import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import AuthGuard from "@/components/auth/AuthGuard";
import AdminShell from "@/components/layout/AppShell";

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
          <AuthGuard>
            <AdminShell>{children}</AdminShell>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
