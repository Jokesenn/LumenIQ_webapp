import { CardSkeleton, Skeleton } from "@/components/shared";

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="w-48 h-8 rounded-lg mb-2" />
        <Skeleton className="w-72 h-5 rounded-lg" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Main content skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
            <Skeleton className="w-40 h-6 rounded-lg" />
            <Skeleton className="w-full h-12 rounded-xl" />
            <Skeleton className="w-full h-12 rounded-xl" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
            <Skeleton className="w-32 h-5 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-xl" />
            <Skeleton className="w-full h-10 rounded-xl" />
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
            <Skeleton className="w-40 h-5 rounded-lg" />
            <Skeleton className="w-full h-8 rounded-lg" />
            <Skeleton className="w-full h-8 rounded-lg" />
            <Skeleton className="w-full h-8 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
