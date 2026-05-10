import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMarkets } from './api'
import type { Category, SortKey } from './types'
import { Header } from './components/Header'
import { Filters } from './components/Filters'
import { MarketCard } from './components/MarketCard'
import { StatsBar } from './components/StatsBar'
import { TrendingSection } from './components/TrendingSection'
import { MarketCardSkeleton } from './components/MarketCardSkeleton'
import { daysUntil } from './utils'

function StatsBarSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4"
        >
          <div className="h-9 w-9 shrink-0 rounded-lg skeleton-shimmer" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-5 w-24 rounded skeleton-shimmer" />
            <div className="h-3 w-32 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  )
}

function FiltersSkeleton() {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-1 h-3 w-10 rounded skeleton-shimmer" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-16 rounded-full skeleton-shimmer" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 w-8 rounded skeleton-shimmer" />
        <div className="h-8 w-32 rounded-lg skeleton-shimmer" />
        <div className="h-3 w-20 rounded skeleton-shimmer" />
      </div>
    </div>
  )
}

export default function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>('All')
  const [sort, setSort] = useState<SortKey>('volume')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const { data: markets = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['markets'],
    queryFn: async () => {
      const data = await fetchMarkets(100)
      setLastUpdated(new Date())
      return data
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  })

  const filtered = useMemo(() => {
    let result = [...markets]
    if (category !== 'All') result = result.filter(m => m.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(m => m.question.toLowerCase().includes(q))
    }
    result.sort((a, b) => {
      switch (sort) {
        case 'volume':
          return b.volume - a.volume
        case 'liquidity':
          return b.liquidity - a.liquidity
        case 'endDate':
          return daysUntil(a.endDate) - daysUntil(b.endDate)
        case 'probability': {
          const topA = Math.max(...a.outcomes.map(o => o.price))
          const topB = Math.max(...b.outcomes.map(o => o.price))
          return topB - topA
        }
        default:
          return 0
      }
    })
    return result
  }, [markets, category, search, sort])

  const trendingMarkets = useMemo(
    () => [...markets].sort((a, b) => b.volume - a.volume).slice(0, 3),
    [markets],
  )

  const trendingIds = useMemo(() => new Set(trendingMarkets.map(m => m.id)), [trendingMarkets])

  const gridMarkets = useMemo(
    () => filtered.filter(m => !trendingIds.has(m.id)),
    [filtered, trendingIds],
  )

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header
        search={search}
        onSearch={setSearch}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        lastUpdated={lastUpdated}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="font-display mb-2 text-2xl font-extrabold tracking-tight text-[var(--text)] sm:text-3xl md:text-4xl">
            Polymarket <span className="text-[var(--accent)]">Dashboard</span>
          </h1>
          <p className="max-w-lg text-[15px] leading-relaxed text-[var(--muted)] sm:text-base">
            Live odds from the world&apos;s largest prediction market — volume, liquidity, and implied
            probabilities in one view.
          </p>
        </div>

        {isLoading && (
          <>
            <StatsBarSkeleton />
            <FiltersSkeleton />
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="min-w-0">
                  <MarketCardSkeleton />
                </div>
              ))}
            </div>
          </>
        )}

        {!isLoading && markets.length > 0 && <StatsBar markets={markets} />}
        {!isLoading && (
          <Filters category={category} sort={sort} onCategory={setCategory} onSort={setSort} total={filtered.length} />
        )}

        {!isLoading && !isError && markets.length > 0 && <TrendingSection markets={trendingMarkets} />}

        {isError && (
          <div className="rounded-xl bg-[var(--no-dim)] py-16 text-center text-[var(--no)]">
            <div className="text-[15px] font-semibold">Failed to load markets</div>
            <div className="mt-2 text-sm text-[var(--muted)]">
              Polymarket API may be unavailable. Try refreshing.
            </div>
          </div>
        )}

        {!isLoading && !isError && markets.length === 0 && (
          <div className="py-16 text-center text-[var(--muted)]">
            <div className="text-[15px] font-medium">No markets returned from the API.</div>
          </div>
        )}

        {!isLoading && !isError && markets.length > 0 && filtered.length === 0 && (
          <div className="py-16 text-center text-[var(--muted)]">
            <div className="text-[15px] font-medium">No markets match your filters.</div>
          </div>
        )}

        {!isLoading && gridMarkets.length > 0 && (
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gridMarkets.map((market, i) => (
              <div key={market.id} className="min-w-0">
                <MarketCard market={market} fadeDelayMs={Math.min(i * 30, 300)} />
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="mt-12 border-t border-[var(--border)] px-4 py-6 text-center text-[13px] leading-relaxed text-[var(--muted)] sm:px-6 sm:py-8 sm:text-sm">
        <span className="font-mono">
          Data from{' '}
          <a
            href="https://polymarket.com"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            Polymarket
          </a>
          {' '}
          · Refreshes every 60s · Not financial advice
        </span>
      </footer>
    </div>
  )
}
