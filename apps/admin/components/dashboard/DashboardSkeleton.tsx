import React from 'react';

const DashboardSkeleton: React.FC = () => {
    return (
        <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
            {/* Row 1: Banner + Stats Loader */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 h-[320px] rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="xl:col-span-1 h-[320px] grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-full rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="h-full rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="h-full rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
            </div>

            {/* Row 2: Charts Loader */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 h-[400px] rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="xl:col-span-1 h-[400px] rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>

            {/* Row 3: Cards Loader */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
        </div>
    );
};

export default DashboardSkeleton;
