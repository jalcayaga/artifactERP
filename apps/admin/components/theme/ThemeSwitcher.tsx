
'use client';

import React from 'react';
import { useTheme } from './ThemeContext';
import { Moon, Sun, Eye } from 'lucide-react';
import { IconButton, Tooltip } from "@material-tailwind/react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-1">
            <Tooltip content="Modo Oscuro (Deep Blue)">
                <IconButton
                    variant="text"
                    color="white"
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className={`grid place-items-center transition-all ${theme === 'dark'
                        ? 'text-blue-500 bg-white/5'
                        : 'text-blue-gray-200 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Moon className="w-4 h-4" />
                </IconButton>
            </Tooltip>

            <Tooltip content="Modo Claro (Clásico)">
                <IconButton
                    variant="text"
                    color="white"
                    size="sm"
                    onClick={() => setTheme('light')}
                    className={`grid place-items-center transition-all ${theme === 'light'
                        ? 'text-yellow-500 bg-white/5'
                        : 'text-blue-gray-200 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Sun className="w-4 h-4" />
                </IconButton>
            </Tooltip>

            <Tooltip content="Alto Contraste">
                <IconButton
                    variant="text"
                    color="white"
                    size="sm"
                    onClick={() => setTheme('contrast')}
                    className={`grid place-items-center transition-all ${theme === 'contrast'
                        ? 'text-white bg-white/10'
                        : 'text-blue-gray-200 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Eye className="w-4 h-4" />
                </IconButton>
            </Tooltip>
        </div>
    );
}
