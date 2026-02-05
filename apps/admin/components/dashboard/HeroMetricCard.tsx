'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Sparkline from './Sparkline';

interface TrendData {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
}

interface HeroMetricCardProps {
    title: string;
    value: string | number;
    trend?: TrendData;
    sparklineData?: number[];
    icon?: React.ReactNode;
    onClick?: () => void;
}

const HeroMetricCard: React.FC<HeroMetricCardProps> = ({
    title,
    value,
    trend,
    sparklineData,
    icon,
    onClick,
}) => {
    const getTrendColor = (direction: string) => {
        switch (direction) {
            case 'up': return 'text-green-400';
            case 'down': return 'text-red-400';
            default: return 'text-[rgb(var(--text-secondary))]';
        }
    };

    const getTrendIcon = (direction: string) => {
        switch (direction) {
            case 'up': return <TrendingUp className="w-5 h-5" />;
            case 'down': return <TrendingDown className="w-5 h-5" />;
            default: return <Minus className="w-5 h-5" />;
        }
    };

    return (
        <div
            className={`card-premium p-8 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
            role="region"
            aria-label={`${title}: ${value}`}
        >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--brand-color),0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="p-3 rounded-xl bg-[rgba(var(--brand-color),0.15)] text-[rgb(var(--brand-color))]">
                                {icon}
                            </div>
                        )}
                        <h2 className="text-sm font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">
                            {title}
                        </h2>
                    </div>

                    {/* Live indicator */}
                    <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-secondary))]">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </div>
                </div>

                {/* Main Value */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-5xl font-bold text-[rgb(var(--brand-color))] tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {value}
                        </p>

                        {/* Trend */}
                        {trend && (
                            <div className={`flex items-center gap-2 mt-3 ${getTrendColor(trend.direction)}`}>
                                {getTrendIcon(trend.direction)}
                                <span className="text-lg font-semibold">
                                    {trend.direction === 'up' ? '+' : ''}{trend.value}%
                                </span>
                                {trend.label && (
                                    <span className="text-sm text-[rgb(var(--text-secondary))]">
                                        {trend.label}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sparkline */}
                    {sparklineData && sparklineData.length > 0 && (
                        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                            <Sparkline
                                data={sparklineData}
                                width={160}
                                height={60}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Hover border effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[rgba(var(--brand-color),0.3)] rounded-2xl transition-colors duration-300 pointer-events-none" />
        </div>
    );
};

export default HeroMetricCard;
