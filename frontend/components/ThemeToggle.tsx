// frontend/components/ThemeToggle.tsx
'use client'
import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { SunIcon, MoonIcon } from '@/components/Icons'

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  if (!theme) return null

  const isDarkMode = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
      className={`relative inline-flex h-6 w-10 items-center rounded-full border border-primary/60 bg-primary/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
      aria-label={isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      role='switch'
      aria-checked={isDarkMode}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center transform rounded-full border border-primary/60 bg-primary/10 shadow-lg transition-all duration-300
          ${isDarkMode ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
      >
        <SunIcon
          className={`h-3 w-3 text-primary transition-opacity duration-200
            ${isDarkMode ? 'opacity-0' : 'opacity-100'}
          `}
        />
        <MoonIcon
          className={`absolute h-3 w-3 text-primary transition-opacity duration-200
            ${isDarkMode ? 'opacity-100' : 'opacity-0'}
          `}
        />
      </span>
    </button>
  )
}

export default ThemeToggle
