import { CardSkeleton, Skeleton } from "@/components/shared";

export default function DashboardLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="w-52 h-8 rounded-lg mb-2" />
          <Skeleton className="w-64 h-5 rounded-lg" />
        </div>
        <Skeleton className="w-40 h-10 rounded-xl" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Two columns: chart + actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <Skeleton className="w-48 h-6 rounded-lg mb-4" />
            <Skeleton className="w-full h-[250px] rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="w-40 h-6 rounded-lg" />
              <Skeleton className="w-8 h-5 rounded-full" />
            </div>
            <Skeleton className="w-full h-16 rounded-xl" />
            <Skeleton className="w-full h-16 rounded-xl" />
            <Skeleton className="w-full h-16 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Recent forecasts table skeleton */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-3">
        <Skeleton className="w-44 h-6 rounded-lg mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
