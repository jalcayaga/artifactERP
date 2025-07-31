// frontend/app/(public)/products/[productId]/page.tsx
'use client';
import React from 'react';
import ProductDetailView from '@/components/ecommerce/ProductDetailView';
import { useParams } from 'next/navigation'; // To get productId from URL

export default function ProductDetailPage() {
  const params = useParams();
  const productId = typeof params.productId === 'string' ? params.productId : '';

  if (!productId) {
    // Handle case where productId is not available, e.g., show a loading or error state
    // This check might be more robust depending on Next.js version and build process
    return <p className="text-center py-10">Cargando producto...</p>;
  }
  
  return <ProductDetailView productId={productId} />;
}
