'use client';

import React from 'react';
import {
    ShoppingCart,
    FileText,
    User,
    Bell,
    AlertTriangle,
    Package,
    CreditCard,
    CheckCircle
} from 'lucide-react';

export interface Activity {
    id: string;
    type: 'order' | 'invoice' | 'user' | 'system' | 'alert' | 'inventory' | 'payment';
    actor: { name: string; avatar?: string } | 'system';
    action: string;
    target?: string;
    amount?: number;
    timestamp: Date;
    priority?: 'normal' | 'high' | 'critical';
}

interface ActivityFeedProps {
    activities: Activity[];
    maxItems?: number;
    onLoadMore?: () => void;
    isLoading?: boolean;
}

const getActivityIcon = (type: Activity['type']) => {
    const iconClass = "w-4 h-4";
    switch (type) {
        case 'order': return <ShoppingCart className={iconClass} />;
        case 'invoice': return <FileText className={iconClass} />;
        case 'user': return <User className={iconClass} />;
        case 'alert': return <AlertTriangle className={iconClass} />;
        case 'inventory': return <Package className={iconClass} />;
        case 'payment': return <CreditCard className={iconClass} />;
        case 'system': return <Bell className={iconClass} />;
        default: return <CheckCircle className={iconClass} />;
    }
};

const getActivityColor = (type: Activity['type'], priority?: Activity['priority']) => {
    if (priority === 'critical') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (priority === 'high') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';

    switch (type) {
        case 'order': return 'bg-blue-500/20 text-blue-400';
        case 'invoice': return 'bg-purple-500/20 text-purple-400';
        case 'payment': return 'bg-green-500/20 text-green-400';
        case 'alert': return 'bg-yellow-500/20 text-yellow-400';
        case 'inventory': return 'bg-cyan-500/20 text-cyan-400';
        default: return 'bg-[rgba(var(--brand-color),0.2)] text-[rgb(var(--brand-color))]';
    }
};

const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays}d`;
    return new Date(date).toLocaleDateString('es-CL');
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(amount);
};

const ActivityItem: React.FC<{ activity: Activity; isNew?: boolean }> = ({ activity, isNew }) => {
    const actorName = activity.actor === 'system' ? 'Sistema' : activity.actor.name;
    const isSystem = activity.actor === 'system';

    return (
        <div
            className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(var(--brand-color),0.05)] ${isNew ? 'animate-in slide-in-from-top-2 fade-in duration-500' : ''}`}
            role="listitem"
        >
            {/* Avatar/Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type, activity.priority)}`}>
                {isSystem ? (
                    getActivityIcon(activity.type)
                ) : (
                    <span className="text-sm font-bold">
                        {actorName.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-[rgb(var(--text-primary))]">
                    <span className="font-medium">{actorName}</span>
                    {' '}{activity.action}
                    {activity.target && (
                        <span className="text-[rgb(var(--brand-color))] font-medium"> {activity.target}</span>
                    )}
                    {activity.amount && (
                        <span className="text-[rgb(var(--brand-color))] font-bold"> {formatCurrency(activity.amount)}</span>
                    )}
                </p>
                <p className="text-xs text-[rgb(var(--text-secondary))] mt-0.5">
                    {formatRelativeTime(activity.timestamp)}
                </p>
            </div>

            {/* Priority indicator */}
            {activity.priority && activity.priority !== 'normal' && (
                <div className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.type, activity.priority)}`}>
                    {activity.priority === 'critical' ? '⚠️ Crítico' : '⚡ Alto'}
                </div>
            )}
        </div>
    );
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
    activities,
    maxItems = 5,
    onLoadMore,
    isLoading = false,
}) => {
    const displayActivities = activities.slice(0, maxItems);

    return (
        <div className="card-premium overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[rgba(var(--border-color),0.1)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">
                        Actividad Reciente
                    </h3>
                    {/* Live indicator */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </div>
                </div>
                {onLoadMore && (
                    <button
                        onClick={onLoadMore}
                        className="text-sm text-[rgb(var(--brand-color))] hover:underline font-medium"
                    >
                        Ver todo
                    </button>
                )}
            </div>

            {/* Activity List */}
            <div className="divide-y divide-[rgba(var(--border-color),0.05)]" role="list" aria-label="Lista de actividad reciente">
                {isLoading ? (
                    <div className="p-6 text-center text-[rgb(var(--text-secondary))]">
                        Cargando actividad...
                    </div>
                ) : displayActivities.length > 0 ? (
                    displayActivities.map((activity, index) => (
                        <ActivityItem
                            key={activity.id}
                            activity={activity}
                            isNew={index === 0}
                        />
                    ))
                ) : (
                    <div className="p-6 text-center text-[rgb(var(--text-secondary))] italic">
                        No hay actividad reciente
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
