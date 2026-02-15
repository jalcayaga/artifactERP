'use client';

import * as React from 'react';
import { cn } from '@artifact/core';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm text-white transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#7b8893] focus-visible:outline-none focus:border-[#00a1ff]/50 focus:bg-black/30 focus:shadow-[0_0_15px_rgba(0,161,255,0.1)] disabled:cursor-not-allowed disabled:opacity-50 font-medium',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = 'Input';
