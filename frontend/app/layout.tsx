
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext'; // Adjusted path
import { AuthProvider } from '@/contexts/AuthContext';   // Adjusted path
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SubRed ERP', // Updated title
  description: 'Plataforma integral ERP y E-commerce para SubRed.', // Updated description
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Chart.js CDN kept for now, can be componentized later */}
        <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
