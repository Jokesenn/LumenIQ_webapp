export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Navbar skeleton */}
      <div className="h-16 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
          <div className="h-8 w-28 bg-[var(--color-bg-surface)] rounded-lg animate-pulse" />
          <div className="hidden md:flex gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-20 bg-[var(--color-bg-surface)] rounded animate-pulse"
              />
            ))}
          </div>
          <div className="h-9 w-24 bg-[var(--color-bg-surface)] rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="h-12 w-3/4 bg-[var(--color-bg-surface)] rounded-xl mx-auto mb-4 animate-pulse" />
        <div className="h-12 w-1/2 bg-[var(--color-bg-surface)] rounded-xl mx-auto mb-8 animate-pulse" />
        <div className="h-5 w-2/3 bg-[var(--color-border)] rounded-lg mx-auto mb-3 animate-pulse" />
        <div className="h-5 w-1/2 bg-[var(--color-border)] rounded-lg mx-auto mb-10 animate-pulse" />
        <div className="flex justify-center gap-4">
          <div className="h-12 w-40 bg-[var(--color-bg-surface)] rounded-xl animate-pulse" />
          <div className="h-12 w-36 bg-[var(--color-border)] rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
