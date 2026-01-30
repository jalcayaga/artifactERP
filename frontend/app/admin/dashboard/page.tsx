'use client'
import React from 'react'
import DashboardView from '@/components/DashboardView'

// This page will be rendered by AdminLayout, which includes MainAppLayout.
// MainAppLayout's `renderActivePage` will show DashboardView when its internal activePage is 'dashboard'.
// The AdminLayout ensures MainAppLayout receives 'dashboard' as initialPage for this route.
export default function AdminDashboardPage() {
  // The actual content rendering is handled by MainAppLayout based on the route.
  // This component might seem redundant if MainAppLayout handles everything.
  // However, it's standard Next.js practice for `page.tsx` to exist.
  // It could also contain specific metadata or logic for this page if needed.
  // For now, MainAppLayout (via AdminLayout) will render the DashboardView.
  return <DashboardView />
}
