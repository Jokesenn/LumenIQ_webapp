import { CardSkeleton } from "@/components/shared/skeleton";

export default function SeriesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-12 bg-zinc-900/50 rounded-xl animate-pulse w-1/3" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="h-[400px] bg-zinc-900/50 rounded-2xl animate-pulse" />
    </div>
  );
}
