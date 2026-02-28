export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navbar skeleton */}
      <div className="h-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
          <div className="h-8 w-28 bg-zinc-900/60 rounded-lg animate-pulse" />
          <div className="hidden md:flex gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-20 bg-zinc-900/40 rounded animate-pulse"
              />
            ))}
          </div>
          <div className="h-9 w-24 bg-zinc-900/60 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="h-12 w-3/4 bg-zinc-900/50 rounded-xl mx-auto mb-4 animate-pulse" />
        <div className="h-12 w-1/2 bg-zinc-900/50 rounded-xl mx-auto mb-8 animate-pulse" />
        <div className="h-5 w-2/3 bg-zinc-900/30 rounded-lg mx-auto mb-3 animate-pulse" />
        <div className="h-5 w-1/2 bg-zinc-900/30 rounded-lg mx-auto mb-10 animate-pulse" />
        <div className="flex justify-center gap-4">
          <div className="h-12 w-40 bg-zinc-900/50 rounded-xl animate-pulse" />
          <div className="h-12 w-36 bg-zinc-900/30 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-zinc-900/30 border border-white/[0.04] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
