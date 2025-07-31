// frontend/components/ThemeToggle.tsx
'use client';
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@/components/Icons';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Wait until theme is initialized to avoid flash of wrong icon
  if (!theme) return null; 

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
      aria-label={theme === 'light' ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
    >
      {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
    </button>
  );
};

export default ThemeToggle;