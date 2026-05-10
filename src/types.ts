export interface Market {
  id: string
  question: string
  slug: string
  endDate: string
  category: string
  volume: number
  liquidity: number
  active: boolean
  closed: boolean
  outcomes: Outcome[]
  tags?: string[]
}

export interface Outcome {
  id: string
  title: string
  price: number // 0–1 probability
}

export type SortKey = 'volume' | 'liquidity' | 'endDate' | 'probability'
export type Category = 'All' | 'Politics' | 'Crypto' | 'Sports' | 'Science' | 'Tech' | 'Other'
