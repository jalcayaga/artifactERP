// frontend/components/ecommerce/PromotionalBannerCard.tsx
import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PromotionalBannerCardProps {
  banner: {
    id: string
    imageUrl: string // URL de la imagen de banner compuesta diseñada
    imageAlt?: string
    ctaLink: string
  }
}

const PromotionalBannerCard: React.FC<PromotionalBannerCardProps> = ({
  banner,
}) => {
  const { imageUrl, imageAlt = 'Banner promocional', ctaLink } = banner

  return (
    <Link href={ctaLink} className='block group h-full'>
      <div
        className={cn(
          'relative rounded-xl shadow-xl overflow-hidden group border border-border w-full h-full'
        )}
        aria-label={`Banner: ${imageAlt}`}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          loading='lazy'
        />
      </div>
    </Link>
  )
}

export default PromotionalBannerCard
