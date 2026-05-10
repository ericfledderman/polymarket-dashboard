import type { Market } from '../types'
import { formatVolume } from '../utils'
import { BarChart2, Droplets, Activity } from 'lucide-react'

interface Props {
  markets: Market[]
}

export function StatsBar({ markets }: Props) {
  const totalVolume = markets.reduce((s, m) => s + m.volume, 0)
  const totalLiquidity = markets.reduce((s, m) => s + m.liquidity, 0)
  const highCertainty = markets.filter(m => {
    const top = Math.max(...m.outcomes.map(o => o.price))
    return top >= 0.8
  }).length

  const stats = [
    { icon: <BarChart2 className="h-3.5 w-3.5" />, label: 'Total Volume', value: formatVolume(totalVolume) },
    { icon: <Droplets className="h-3.5 w-3.5" />, label: 'Total Liquidity', value: formatVolume(totalLiquidity) },
    { icon: <Activity className="h-3.5 w-3.5" />, label: 'High Certainty (≥80%)', value: String(highCertainty) },
  ]

  return (
    <div className="mb-8 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map(s => (
        <div
          key={s.label}
          className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:px-5 sm:py-4"
        >
          <div className="shrink-0 text-[var(--accent)]">{s.icon}</div>
          <div className="min-w-0">
            <div className="font-mono text-lg font-semibold text-[var(--text)]">{s.value}</div>
            <div className="mt-0.5 text-xs font-medium leading-snug text-[var(--muted)]">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
