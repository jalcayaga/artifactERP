'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Sparkline from './Sparkline';

interface TrendData {
    value: number;
    direction: 'up' | 'down' | 'neutral';
}

interface KPICardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    iconColor?: string; // e.g. 'bg-pink-500', 'bg-purple-500'
    trend?: TrendData;
    sparklineData?: number[];
    onClick?: () => void;
    className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon,
    iconColor = 'bg-blue-500', // Default color
    trend,
    sparklineData,
    onClick,
    className = '',
}) => {
    return (
        <div
            className={`card-premium p-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-4">
                {/* Icon Circle */}
                <div className={`w-12 h-12 rounded-full ${iconColor} flex items-center justify-center text-white shadow-lg`}>
                    {icon}
                </div>

                {/* Trend Pill */}
                {trend && (
                    <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
            ${trend.direction === 'up' ? 'text-green-400 bg-green-400/10' :
                            trend.direction === 'down' ? 'text-red-400 bg-red-400/10' :
                                'text-gray-400 bg-gray-400/10'}
          `}>
                        {trend.direction === 'up' && <ArrowUpRight className="w-3 h-3" />}
                        {trend.direction === 'down' && <ArrowDownRight className="w-3 h-3" />}
                        <span>{trend.direction === 'up' ? '+' : ''}{trend.value}%</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div>
                <h3 className="text-3xl font-bold text-[rgb(var(--text-primary))] mb-1">
                    {value}
                </h3>
                <p className="text-sm text-[rgb(var(--text-secondary))] font-medium">
                    {title}
                </p>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform scale-150 translate-x-1/4 -translate-y-1/4">
                {icon}
            </div>
        </div>
    );
};

export default KPICard;
