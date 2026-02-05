'use client';

import React, { useEffect, useState } from 'react';

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    fillOpacity?: number;
}

const Sparkline: React.FC<SparklineProps> = ({
    data,
    width = 120,
    height = 40,
    color = 'rgb(var(--brand-color))',
    fillOpacity = 0.2,
}) => {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    // Create fill path
    const fillPath = `M0,${height} L${points} L${width},${height} Z`;
    const linePath = `M${points}`;

    return (
        <svg
            width={width}
            height={height}
            className="overflow-visible"
            aria-hidden="true"
        >
            {/* Gradient fill */}
            <defs>
                <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>

            {/* Fill area */}
            <path
                d={fillPath}
                fill="url(#sparklineGradient)"
            />

            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* End point dot */}
            <circle
                cx={width}
                cy={height - ((data[data.length - 1] - min) / range) * height}
                r="3"
                fill={color}
                className="animate-pulse"
            />
        </svg>
    );
};

export default Sparkline;
