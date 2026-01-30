import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { getTenantConfig } from '../lib/tenant'
import { BrandingProvider } from '../components/BrandingProvider'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headersList = headers();
    const host = headersList.get('host');
    const config = await getTenantConfig(host);

    const branding = config?.branding;
    const brandColor = branding?.primaryColor || '#00ff7f';
    const logoUrl = branding?.logoUrl;
    const displayName = config?.displayName || 'Artifact';

    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                <title>{`${displayName} - Digitalización a tu medida`}</title>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root {
                        --brand-color: ${brandColor};
                        ${branding?.lightTheme?.textColor ? `--light-text: ${branding.lightTheme.textColor};` : ''}
                        ${branding?.lightTheme?.font ? `--font-family: ${branding.lightTheme.font};` : ''}
                    }
                `}} />
            </head>
            <body className={inter.className}>
                <BrandingProvider config={config}>
                    {children}
                </BrandingProvider>
            </body>
        </html>
    )
}
