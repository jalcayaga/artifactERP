// contexts/ThemeContext.tsx
'use client' // Mark as a Client Component

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { Theme, ThemeContextType } from '@artifact/core'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>('light') // Default to light, will be updated
  const [isThemeInitialized, setIsThemeInitialized] = useState(false)

  useEffect(() => {
    // This effect runs once on mount to determine the initial theme
    let initialTheme: Theme = 'light' // Default if nothing else is found
    try {
      const storedTheme = localStorage.getItem('wolfflow_theme') as Theme | null
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        initialTheme = storedTheme
      } else {
        // Only use prefers-color-scheme if no valid theme is stored
        const prefersDark =
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        initialTheme = prefersDark ? 'dark' : 'light'
      }
    } catch (error) {
      console.error(
        'Error accessing localStorage or matchMedia for theme:',
        error
      )
      // Fallback to light if any error occurs during initial read
    }
    setThemeState(initialTheme)
    setIsThemeInitialized(true)
  }, []) // Empty dependency array means this runs once on client mount

  useEffect(() => {
    // This effect runs whenever 'theme' or 'isThemeInitialized' changes.
    // It applies the theme to the document and persists it, but only if initialized.
    if (!isThemeInitialized) {
      return // Don't do anything until the theme has been initialized
    }

    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    try {
      localStorage.setItem('wolfflow_theme', theme)
    } catch (error) {
      console.error('Error saving theme to localStorage:', error)
    }
  }, [theme, isThemeInitialized]) // Re-run when theme state or initialization status changes

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
