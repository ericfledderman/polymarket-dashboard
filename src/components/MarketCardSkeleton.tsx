export function MarketCardSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="h-5 w-20 rounded skeleton-shimmer" />
        <div className="h-4 w-24 rounded skeleton-shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded-md skeleton-shimmer" />
        <div className="h-4 w-[88%] rounded-md skeleton-shimmer" />
        <div className="h-4 w-[70%] rounded-md skeleton-shimmer" />
      </div>
      <div className="h-14 w-full rounded-md skeleton-shimmer" />
      <div className="space-y-2">
        <div className="flex justify-between gap-2">
          <div className="h-4 w-20 rounded skeleton-shimmer" />
          <div className="h-4 w-20 rounded skeleton-shimmer" />
        </div>
        <div className="h-1.5 w-full rounded-full skeleton-shimmer" />
      </div>
      <div className="flex justify-between gap-2 border-t border-[var(--border)] pt-2">
        <div className="h-3 w-28 rounded skeleton-shimmer" />
        <div className="h-3 w-24 rounded skeleton-shimmer" />
      </div>
    </div>
  )
}
