import type { Market } from '../types'
import { MarketCard } from './MarketCard'

/** Expects the parent to pass the top markets (e.g. by volume) already sorted and sliced. */
interface Props {
  markets: Market[]
}

export function TrendingSection({ markets }: Props) {
  if (markets.length === 0) return null

  return (
    <section className="mb-8 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface2)] p-4 sm:mb-10 sm:p-6 md:p-8">
      <div className="mb-4 flex flex-col gap-1 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        <h2 className="font-display text-lg font-extrabold tracking-tight text-[var(--text)] sm:text-xl md:text-2xl">
          Trending <span aria-hidden>🔥</span>
        </h2>
        <span className="text-[13px] text-[var(--muted)] sm:text-sm">Top markets by volume</span>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
        {markets.map((market, i) => (
          <div key={market.id} className="min-w-0">
            <MarketCard market={market} variant="trending" fadeDelayMs={Math.min(i * 50, 200)} />
          </div>
        ))}
      </div>
    </section>
  )
}
