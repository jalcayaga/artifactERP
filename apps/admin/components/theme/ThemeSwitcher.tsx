
'use client';

import React from 'react';
import { useTheme } from './ThemeContext';
import { Moon, Sun, Eye } from 'lucide-react';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex gap-2 p-2 rounded-full glass shadow-2xl">
            <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-full transition-all ${theme === 'dark'
                        ? 'bg-[rgb(var(--brand-color))] text-black shadow-[0_0_10px_rgb(var(--brand-color))]'
                        : 'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--brand-color))]'
                    }`}
                title="Dark Mode (Cyberpunk)"
            >
                <Moon className="w-5 h-5" />
            </button>

            <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-full transition-all ${theme === 'light'
                        ? 'bg-yellow-400 text-black shadow-lg'
                        : 'text-[rgb(var(--text-secondary))] hover:text-yellow-400'
                    }`}
                title="Light Mode (Classic)"
            >
                <Sun className="w-5 h-5" />
            </button>

            <button
                onClick={() => setTheme('contrast')}
                className={`p-2 rounded-full transition-all ${theme === 'contrast'
                        ? 'bg-white text-black font-bold border-2 border-black'
                        : 'text-[rgb(var(--text-secondary))] hover:text-white'
                    }`}
                title="High Contrast"
            >
                <Eye className="w-5 h-5" />
            </button>
        </div>
    );
}
