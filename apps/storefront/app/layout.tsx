import type { Metadata } from "next";
import { headers } from "next/headers";
import type { CSSProperties, ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TenantProvider } from "@/context/tenant-context";
import { getTenantTheme } from "@/lib/storefront";
import { defaultTheme } from "@/lib/theme";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubRed Storefront",
  description: "Tu ecommerce con ERP y facturación electrónica para el SII",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const host = headers().get("host") || "";
  const tenantTheme = await getTenantTheme(host) || {
    tenant: {
      slug: "artifact",
      name: "Artifact Storefront",
    },
    branding: {
      logoUrl: defaultTheme.logoUrl,
      primaryColor: defaultTheme.brandColor,
      secondaryColor: defaultTheme.textColor,
    },
  };

  const currentTheme = {
    brandColor: tenantTheme.branding?.primaryColor || defaultTheme.brandColor,
    textColor: tenantTheme.branding?.secondaryColor || defaultTheme.textColor,
    logoUrl: tenantTheme.branding?.logoUrl || defaultTheme.logoUrl,
    radius: defaultTheme.radius,
    font: defaultTheme.font,
  };

  return (
    <html
      lang="es"
      style={{
        "--color-brand": currentTheme.brandColor,
        "--color-text": currentTheme.textColor,
        "--radius": currentTheme.radius,
      } as CSSProperties}
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <TenantProvider tenant={tenantTheme}>
            <Header />
            <main className="flex min-h-[calc(100vh-200px)] flex-col">
              {children}
            </main>
            <Footer />
          </TenantProvider>
        </Providers>
      </body>
    </html>
  );
}
