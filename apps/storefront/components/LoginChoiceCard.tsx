'use client';

import { LucideIcon } from 'lucide-react';
import { Button } from '@artifact/ui';
import { cn } from '@artifact/core';

interface LoginChoiceCardProps {
    title: string;
    description: string;
    icon: LucideIcon | string;
    features: string[];
    buttonText: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export function LoginChoiceCard({
    title,
    description,
    icon: Icon,
    features,
    buttonText,
    onClick,
    variant = 'primary',
    className
}: LoginChoiceCardProps) {
    const isNeon = variant === 'primary';

    return (
        <div
            className={cn(
                "relative group overflow-hidden rounded-2xl border transition-all duration-500",
                "bg-white dark:bg-white/5 backdrop-blur-xl border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm",
                "p-8 flex flex-col items-center text-center",
                className
            )}
        >
            {/* Background Glow Effect */}
            <div className={cn(
                "absolute -inset-24 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none rounded-full blur-[100px]",
                isNeon ? "bg-[#00E074]" : "bg-blue-500"
            )} />

            {/* Icon Section */}
            <div className={cn(
                "mb-6 w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                "bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10",
                isNeon ? "text-[#00E074] shadow-[0_0_20px_rgba(0,224,116,0.1)]" : "text-blue-500 dark:text-blue-400"
            )}>
                {typeof Icon === 'string' ? (
                    <span className="text-4xl">{Icon}</span>
                ) : (
                    <Icon className="w-10 h-10" />
                )}
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 font-space-grotesk tracking-tight">
                {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-[240px]">
                {description}
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-10 w-full text-left">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full mr-3",
                            isNeon ? "bg-[#00E074]" : "bg-blue-500"
                        )} />
                        {feature}
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <Button
                onClick={onClick}
                className={cn(
                    "w-full h-12 text-black font-bold transition-all duration-300",
                    isNeon
                        ? "bg-[#00E074] hover:bg-[#00FF85] hover:shadow-[0_0_25px_rgba(0,224,116,0.4)]"
                        : "bg-blue-500 hover:bg-blue-400 text-white"
                )}
            >
                {buttonText}
            </Button>
        </div>
    );
}
