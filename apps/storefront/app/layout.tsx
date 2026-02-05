import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { TenantProvider } from '@/context/tenant-context';
import { Header } from '@/components/header';
import { Toaster } from '@artifact/ui';
import { Footer } from '@/components/footer';
import { getTenantTheme } from '@/lib/storefront';
import { defaultTheme } from '@/lib/theme';
import { headers } from 'next/headers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Artifact Storefront',
  description: 'Tu ecommerce con ERP y facturación electrónica para el SII',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = headers().get("host") || "";
  // Mock tenant theme or fetch it
  const tenantTheme = await getTenantTheme(host) || {
    tenant: { slug: "artifact", name: "Artifact Storefront" },
    branding: { primaryColor: defaultTheme.brandColor, secondaryColor: defaultTheme.textColor, logoUrl: defaultTheme.logoUrl }
  };

  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --brand-color: ${tenantTheme.branding?.primaryColor || defaultTheme.brandColor};
                --text-color: ${tenantTheme.branding?.secondaryColor || defaultTheme.textColor};
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        {/* Dynamic Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,224,116,0.03),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <Providers>
          <TenantProvider tenant={tenantTheme}>
            {children}
            <Toaster />
          </TenantProvider>
        </Providers>
      </body>
    </html>
  );
}
