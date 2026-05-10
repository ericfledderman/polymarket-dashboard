import type { Market } from './types'

const BASE = import.meta.env.VITE_GAMMA_BASE_URL ?? '/api'

interface GammaMarket {
  id: string
  question: string
  slug: string
  endDate: string
  volume: number | string | null
  liquidity: number | string | null
  active: boolean
  closed: boolean
  tags?: Array<{ id: string; label: string }>
  tokens?: Array<{ outcome: string; price: number | string }>
  outcomePrices?: string // JSON string like '["0.72","0.28"]'
  outcomes?: string      // JSON string like '["Yes","No"]'
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function inferCategory(question: string, tags?: Array<{ label: string }>): string {
  const tagLabels = tags?.map(t => t.label.toLowerCase()) ?? []
  const q = question.toLowerCase()

  if (tagLabels.some(t => t.includes('politic') || t.includes('election') || t.includes('president'))
    || /election|president|senate|congress|vote|biden|trump|harris/i.test(q)) return 'Politics'
  if (tagLabels.some(t => t.includes('crypto') || t.includes('bitcoin') || t.includes('eth'))
    || /bitcoin|btc|ethereum|eth|crypto|defi|nft|solana/i.test(q)) return 'Crypto'
  if (tagLabels.some(t => t.includes('sport') || t.includes('nba') || t.includes('nfl') || t.includes('soccer'))
    || /nba|nfl|mlb|nhl|ufc|fifa|world cup|championship|super bowl/i.test(q)) return 'Sports'
  if (/ai|openai|anthropic|model|gpt|llm|tech|apple|google|microsoft|meta/i.test(q)) return 'Tech'
  if (/nasa|science|climate|fda|drug|study|research/i.test(q)) return 'Science'
  return 'Other'
}

function parseMarket(m: GammaMarket): Market {
  let outcomes: Market['outcomes']

  if (m.tokens && m.tokens.length > 0) {
    outcomes = m.tokens.map(t => ({
      id: t.outcome,
      title: t.outcome,
      price: toNumber(t.price, 0.5),
    }))
  } else if (m.outcomePrices && m.outcomes) {
    try {
      const prices: string[] = JSON.parse(m.outcomePrices)
      const titles: string[] = JSON.parse(m.outcomes)
      outcomes = titles.map((title, i) => ({
        id: title,
        title,
        price: parseFloat(prices[i] ?? '0'),
      }))
    } catch {
      outcomes = [{ id: 'yes', title: 'Yes', price: 0.5 }, { id: 'no', title: 'No', price: 0.5 }]
    }
  } else {
    outcomes = [{ id: 'yes', title: 'Yes', price: 0.5 }, { id: 'no', title: 'No', price: 0.5 }]
  }

  return {
    id: m.id,
    question: m.question,
    slug: m.slug,
    endDate: m.endDate,
    volume: toNumber(m.volume),
    liquidity: toNumber(m.liquidity),
    active: m.active,
    closed: m.closed,
    outcomes,
    category: inferCategory(m.question, m.tags),
    tags: m.tags?.map(t => t.label),
  }
}

export async function fetchMarkets(limit = 50): Promise<Market[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    active: 'true',
    closed: 'false',
    order: 'volume',
    ascending: 'false',
  })

  const res = await fetch(`${BASE}/markets?${params}`)
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`)

  const data: GammaMarket[] = await res.json()
  return data.map(parseMarket)
}

export async function fetchMarket(id: string): Promise<Market> {
  const res = await fetch(`${BASE}/markets/${id}`)
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`)
  const data: GammaMarket = await res.json()
  return parseMarket(data)
}
