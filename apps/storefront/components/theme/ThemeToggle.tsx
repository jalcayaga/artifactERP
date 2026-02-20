"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-10 h-10" />;

    return (
        <button
            onClick={toggleTheme}
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden ${theme === "dark" ? "bg-white/5 border border-white/10" : "bg-slate-200 border border-slate-300"}`}
            aria-label="Alternar tema"
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-sky-400 transform transition-all duration-500 rotate-0 scale-100" />
            ) : (
                <Moon className="w-5 h-5 text-slate-600 transform transition-all duration-500 rotate-0 scale-100" />
            )}
        </button>
    );
}
