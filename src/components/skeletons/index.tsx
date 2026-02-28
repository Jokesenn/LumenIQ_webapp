import { Skeleton } from "@/components/ui/skeleton";

// METRIC CARD
export function MetricCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5">
      <Skeleton className="h-10 w-10 rounded-lg mb-4" />
      <Skeleton className="h-3 w-16 mb-3" />
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function MetricCardsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  );
}

// CHART
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex gap-4" style={{ height }}>
        <div className="flex flex-col justify-between py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
        <div className="flex-1 flex items-end gap-1 pb-6">
          {[45, 62, 38, 71, 55, 48, 66, 40, 73, 52, 59, 43, 68, 50, 63, 37, 70, 46, 57, 42].map((h, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-2 pl-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-12" />
        ))}
      </div>
    </div>
  );
}

// SERIES LIST
export function SeriesRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-8 rounded" />
            <Skeleton className="h-5 w-8 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <Skeleton className="h-4 w-12 mb-1" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}

export function SeriesListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <SeriesRowSkeleton key={i} />
      ))}
    </div>
  );
}

// SERIES DETAIL PAGE
export function SeriesDetailSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-7 w-10 rounded-lg" />
              <Skeleton className="h-7 w-10 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Metrics */}
      <MetricCardsGridSkeleton count={4} />

      {/* Chart */}
      <ChartSkeleton height={350} />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <Skeleton className="h-5 w-40 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <Skeleton className="h-5 w-40 mb-6" />
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// RESULTS PAGE
export function ResultsPageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Metric gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart */}
      <ChartSkeleton height={300} />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="grid grid-cols-2 gap-6">
            <SeriesListSkeleton count={5} />
            <SeriesListSkeleton count={5} />
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <Skeleton className="h-5 w-40 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
