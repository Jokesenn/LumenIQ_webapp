import { Skeleton } from "@/components/ui/skeleton";

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Metric Gauge Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col items-center"
          >
            <Skeleton className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] rounded-full" />
            <Skeleton className="w-16 h-5 mt-4 rounded" />
            <Skeleton className="w-20 h-4 mt-2 rounded" />
            <Skeleton className="w-32 h-3 mt-2 rounded" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
        <Skeleton className="w-48 h-6 rounded mb-6" />
        <Skeleton className="w-full h-[350px] rounded-xl" />
      </div>

      {/* Bottom Grid: Top/Bottom + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Skeleton className="w-32 h-5 mb-4 rounded" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-12 rounded-xl mb-2" />
              ))}
            </div>
            <div>
              <Skeleton className="w-28 h-5 mb-4 rounded" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-12 rounded-xl mb-2" />
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <Skeleton className="w-24 h-5 mb-4 rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-10 rounded-lg mb-2" />
          ))}
        </div>
      </div>

      {/* ABC/XYZ Matrix */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
        <Skeleton className="w-44 h-6 mb-6 rounded" />
        <div className="grid grid-cols-4 gap-2">
          <div />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
          {Array.from({ length: 3 }).map((_, row) => (
            <div key={row} className="contents">
              <Skeleton className="h-16 rounded-lg" />
              {Array.from({ length: 3 }).map((_, col) => (
                <Skeleton key={col} className="h-16 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SeriesTabSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-36 h-6 rounded" />
        <Skeleton className="w-[180px] h-9 rounded-lg" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div>
                <Skeleton className="w-40 h-4 rounded mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="w-6 h-5 rounded" />
                  <Skeleton className="w-6 h-5 rounded" />
                  <Skeleton className="w-16 h-4 rounded" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <Skeleton className="w-14 h-5 rounded mb-1" />
                <Skeleton className="w-10 h-3 rounded" />
              </div>
              <Skeleton className="w-4 h-4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ModelsTabSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
      <Skeleton className="w-48 h-6 mb-6 rounded" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-8 h-3 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-20 h-3 rounded" />
                <Skeleton className="w-10 h-4 rounded" />
              </div>
            </div>
            <Skeleton className="w-full h-3 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SynthesisTabSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-9 h-9 rounded-xl" />
        <div>
          <Skeleton className="w-24 h-5 rounded mb-1" />
          <Skeleton className="w-32 h-3 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 rounded w-full" />
        <Skeleton className="h-4 rounded w-3/4" />
        <Skeleton className="h-4 rounded w-5/6" />
        <Skeleton className="h-4 rounded w-2/3" />
      </div>
    </div>
  );
}

export function ResultsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div>
          <Skeleton className="w-48 h-7 rounded mb-2" />
          <div className="flex gap-4">
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-20 h-4 rounded" />
            <Skeleton className="w-28 h-4 rounded" />
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <Skeleton className="w-[380px] h-10 rounded-xl" />

      {/* Default overview tab */}
      <OverviewTabSkeleton />
    </div>
  );
}
