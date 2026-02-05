'use client';

import React from 'react';

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => (
    <div
        className={`animate-pulse bg-gradient-to-r from-[rgba(var(--bg-secondary),0.8)] via-[rgba(var(--bg-secondary),0.4)] to-[rgba(var(--bg-secondary),0.8)] bg-[length:200%_100%] rounded ${className}`}
        style={{ animation: 'shimmer 1.5s infinite', ...style }}
    />
);

export const HeroMetricSkeleton: React.FC = () => (
    <div className="card-premium p-8">
        <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="w-32 h-4" />
        </div>
        <div className="flex items-end justify-between">
            <div>
                <Skeleton className="w-48 h-12 mb-3" />
                <Skeleton className="w-24 h-5" />
            </div>
            <Skeleton className="w-40 h-16 rounded-lg" />
        </div>
    </div>
);

export const KPICardSkeleton: React.FC = () => (
    <div className="card-premium p-6">
        <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <Skeleton className="w-24 h-3" />
        </div>
        <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
                <Skeleton className="w-28 h-8 mb-2" />
                <Skeleton className="w-16 h-4" />
            </div>
            <Skeleton className="w-20 h-9 rounded" />
        </div>
    </div>
);

export const ActivityFeedSkeleton: React.FC = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1">
                    <Skeleton className="w-3/4 h-4 mb-2" />
                    <Skeleton className="w-1/2 h-3" />
                </div>
                <Skeleton className="w-16 h-3" />
            </div>
        ))}
    </div>
);

export const ChartSkeleton: React.FC = () => (
    <div className="h-[300px] flex flex-col">
        <div className="flex gap-2 mb-4">
            <Skeleton className="w-16 h-8 rounded-lg" />
            <Skeleton className="w-16 h-8 rounded-lg" />
            <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
        <div className="flex-1 flex items-end gap-2">
            {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
                <Skeleton
                    key={i}
                    className="flex-1 rounded-t-lg"
                    style={{ height: `${h}%` }}
                />
            ))}
        </div>
    </div>
);

// Add shimmer animation to globals.css via style tag
const ShimmerStyle = () => (
    <style jsx global>{`
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `}</style>
);

export default Skeleton;
