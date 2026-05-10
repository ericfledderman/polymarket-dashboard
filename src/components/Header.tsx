import { Search, RefreshCw } from 'lucide-react'

interface Props {
  search: string
  onSearch: (v: string) => void
  onRefresh: () => void
  isRefreshing: boolean
  lastUpdated: Date | null
}

export function Header({ search, onSearch, onRefresh, isRefreshing, lastUpdated }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex min-w-0 max-w-7xl flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 md:h-16 md:flex-row md:items-center md:py-0">
        {/* Logo + live */}
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] font-display text-base font-extrabold text-white">
            P
          </div>
          <span className="font-display min-w-0 text-sm font-semibold leading-tight tracking-tight sm:text-base">
            <span className="text-[var(--text)]">Polymarket</span>{' '}
            <span className="text-[var(--accent)]">Dashboard</span>
          </span>
          <div className="relative ml-0.5 flex shrink-0 items-center sm:ml-1">
            <div className="live-dot relative h-2 w-2 shrink-0 rounded-full bg-[var(--yes)]" />
            <span className="ml-1.5 font-mono text-[11px] font-medium tracking-wider text-[var(--yes)] sm:text-xs">
              LIVE
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-[480px] md:flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Search markets..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2 pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none transition-colors focus-visible:border-[var(--accent)]"
          />
        </div>

        {/* Time + refresh */}
        <div className="flex shrink-0 items-center justify-between gap-3 md:ml-auto md:justify-end">
          {lastUpdated && (
            <span className="font-mono text-xs font-medium text-[var(--muted)]">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-transparent px-2.5 py-1.5 text-[13px] font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
    </header>
  )
}
