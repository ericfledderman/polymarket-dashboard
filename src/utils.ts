export function formatVolume(n: number): string {
  if (!Number.isFinite(n)) return '$0'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

export function formatPct(price: number): string {
  return `${Math.round(price * 100)}%`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function daysUntil(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function probabilityColor(price: number): string {
  if (price >= 0.7) return 'var(--yes)'
  if (price <= 0.3) return 'var(--no)'
  return 'var(--muted)'
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}

/** Stable 32-bit hash for seeded mock data per market id. */
function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i)
  }
  return h >>> 0
}

/** Mulberry32 PRNG — deterministic from seed. */
function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface MockPricePoint {
  day: number
  price: number
}

/** Mock 30-day price series (0–1) for sparklines; stable per `seed` and loosely tied to `anchor`. */
export function generateMockPriceHistory(seed: string, days = 30, anchor = 0.5): MockPricePoint[] {
  const rng = mulberry32(hashSeed(seed))
  const points: number[] = []
  let p = clamp(rng() * 0.5 + 0.25, 0.08, 0.92)
  for (let d = 0; d < days - 1; d++) {
    points.push(p)
    p = clamp(p + (rng() - 0.5) * 0.12, 0.02, 0.98)
  }
  points.push(p)
  const last = points.length - 1
  points[last] = clamp(anchor * 0.55 + points[last] * 0.45, 0.02, 0.98)
  return points.map((price, day) => ({ day, price }))
}
