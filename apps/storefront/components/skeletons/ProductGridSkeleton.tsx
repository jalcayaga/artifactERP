import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="aspect-[4/5] sm:aspect-square bg-slate-100 relative">
                        <Skeleton className="h-full w-full" />
                    </div>
                    <div className="flex flex-1 flex-col space-y-2 p-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="mt-auto pt-4 flex items-center justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
