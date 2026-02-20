import React from 'react';
import { Tooltip } from "@material-tailwind/react";
import { CloudIcon, CloudArrowUpIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

interface SyncBadgeProps {
    pendingCount: number;
    isOffline: boolean;
    onSync: () => void;
}

export const SyncBadge: React.FC<SyncBadgeProps> = ({ pendingCount, isOffline, onSync }) => {
    const isSyncing = false; // logic moved to parent or needs to be passed

    return (
        <Tooltip content={isOffline ? "Modo Offline Activo" : pendingCount > 0 ? "Click para sincronizar" : "Sistema Online"}>
            <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer transition-colors ${isOffline
                    ? 'bg-orange-500/10 border-orange-500/50 text-orange-500'
                    : pendingCount > 0
                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-500'
                        : 'bg-green-500/10 border-green-500/50 text-green-500'
                    }`}
                onClick={onSync}
            >
                {/* Simplified logic since parent handles loading state visually if needed, 
                    but here we just show state */}
                {isOffline ? (
                    <CloudIcon className="h-4 w-4" />
                ) : pendingCount > 0 ? (
                    <CloudArrowUpIcon className="h-4 w-4" />
                ) : (
                    <CloudIcon className="h-4 w-4" />
                )}
                <span className="text-xs font-bold uppercase">
                    {isOffline ? "Offline" : pendingCount > 0 ? `${pendingCount} Pendientes` : "Online"}
                </span>
            </div>
        </Tooltip>
    );
};
