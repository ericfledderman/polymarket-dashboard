import { useMemo } from 'react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import type { Market } from '../types'
import {
  formatVolume,
  formatPct,
  formatDate,
  daysUntil,
  probabilityColor,
  generateMockPriceHistory,
} from '../utils'
import { Clock, TrendingUp } from 'lucide-react'

export type MarketCardVariant = 'default' | 'trending'

interface Props {
  market: Market
  variant?: MarketCardVariant
  /** Stagger delay for list entrance — passed as CSS var only. */
  fadeDelayMs?: number
}

export function MarketCard({ market, variant = 'default', fadeDelayMs = 0 }: Props) {
  const isTrending = variant === 'trending'
  const yesOutcome = market.outcomes.find(o => o.title.toLowerCase() === 'yes') ?? market.outcomes[0]
  const noOutcome = market.outcomes.find(o => o.title.toLowerCase() === 'no') ?? market.outcomes[1]
  const yesPct = yesOutcome?.price ?? 0.5
  const days = daysUntil(market.endDate)
  const isUrgent = days <= 7 && days >= 0
  const isExpired = days < 0

  const chartData = useMemo(
    () => generateMockPriceHistory(market.id, 30, yesPct),
    [market.id, yesPct],
  )
  const strokeColor = probabilityColor(yesPct)

  const pad = isTrending ? 'p-4 sm:p-6' : 'p-4 sm:p-5'
  const titleSize = isTrending ? 'text-base' : 'text-sm'
  const chartH = isTrending ? 72 : 56

  return (
    <div
      className={`market-card fade-up flex min-w-0 cursor-pointer flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] ${pad}`}
      style={{ ['--fade-delay' as string]: `${fadeDelayMs}ms` }}
      onClick={() => window.open(`https://polymarket.com/event/${market.slug}`, '_blank')}
      role="link"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          window.open(`https://polymarket.com/event/${market.slug}`, '_blank')
        }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-dim)] sm:text-xs">
          {market.category}
        </span>
        <span
          className={`flex items-center gap-1 font-mono text-xs font-medium ${
            isUrgent ? 'text-[var(--no)]' : 'text-[var(--muted)]'
          }`}
        >
          <Clock className="h-3 w-3 shrink-0" aria-hidden />
          {isExpired ? 'Closed' : isUrgent ? `${days}d left` : formatDate(market.endDate)}
        </span>
      </div>

      <p className={`min-w-0 grow font-semibold leading-snug text-[var(--text)] ${titleSize}`}>{market.question}</p>

      {/* Explicit pixel height + min-w-0 so ResponsiveContainer never measures -1 in grid/flex */}
      <div className="w-full min-w-0 shrink-0 overflow-hidden rounded-md" style={{ height: chartH }}>
        <ResponsiveContainer
          className="min-h-0 min-w-0"
          width="100%"
          height={chartH}
          minWidth={0}
          minHeight={0}
          debounce={32}
        >
          <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <Line
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={isTrending ? 2 : 1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="min-w-0">
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-sm font-bold">
          <span className="text-[var(--yes)]">
            {yesOutcome?.title ?? 'Yes'}{' '}
            <span className="font-mono font-semibold">{formatPct(yesPct)}</span>
          </span>
          {noOutcome && (
            <span className="text-[var(--no)]">
              {noOutcome.title}{' '}
              <span className="font-mono font-semibold">{formatPct(noOutcome.price)}</span>
            </span>
          )}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--no-dim)]">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${yesPct * 100}%`,
              background: strokeColor,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2 text-[13px] font-medium text-[var(--muted)]">
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3 shrink-0" aria-hidden />
          Vol: <span className="font-mono text-[var(--text)]">{formatVolume(market.volume)}</span>
        </span>
        <span>
          Liq: <span className="font-mono text-[var(--text)]">{formatVolume(market.liquidity)}</span>
        </span>
      </div>
    </div>
  )
}
