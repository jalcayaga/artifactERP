'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, ShoppingBag } from 'lucide-react';
import { Card } from "@material-tailwind/react";

const StatBox = ({
    icon: Icon,
    label,
    value,
    trend,
    color,
}: {
    icon: any;
    label: string;
    value: string;
    trend: string;
    color: 'pink' | 'blue' | 'green';
}) => {
    const bgColors = {
        pink: 'bg-pink-500/10 text-pink-500',
        blue: 'bg-blue-500/10 text-blue-500',
        green: 'bg-emerald-500/10 text-emerald-500',
    };

    const iconBg = {
        pink: 'bg-pink-500',
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
    };

    return (
        <Card className="rounded-3xl bg-[#1e293b] p-6 shadow-sm border border-blue-gray-100/5 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl ${iconBg[color]} flex items-center justify-center text-white mb-4 shadow-lg shadow-${color}-500/30`}>
                <Icon className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
            <p className="text-blue-gray-200 text-sm mb-4">{label}</p>

            <div className="flex items-center gap-1 text-xs font-medium">
                <span className={trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}>
                    {trend}
                </span>
                <span className="text-slate-400">vs last month</span>
            </div>
        </Card>
    );
};

const StatsGroup: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <StatBox
                icon={RefreshCw}
                label="Refunds"
                value="434"
                trend="-12%"
                color="blue"
            />
            <StatBox
                icon={ShoppingBag}
                label="Sales"
                value="2,358"
                trend="+23%"
                color="pink"
            />
            <StatBox
                icon={DollarSign}
                label="Earnings"
                value="$245k"
                trend="+8%"
                color="green"
            />
        </div>
    );
};

export default StatsGroup;
