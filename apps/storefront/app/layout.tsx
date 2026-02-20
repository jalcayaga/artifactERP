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
import { ThemeProvider } from '@/components/theme/ThemeContext';

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
  title: 'Artifact ERP - E-commerce + Admin + Facturación SII',
  description: 'La plataforma completa para vender online en Chile. E-commerce profesional, panel admin y facturación electrónica SII integrada.',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
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
      <body className="antialiased font-inter">
        {/* Dynamic Background (Only in Dark Mode or subtle on light) */}
        <div className="fixed inset-0 -z-10 overflow-hidden opacity-50 dark:opacity-100 theme-dark-only">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full opacity-50" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand/5 rounded-full opacity-50" />
        </div>

        <Providers>
          <ThemeProvider>
            <TenantProvider tenant={tenantTheme}>
              {children as any}
              <Toaster />
            </TenantProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
