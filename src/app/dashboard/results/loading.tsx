import { CardSkeleton } from "@/components/shared/skeleton";

export default function ResultsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-12 bg-zinc-900/50 rounded-xl animate-pulse w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
