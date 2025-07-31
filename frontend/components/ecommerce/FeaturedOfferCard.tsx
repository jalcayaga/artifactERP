// frontend/components/ecommerce/FeaturedOfferCard.tsx
import React from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface FeaturedOfferCardProps {
  product: {
    id: string;
    imageUrl: string; // URL de la imagen compuesta diseñada
    imageAlt?: string;
    ctaLink?: string;
    layout?: 'horizontal' | 'vertical_detailed'; // Mantener para posible lógica futura, pero no para aspecto
  };
}

const FeaturedOfferCard: React.FC<FeaturedOfferCardProps> = ({ product }) => {
  const {
    id,
    imageUrl,
    imageAlt = 'Oferta destacada',
    ctaLink = `/products/${id}`, // Enlace por defecto si no se provee
    // layout prop is kept for potential future differentiation if needed, but not for aspect ratio here
  } = product;

  return (
    <Link href={ctaLink} className="block group h-full">
      <div
        className={cn(
          "relative rounded-xl shadow-lg overflow-hidden border border-border transition-all duration-300 hover:shadow-primary/20 w-full h-full" 
        )}
        aria-label={`Oferta: ${imageAlt}`}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    </Link>
  );
};

export default FeaturedOfferCard;