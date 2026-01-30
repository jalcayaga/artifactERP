'use client'
import { Toaster } from 'sonner';
import React, { ReactNode } from 'react';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { CartProvider } from '@/contexts/CartContext';
import { ERP_APP_NAME } from '@/lib/constants';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='es'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{ERP_APP_NAME}</title>
        <meta
          name='description'
          content='Plataforma integral ERP y E-commerce para SubRed, con un frontend moderno en Next.js y React.'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='icon' href='/favicon.ico' />
        <meta name='theme-color' content='#00DFFC' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='font-sans'>
        <ThemeProvider>
          <AuthProvider>
            <CompanyProvider>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </CompanyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}