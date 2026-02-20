"use client";

import React from "react";
import { useTheme } from "./theme/ThemeContext";

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export function Logo({ className = "", width = 220, height = 40 }: LogoProps) {
    const { theme } = useTheme();

    // Use brand color for the elements
    const brandColor = "var(--color-brand)";
    const textColor = theme === "dark" ? "white" : "#0f172a";
    const subTextColor = theme === "dark" ? "#666" : "#475569";
    const badgeColor = theme === "dark" ? "#00E074" : "var(--color-brand)";

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 220 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="brandLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-brand)" />
                    <stop offset="100%" stopColor="var(--color-brand-dark)" />
                </linearGradient>
                <filter id="logoGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Icon: Layered A representing ERP modules */}
            <g transform="translate(2, 6)">
                {/* Outer glow effect (only in dark mode) */}
                {theme === "dark" && (
                    <path
                        d="M14 0 L28 28 L23 28 L14 8 L5 28 L0 28 Z"
                        fill="var(--color-brand)"
                        opacity="0.1"
                        filter="url(#logoGlow)"
                    />
                )}

                {/* Layer 1: E-commerce (lightest) */}
                <path
                    d="M14 0 L28 28 L24 28 L14 6 L4 28 L0 28 Z"
                    fill="url(#brandLogoGradient)"
                    opacity="0.25"
                />

                {/* Layer 2: Admin (medium) */}
                <path
                    d="M14 4 L25 28 L21 28 L14 10 L7 28 L3 28 Z"
                    fill="url(#brandLogoGradient)"
                    opacity="0.5"
                />

                {/* Layer 3: Facturación (brightest) */}
                <path d="M14 8 L22 28 L18 28 L14 14 L10 28 L6 28 Z" fill="url(#brandLogoGradient)" />

                {/* Horizontal bar (crossbar of A) */}
                <rect x="9" y="18" width="10" height="2.5" fill="var(--color-brand)" rx="1.25" />
            </g>

            {/* Text: ARTIFACT */}
            <text
                x="38"
                y="26"
                fontFamily="'Inter', system-ui, -apple-system, sans-serif"
                fontSize="20"
                fontWeight="800"
                fill={textColor}
                letterSpacing="-1"
            >
                ARTIFACT
            </text>

            {/* Divider */}
            <line
                x1="140"
                y1="12"
                x2="140"
                y2="28"
                stroke="var(--color-brand)"
                strokeWidth="1.5"
                opacity="0.3"
            />

            {/* Badge: ERP */}
            <g transform="translate(148, 11)">
                <rect width="38" height="18" rx="9" fill="var(--color-brand)" fillOpacity="0.12" />
                <rect width="38" height="18" rx="9" stroke="var(--color-brand)" strokeWidth="1.5" fill="none" />
                <text
                    x="19"
                    y="13.5"
                    fontFamily="'Inter', system-ui, -apple-system, sans-serif"
                    fontSize="10"
                    fontWeight="800"
                    fill="var(--color-brand)"
                    textAnchor="middle"
                    letterSpacing="0.5"
                >
                    ERP
                </text>
            </g>

            {/* Tagline: CL */}
            <text
                x="192"
                y="26"
                fontFamily="'Inter', system-ui, -apple-system, sans-serif"
                fontSize="7"
                fontWeight="500"
                fill={subTextColor}
                letterSpacing="0.5"
            >
                CL
            </text>
        </svg>
    );
}
