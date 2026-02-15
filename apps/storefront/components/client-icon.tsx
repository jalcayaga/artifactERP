"use client";

import { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

/**
 * Client-only wrapper for Lucide React icons.
 * This component ensures icons render only on the client to avoid SSR hydration issues.
 * 
 * Usage:
 * import { ShoppingCart } from 'lucide-react';
 * <ClientIcon icon={ShoppingCart} className="h-5 w-5" />
 */
interface ClientIconProps extends Omit<LucideProps, 'ref'> {
    icon: ComponentType<LucideProps>;
}

export function ClientIcon({ icon: Icon, ...props }: ClientIconProps) {
    return <Icon {...props} />;
}
