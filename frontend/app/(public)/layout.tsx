// frontend/app/(public)/layout.tsx
'use client'
import React, { ReactNode, Suspense } from 'react'
import PublicHeader from '@/components/ecommerce/PublicHeader'
import PublicFooter from '@/components/ecommerce/PublicFooter'

// Ensure global styles are imported if not already in the root layout
// import '@/app/globals.css'; // Already in root layout

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground'>
      <PublicHeader />
      <main className='flex-grow'>
        <Suspense fallback={<div>Cargando...</div>}>{children}</Suspense>
      </main>
      <PublicFooter />
    </div>
  )
}
